"use strict";

const TASKS = [
    {
        id: "variables",
        title: "1. Variables",
        instruction: "Create a variable called score and store the integer 10 in it.",
        starter: `# Create a variable called score and store 10


print(score)`,
        hint: "Use the variable name, an equals sign and the value: variable = value",
        solution: `score = 10

print(score)`,
        check(result, code) {
            const score = result.snapshot.score;
            if (!score?.exists) return fail("Create a variable called score.");
            if (score.type !== "int") return fail("score should store an integer, not a different data type.");
            if (score.value !== 10) return fail("score exists, but it should contain the value 10.");
            if (!/\bscore\s*=\s*10\b/.test(code)) return fail("Assign 10 to score using score = 10.");
            return pass("Well done — score stores the integer 10.");
        }
    },
    {
        id: "data-types",
        title: "2. Data Types",
        instruction: "Complete the variables using a string, integer, float and Boolean.",
        starter: `# Complete the four variables
name =
age =
height =
enrolled =

print(name, age, height, enrolled)`,
        hint: "Strings need quotation marks. True begins with a capital T and does not use quotation marks.",
        solution: `name = "Aisha"
age = 17
height = 1.68
enrolled = True

print(name, age, height, enrolled)`,
        check(result) {
            const { name, age, height, enrolled } = result.snapshot;
            if (!name?.exists || name.type !== "str" || name.value !== "Aisha") {
                return fail('name should store the string "Aisha".');
            }
            if (!age?.exists || age.type !== "int" || age.value !== 17) {
                return fail("age should store the integer 17.");
            }
            if (!height?.exists || height.type !== "float" || height.value !== 1.68) {
                return fail("height should store the float 1.68.");
            }
            if (!enrolled?.exists || enrolled.type !== "bool" || enrolled.value !== true) {
                return fail("enrolled should store the Boolean value True.");
            }
            return pass("Correct — all four values use the required data types.");
        }
    },
    {
        id: "input",
        title: "3. Input",
        instruction: "Ask the user for their name and store the answer in a variable called name.",
        starter: `# Ask the user for their name


print("Hello", name)`,
        hint: "Use name = input(\"What is your name? \")",
        solution: `name = input("What is your name? ")

print("Hello", name)`,
        check(result, code) {
            const name = result.snapshot.name;
            if (!/\binput\s*\(/.test(code)) return fail("Use the input() function to ask the user a question.");
            if (!/\bname\s*=/.test(code)) return fail("Store the user's answer in a variable called name.");
            if (!name?.exists || name.type !== "str") return fail("name should contain the string entered in the terminal.");
            return pass("Well done — the user's answer is stored in name as a string.");
        }
    },
    {
        id: "casting",
        title: "4. Casting",
        instruction: "Ask for the user's age, cast it to an integer and display their age next year.",
        starter: `# Ask for the user's age and convert it to an integer


print("Next year you will be", age + 1)`,
        hint: "Place input() inside int(): age = int(input(\"How old are you? \"))",
        solution: `age = int(input("How old are you? "))

print("Next year you will be", age + 1)`,
        check(result, code) {
            const age = result.snapshot.age;
            if (!/\binput\s*\(/.test(code)) return fail("Use input() to ask the user for their age.");
            if (!/\bint\s*\(/.test(code)) return fail("Use int() to cast the user's answer to an integer.");
            if (!age?.exists || age.type !== "int") return fail("age should contain an integer after casting.");
            return pass("Correct — input() collects a string and int() converts it to an integer.");
        }
    },
    {
        id: "combined",
        title: "5. Combined Practice",
        instruction: "Use variables, input and casting to complete the personalised welcome program.",
        starter: `course = "A Level Computer Science"

# Ask for the user's name


# Ask for their age and cast it to an integer


print("Hello", name)
print("You are", age, "years old.")
print("Welcome to", course)`,
        hint: "Create name with input(), then create age with int(input(...)).",
        solution: `course = "A Level Computer Science"

name = input("What is your name? ")
age = int(input("How old are you? "))

print("Hello", name)
print("You are", age, "years old.")
print("Welcome to", course)`,
        check(result, code) {
            const { course, name, age } = result.snapshot;
            const inputCount = (code.match(/\binput\s*\(/g) || []).length;
            if (!course?.exists || course.type !== "str") return fail("Keep the course variable as a string.");
            if (inputCount < 2) return fail("Use input() twice: once for the name and once for the age.");
            if (!name?.exists || name.type !== "str") return fail("Store the first answer in a string variable called name.");
            if (!age?.exists || age.type !== "int") return fail("Store the age as an integer using int().");
            return pass("Excellent — your program combines variables, input and casting.");
        }
    }
];

const STORAGE_PREFIX = "nptc-python-practice-v1:";
const SNAPSHOT_NAMES = ["score", "name", "age", "height", "enrolled", "course"];

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

let currentTask = TASKS[0];
let worker = null;
let workerReady = false;
let isRunning = false;
let pendingRun = null;
let currentTerminalInput = null;
let saveTimer = null;
const attempts = Object.fromEntries(TASKS.map(task => [task.id, 0]));

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
    return TASKS.find(task => task.id === id) || TASKS[0];
}

function setStatus(text, kind) {
    elements.pythonStatus.textContent = text;
    elements.pythonStatus.className = `status-pill status-${kind}`;
}

function populateTasks() {
    for (const task of TASKS) {
        const option = document.createElement("option");
        option.value = task.id;
        option.textContent = task.title;
        elements.taskSelect.appendChild(option);
    }

    const requestedTask = new URLSearchParams(window.location.search).get("task");
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

populateTasks();
clearTerminal(true);
createWorker();
