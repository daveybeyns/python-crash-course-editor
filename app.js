"use strict";

const STORAGE_PREFIX = "nptc-python-practice-v1:";
const MAX_TOPIC_NUMBER = 10;

let TASKS = [];
let SNAPSHOT_NAMES = [];
let visibleTasks = [];
let loadedTopics = [];
const elements = {
    taskSelect: document.getElementById("task-select"),
    taskInstruction: document.getElementById("task-instruction"),
    runButton: document.getElementById("run-button"),
    stopButton: document.getElementById("stop-button"),
    checkButton: document.getElementById("check-button"),
    resetButton: document.getElementById("reset-button"),
    hintButton: document.getElementById("hint-button"),
    hintPanel: document.getElementById("hint-panel"),
    hintText: document.getElementById("hint-text"),
    solutionButton: document.getElementById("solution-button"),
    solutionCode: document.getElementById("solution-code"),
    solutionLocked: document.getElementById("solution-locked"),
    feedbackPanel: document.getElementById("feedback-panel"),
    pythonStatus: document.getElementById("python-status"),
    terminalOutput: document.getElementById("terminal-output"),
    clearTerminalButton: document.getElementById("clear-terminal-button")
};

const urlParams = new URLSearchParams(window.location.search);
const requestedTopicValue = urlParams.get("topic");
const requestedTopicNumber = requestedTopicValue === null || requestedTopicValue === ""
    ? null
    : Number.parseInt(requestedTopicValue, 10);

let currentTask = null;
let worker = null;
let workerReady = false;
let isRunning = false;
let pendingRun = null;
let currentTerminalInput = null;
let saveTimer = null;
let attempts = {};

async function importTopic(topicNumber) {
    const module = await import(`./topics/topic-${topicNumber}.js`);
    const topic = module.default;

    if (!topic || Number(topic.topic) !== topicNumber || !Array.isArray(topic.tasks)) {
        throw new Error(`topics/topic-${topicNumber}.js does not contain a valid topic definition.`);
    }

    return topic;
}

async function loadTopicFiles() {
    if (requestedTopicValue !== null &&
        (!Number.isInteger(requestedTopicNumber) || requestedTopicNumber < 1 || requestedTopicNumber > MAX_TOPIC_NUMBER)) {
        throw new Error(`The topic parameter must be a number from 1 to ${MAX_TOPIC_NUMBER}.`);
    }

    const topicNumbers = requestedTopicNumber === null
        ? Array.from({ length: MAX_TOPIC_NUMBER }, (_, index) => index + 1)
        : [requestedTopicNumber];

    loadedTopics = await Promise.all(topicNumbers.map(importTopic));

    TASKS = loadedTopics.flatMap(topic =>
        topic.tasks.map(task => ({ ...task, topic: Number(task.topic ?? topic.topic) }))
    );

    visibleTasks = requestedTopicNumber === null
        ? TASKS
        : TASKS.filter(task => task.topic === requestedTopicNumber);

    if (!visibleTasks.length) {
        const topicLabel = requestedTopicNumber === null ? "the available topics" : `Topic ${requestedTopicNumber}`;
        throw new Error(`No practice tasks have been added for ${topicLabel} yet.`);
    }

    const taskIds = new Set();
    for (const task of TASKS) {
        if (!task.id || taskIds.has(task.id)) {
            throw new Error(`Every task needs a unique id. Check the topic files for: ${task.id || "missing id"}.`);
        }
        if (typeof task.check !== "function") {
            throw new Error(`Task ${task.id} does not contain a check(result, code) function.`);
        }
        taskIds.add(task.id);
    }

    SNAPSHOT_NAMES = [...new Set(loadedTopics.flatMap(topic => topic.snapshotNames || []))];
    attempts = Object.fromEntries(TASKS.map(task => [task.id, 0]));
    currentTask = visibleTasks[0];
}

ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@1.44.0/src-min-noconflict");

