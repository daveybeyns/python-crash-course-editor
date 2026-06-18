"use strict";

const PYODIDE_VERSION = "0.29.4";
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodide = null;
let snapshotNames = [];
let inputResolver = null;
let outputBuffer = "";
let outputFlushTimer = null;
let decoder = new TextDecoder("utf-8");

function queueOutput(text) {
    outputBuffer += text;
    if (outputFlushTimer !== null) return;
    outputFlushTimer = setTimeout(flushOutput, 0);
}

function flushOutput() {
    if (outputFlushTimer !== null) {
        clearTimeout(outputFlushTimer);
        outputFlushTimer = null;
    }
    if (!outputBuffer) return;
    postMessage({ type: "output", text: outputBuffer });
    outputBuffer = "";
}

self.terminalInput = function terminalInput() {
    flushOutput();
    postMessage({ type: "inputRequest" });
    return new Promise(resolve => {
        inputResolver = resolve;
    });
};

async function initialise() {
    try {
        importScripts(`${PYODIDE_BASE}pyodide.js`);
        pyodide = await loadPyodide({ indexURL: PYODIDE_BASE });

        pyodide.setStdout({
            raw(byte) {
                queueOutput(decoder.decode(Uint8Array.of(byte), { stream: true }));
            }
        });

        pyodide.setStderr({
            raw(byte) {
                queueOutput(decoder.decode(Uint8Array.of(byte), { stream: true }));
            }
        });

        const pythonVersion = pyodide.runPython("import platform; platform.python_version()");
        postMessage({ type: "ready", pythonVersion, pyodideVersion: PYODIDE_VERSION });
    } catch (error) {
        postMessage({
            type: "loadingError",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

async function runStudentCode(code) {
    const executionGlobals = pyodide.runPython("dict()");
    executionGlobals.set("__student_code", code);
    executionGlobals.set("__snapshot_names_json", JSON.stringify(snapshotNames));

    const wrapper = `
import builtins as __builtins_module
import json as __json
import traceback as __traceback
from js import terminalInput as __terminal_input_js
from pyodide.ffi import run_sync as __run_sync

__student_globals = {"__name__": "__main__"}
__original_input = __builtins_module.input
__student_ok = False
__student_error = ""

def __browser_input(prompt=""):
    if prompt:
        print(prompt, end="", flush=True)
    return str(__run_sync(__terminal_input_js()))

try:
    __builtins_module.input = __browser_input
    exec(compile(__student_code, "<student-code>", "exec"), __student_globals)
    __student_ok = True
except BaseException as __error:
    if isinstance(__error, SyntaxError):
        __line = __error.lineno or "?"
        __source = (__error.text or "").strip()
        __student_error = f"Line {__line}: SyntaxError: {__error.msg}"
        if __source:
            __student_error += f"\\n    {__source}"
    else:
        __tb = __traceback.extract_tb(__error.__traceback__)
        __student_frames = [__frame for __frame in __tb if __frame.filename == "<student-code>"]
        if __student_frames:
            __frame = __student_frames[-1]
            __student_error = f"Line {__frame.lineno}: {type(__error).__name__}: {__error}"
        else:
            __student_error = f"{type(__error).__name__}: {__error}"
finally:
    __builtins_module.input = __original_input

__snapshot = {}
for __name in __json.loads(__snapshot_names_json):
    if __name in __student_globals:
        __value = __student_globals[__name]
        __entry = {
            "exists": True,
            "type": type(__value).__name__,
            "repr": repr(__value)
        }
        if isinstance(__value, (str, int, float, bool)) or __value is None:
            __entry["value"] = __value
        __snapshot[__name] = __entry
    else:
        __snapshot[__name] = {"exists": False}

__result_json = __json.dumps({
    "ok": __student_ok,
    "error": __student_error,
    "snapshot": __snapshot
}, ensure_ascii=False)
`;

    try {
        await pyodide.runPythonAsync(wrapper, { globals: executionGlobals });
        flushOutput();
        const resultJson = executionGlobals.get("__result_json");
        return JSON.parse(resultJson);
    } finally {
        executionGlobals.destroy();
    }
}

self.addEventListener("message", async event => {
    const message = event.data;

    if (message.type === "init") {
        snapshotNames = Array.isArray(message.snapshotNames) ? message.snapshotNames : [];
        if (!pyodide) await initialise();
        return;
    }

    if (message.type === "inputResponse") {
        if (inputResolver) {
            const resolve = inputResolver;
            inputResolver = null;
            resolve(String(message.value ?? ""));
        }
        return;
    }

    if (message.type === "run") {
        if (!pyodide) {
            postMessage({
                type: "runComplete",
                result: { ok: false, error: "Python has not finished loading.", snapshot: {} }
            });
            return;
        }

        try {
            const result = await runStudentCode(String(message.code ?? ""));
            flushOutput();
            postMessage({ type: "runComplete", result });
        } catch (error) {
            flushOutput();
            postMessage({
                type: "runComplete",
                result: {
                    ok: false,
                    error: error instanceof Error ? error.message : String(error),
                    snapshot: {}
                }
            });
        }
    }
});