ace.define("ace/theme/nptc_vs_dark", ["require", "exports", "module", "ace/lib/dom"], function(require, exports) {
    exports.isDark = true;
    exports.cssClass = "ace-nptc-vs-dark";
    exports.cssText = `
        .ace-nptc-vs-dark .ace_gutter { background: #252526; color: #858585; border-right: 1px solid #383838; }
        .ace-nptc-vs-dark { background-color: #1e1e1e; color: #d4d4d4; }
        .ace-nptc-vs-dark .ace_print-margin { width: 1px; background: #1e1e1e; }
        .ace-nptc-vs-dark .ace_cursor { color: #ffffff; }
        .ace-nptc-vs-dark .ace_marker-layer .ace_selection { background: #264f78; }
        .ace-nptc-vs-dark.ace_multiselect .ace_selection.ace_start { box-shadow: 0 0 3px 0 #1e1e1e; }
        .ace-nptc-vs-dark .ace_marker-layer .ace_active-line { background: #252526; }
        .ace-nptc-vs-dark .ace_gutter-active-line { background-color: #2f2f2f; }
        .ace-nptc-vs-dark .ace_keyword,
        .ace-nptc-vs-dark .ace_storage { color: #c586c0; }
        .ace-nptc-vs-dark .ace_variable,
        .ace-nptc-vs-dark .ace_identifier,
        .ace-nptc-vs-dark .ace_support.ace_type { color: #9cdcfe; }
        .ace-nptc-vs-dark .ace_entity.ace_name.ace_function,
        .ace-nptc-vs-dark .ace_support.ace_function { color: #dcdcaa; }
        .ace-nptc-vs-dark .ace_string { color: #ce9178; }
        .ace-nptc-vs-dark .ace_constant.ace_numeric { color: #b5cea8; }
        .ace-nptc-vs-dark .ace_comment { color: #6a9955; font-style: normal; }
        .ace-nptc-vs-dark .ace_constant.ace_language { color: #569cd6; }
        .ace-nptc-vs-dark .ace_paren,
        .ace-nptc-vs-dark .ace_punctuation,
        .ace-nptc-vs-dark .ace_operator { color: #d4d4d4; }
        .ace-nptc-vs-dark .ace_invisible { color: #404040; }
        .ace-nptc-vs-dark .ace_indent-guide { background: linear-gradient(to bottom, #404040 0%, #404040 50%, transparent 50%) right repeat-y; background-size: 1px 3px; }
    `;
    const dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
});

const editor = ace.edit("code-editor");
editor.setTheme("ace/theme/nptc_vs_dark");
editor.session.setMode("ace/mode/python");
editor.setOptions({
    fontFamily: 'Consolas, "Courier New", monospace',
    fontSize: "14px",
    showPrintMargin: false,
    showGutter: true,
    displayIndentGuides: true,
    highlightActiveLine: true,
    highlightGutterLine: true,
    wrap: false,
    tabSize: 4,
    useSoftTabs: true,
    behavioursEnabled: true,
    autoScrollEditorIntoView: false
});
editor.renderer.setScrollMargin(5, 5, 0, 0);
editor.commands.addCommand({
    name: "runCode",
    bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" },
    exec: () => elements.runButton.click()
});

editor.session.on("change", () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveCurrentCode, 250);
    hideFeedback();
});

function pass(message) {
    return { ok: true, message };
}

function fail(message) {
    return { ok: false, message };
}

function taskById(id) {
    return visibleTasks.find(task => task.id === id) || visibleTasks[0] || TASKS[0];
}

function setStatus(text, kind) {
    elements.pythonStatus.textContent = text;
    elements.pythonStatus.className = `status-pill status-${kind}`;
}

function populateTasks() {
    for (const task of visibleTasks) {
        const option = document.createElement("option");
        option.value = task.id;
        option.textContent = task.title;
        elements.taskSelect.appendChild(option);
    }

    const requestedTask = urlParams.get("task");
    currentTask = taskById(requestedTask);
    elements.taskSelect.value = currentTask.id;
    loadTask(currentTask.id, false);
}

function getSavedCode(task) {
    try {
        return localStorage.getItem(STORAGE_PREFIX + task.id) ?? task.starter;
    } catch {
        return task.starter;
    }
}

function saveCurrentCode() {
    try {
        localStorage.setItem(STORAGE_PREFIX + currentTask.id, editor.getValue());
    } catch {
        // The editor still works when browser storage is blocked.
    }
}

function loadTask(taskId, savePrevious = true) {
    if (savePrevious) saveCurrentCode();

    currentTask = taskById(taskId);
    elements.taskSelect.value = currentTask.id;
    elements.taskInstruction.textContent = currentTask.instruction;
    elements.hintText.textContent = currentTask.hint;
    elements.solutionCode.textContent = currentTask.solution;
    elements.solutionCode.hidden = true;
    elements.solutionButton.textContent = "Show solution";
    editor.setValue(getSavedCode(currentTask));
    editor.session.getUndoManager().reset();
    editor.moveCursorTo(0, 0);
    hideFeedback();
    closeHint();
    updateSolutionLock();
    clearTerminal(true);
}

function resetTask() {
    try {
        localStorage.removeItem(STORAGE_PREFIX + currentTask.id);
    } catch {
        // Ignore storage errors.
    }
    editor.setValue(currentTask.starter);
    editor.session.getUndoManager().reset();
    hideFeedback();
    clearTerminal(true);
    editor.focus();
}

function openHint() {
    elements.hintPanel.hidden = false;
    elements.hintButton.setAttribute("aria-expanded", "true");
}

function closeHint() {
    elements.hintPanel.hidden = true;
    elements.hintButton.setAttribute("aria-expanded", "false");
}

function updateSolutionLock() {
    const unlocked = attempts[currentTask.id] > 0;
    elements.solutionButton.disabled = !unlocked;
    elements.solutionLocked.hidden = unlocked;
}

function toggleSolution() {
    const willShow = elements.solutionCode.hidden;
    elements.solutionCode.hidden = !willShow;
    elements.solutionButton.textContent = willShow ? "Hide solution" : "Show solution";
}

function showFeedback(message, type) {
    elements.feedbackPanel.hidden = false;
    elements.feedbackPanel.className = `feedback-panel feedback-${type}`;
    elements.feedbackPanel.textContent = message;
}

function hideFeedback() {
    elements.feedbackPanel.hidden = true;
    elements.feedbackPanel.textContent = "";
}

function clearTerminal(showPlaceholder = false) {
    if (currentTerminalInput) {
        currentTerminalInput.remove();
        currentTerminalInput = null;
    }
    elements.terminalOutput.textContent = "";
    if (showPlaceholder) {
        const placeholder = document.createElement("span");
        placeholder.className = "terminal-placeholder";
        placeholder.textContent = "Run the code to see its output here.";
        elements.terminalOutput.appendChild(placeholder);
    }
}

function appendTerminal(text, className = "") {
    const placeholders = elements.terminalOutput.querySelectorAll(".terminal-placeholder");
    placeholders.forEach(item => item.remove());

    const node = document.createElement("span");
    if (className) node.className = className;
    node.textContent = text;
    elements.terminalOutput.appendChild(node);
    elements.terminalOutput.scrollTop = elements.terminalOutput.scrollHeight;
}

function requestTerminalInput() {
    if (currentTerminalInput) currentTerminalInput.remove();

    const input = document.createElement("input");
    input.type = "text";
    input.className = "terminal-input";
    input.autocomplete = "off";
    input.autocapitalize = "off";
    input.spellcheck = false;
    input.setAttribute("aria-label", "Program input. Type an answer and press Enter.");

    input.addEventListener("keydown", event => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        const value = input.value;
        const replacement = document.createTextNode(value + "\n");
        input.replaceWith(replacement);
        currentTerminalInput = null;
        elements.terminalOutput.scrollTop = elements.terminalOutput.scrollHeight;
        worker?.postMessage({ type: "inputResponse", value });
    });

    currentTerminalInput = input;
    elements.terminalOutput.appendChild(input);
    elements.terminalOutput.scrollTop = elements.terminalOutput.scrollHeight;
    input.focus();
}

function setRunningState(running) {
    isRunning = running;
    elements.runButton.hidden = running;
    elements.stopButton.hidden = !running;
    elements.checkButton.disabled = running || !workerReady;
    elements.taskSelect.disabled = running;
    elements.resetButton.disabled = running;
    elements.hintButton.disabled = running;
    elements.clearTerminalButton.disabled = running;
    editor.setReadOnly(running);

    if (running) setStatus("Running…", "running");
    else if (workerReady) setStatus("Python ready", "ready");
}

function createWorker() {
    workerReady = false;
    elements.runButton.disabled = true;
    elements.checkButton.disabled = true;
    setStatus("Loading Python…", "loading");

    worker = new Worker("python-worker.js");

    worker.addEventListener("message", event => {
        const message = event.data;

        if (message.type === "ready") {
            workerReady = true;
            elements.runButton.disabled = false;
            elements.checkButton.disabled = false;
            setStatus(`Python ${message.pythonVersion}`, "ready");
            return;
        }

        if (message.type === "loadingError") {
            workerReady = false;
            setStatus("Python failed to load", "error");
            showFeedback("Python could not load. Check the internet connection and refresh the activity.", "error");
            appendTerminal(message.error + "\n", "terminal-error");
            pendingRun?.reject(new Error(message.error));
            pendingRun = null;
            setRunningState(false);
            return;
        }

        if (message.type === "output") {
            appendTerminal(message.text);
            return;
        }

        if (message.type === "inputRequest") {
            requestTerminalInput();
            return;
        }

        if (message.type === "runComplete") {
            setRunningState(false);
            const resolver = pendingRun;
            pendingRun = null;
            resolver?.resolve(message.result);
            return;
        }
    });

    worker.addEventListener("error", event => {
        workerReady = false;
        setStatus("Runner error", "error");
        appendTerminal(`Runner error: ${event.message}\n`, "terminal-error");
        pendingRun?.reject(new Error(event.message));
        pendingRun = null;
        setRunningState(false);
    });

    worker.postMessage({ type: "init", snapshotNames: SNAPSHOT_NAMES });
}

function restartWorker() {
    if (worker) worker.terminate();
    worker = null;
    currentTerminalInput = null;
    createWorker();
}

function executeCode() {
    if (!workerReady || isRunning) {
        return Promise.reject(new Error("Python is not ready."));
    }

    saveCurrentCode();
    hideFeedback();
    clearTerminal(false);
    attempts[currentTask.id] += 1;
    updateSolutionLock();
    setRunningState(true);

    return new Promise((resolve, reject) => {
        pendingRun = { resolve, reject };
        worker.postMessage({
            type: "run",
            code: editor.getValue(),
            taskId: currentTask.id
        });
    });
}

async function runOnly() {
    try {
        const result = await executeCode();
        if (!result.ok) {
            appendTerminal(result.error + "\n", "terminal-error");
        } else if (!elements.terminalOutput.textContent.trim()) {
            appendTerminal("[Program finished with no output]\n", "terminal-system");
        }
    } catch (error) {
        if (error.message !== "Program stopped.") {
            showFeedback(error.message, "error");
        }
    }
}

async function runAndCheck() {
    showFeedback("Running and checking your code…", "info");
    try {
        const result = await executeCode();
        if (!result.ok) {
            appendTerminal(result.error + "\n", "terminal-error");
            showFeedback("Fix the Python error shown in the terminal, then check again.", "error");
            return;
        }

        const outcome = currentTask.check(result, editor.getValue());
        showFeedback(outcome.message, outcome.ok ? "success" : "error");
    } catch (error) {
        if (error.message !== "Program stopped.") showFeedback(error.message, "error");
    }
}

function stopProgram() {
    if (!isRunning) return;

    if (currentTerminalInput) {
        currentTerminalInput.remove();
        currentTerminalInput = null;
    }

    appendTerminal("\n[Program stopped]\n", "terminal-system");
    pendingRun?.reject(new Error("Program stopped."));
    pendingRun = null;
    setRunningState(false);
    restartWorker();
}

elements.taskSelect.addEventListener("change", event => loadTask(event.target.value));
elements.runButton.addEventListener("click", runOnly);
elements.stopButton.addEventListener("click", stopProgram);
elements.checkButton.addEventListener("click", runAndCheck);
elements.resetButton.addEventListener("click", resetTask);
elements.hintButton.addEventListener("click", () => {
    if (elements.hintPanel.hidden) openHint();
    else closeHint();
});
elements.solutionButton.addEventListener("click", toggleSolution);
elements.clearTerminalButton.addEventListener("click", () => clearTerminal(true));

window.addEventListener("beforeunload", saveCurrentCode);

async function initialiseCodingLab() {
    try {
        await loadTopicFiles();
        populateTasks();
        clearTerminal(true);
        createWorker();
    } catch (error) {
        console.error(error);
        setStatus("Tasks failed to load", "error");
        elements.runButton.disabled = true;
        elements.checkButton.disabled = true;
        elements.taskSelect.disabled = true;
        elements.taskInstruction.textContent = "The practice tasks could not be loaded.";
        showFeedback(error instanceof Error ? error.message : String(error), "error");
        clearTerminal(false);
        appendTerminal(`[Task loading error] ${error instanceof Error ? error.message : String(error)}\n`, "terminal-error");
    }
}

initialiseCodingLab();
