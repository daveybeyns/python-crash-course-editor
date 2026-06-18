"use strict";

const TASKS = [
    {
        id: "variables",
        topic: 1,
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
        topic: 1,
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
        topic: 1,
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
        topic: 1,
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
        topic: 1,
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

    },
    {
        id: "selection-if",
        topic: 2,
        title: "6. Selection: Simple if",
        instruction: "Ask the user for their age. Display \"You are an adult.\" only when the age is 18 or over.",
        starter: `# Ask for the user's age and convert it to an integer
age =

# Display the message only when age is 18 or over
`,
        hint: "Use age = int(input(...)), then write if age >= 18: and indent the print() line.",
        solution: `age = int(input("Enter your age: "))

if age >= 18:
    print("You are an adult.")`,
        check(result, code) {
            const age = result.snapshot.age;
            if (!/\binput\s*\(/.test(code)) return fail("Use input() to ask for the user's age.");
            if (!/\bint\s*\(/.test(code)) return fail("Use int() to convert the answer to an integer.");
            if (!age?.exists || age.type !== "int") return fail("Store the age as an integer in a variable called age.");
            if (!/\bif\s+age\s*>=\s*18\s*:/.test(code)) return fail("Use the condition if age >= 18:");
            if (!/\bprint\s*\(\s*["']You are an adult\.["']\s*\)/.test(code)) {
                return fail('Display the message "You are an adult."');
            }
            return pass("Well done — your if statement runs when age is 18 or over.");
        }
    },
    {
        id: "selection-else",
        topic: 2,
        title: "7. Selection: if and else",
        instruction: "Ask for an integer. Display \"Positive\" when it is greater than 0; otherwise display \"Not positive\".",
        starter: `# Ask for an integer
number =

# Use if and else to display the correct message
`,
        hint: "Check whether number > 0. Remember that both the if and else lines need a colon.",
        solution: `number = int(input("Enter a number: "))

if number > 0:
    print("Positive")
else:
    print("Not positive")`,
        check(result, code) {
            const number = result.snapshot.number;
            if (!/\binput\s*\(/.test(code)) return fail("Use input() to ask for a number.");
            if (!/\bint\s*\(/.test(code)) return fail("Convert the answer to an integer using int().");
            if (!number?.exists || number.type !== "int") return fail("Store the integer in a variable called number.");
            if (!/\bif\s+number\s*>\s*0\s*:/.test(code)) return fail("Use the condition if number > 0:");
            if (!/\belse\s*:/.test(code)) return fail("Add an else block for numbers that are not positive.");
            if (!/\bprint\s*\(\s*["']Positive["']\s*\)/.test(code)) return fail('Display "Positive" in the if block.');
            if (!/\bprint\s*\(\s*["']Not positive["']\s*\)/.test(code)) return fail('Display "Not positive" in the else block.');
            return pass("Correct — your program chooses between the if and else paths.");
        }
    },
    {
        id: "selection-elif",
        topic: 2,
        title: "8. Selection: if, elif and else",
        instruction: "Ask for a mark. Display Distinction for 70 or more, Pass for 40–69, or Not passed for below 40.",
        starter: `# Ask for the mark and convert it to an integer
mark =

# Display Distinction, Pass or Not passed
`,
        hint: "Check mark >= 70 first, then use elif mark >= 40, followed by else.",
        solution: `mark = int(input("Enter your mark: "))

if mark >= 70:
    print("Distinction")
elif mark >= 40:
    print("Pass")
else:
    print("Not passed")`,
        check(result, code) {
            const mark = result.snapshot.mark;
            if (!/\binput\s*\(/.test(code)) return fail("Use input() to ask for the mark.");
            if (!/\bint\s*\(/.test(code)) return fail("Convert the mark to an integer using int().");
            if (!mark?.exists || mark.type !== "int") return fail("Store the integer in a variable called mark.");
            const distinction = code.search(/\bif\s+mark\s*>=\s*70\s*:/);
            const passMark = code.search(/\belif\s+mark\s*>=\s*40\s*:/);
            if (distinction === -1) return fail("Start with the condition if mark >= 70:");
            if (passMark === -1) return fail("Use elif mark >= 40: for a pass.");
            if (distinction > passMark) return fail("Check for Distinction before checking for Pass.");
            if (!/\belse\s*:/.test(code)) return fail("Use else for marks below 40.");
            if (!/\bprint\s*\(\s*["']Distinction["']\s*\)/.test(code)) return fail('Display "Distinction".');
            if (!/\bprint\s*\(\s*["']Pass["']\s*\)/.test(code)) return fail('Display "Pass".');
            if (!/\bprint\s*\(\s*["']Not passed["']\s*\)/.test(code)) return fail('Display "Not passed".');
            return pass("Excellent — Python checks the conditions from top to bottom.");
        }
    },
    {
        id: "selection-compare",
        topic: 2,
        title: "9. Selection: Compare two numbers",
        instruction: "Ask for two integers and say whether the first is greater than, less than or equal to the second.",
        starter: `# Ask for two integers
first_number =
second_number =

# Compare the numbers using if, elif and else
`,
        hint: "Use > for greater than, < for less than, and let else handle equal values.",
        solution: `first_number = int(input("Enter the first number: "))
second_number = int(input("Enter the second number: "))

if first_number > second_number:
    print("The first number is greater.")
elif first_number < second_number:
    print("The first number is smaller.")
else:
    print("The numbers are equal.")`,
        check(result, code) {
            const { first_number, second_number } = result.snapshot;
            const inputCount = (code.match(/\binput\s*\(/g) || []).length;
            const intCount = (code.match(/\bint\s*\(/g) || []).length;
            if (inputCount < 2) return fail("Use input() twice to ask for two numbers.");
            if (intCount < 2) return fail("Convert both answers to integers using int().");
            if (!first_number?.exists || first_number.type !== "int") {
                return fail("Store the first integer in first_number.");
            }
            if (!second_number?.exists || second_number.type !== "int") {
                return fail("Store the second integer in second_number.");
            }
            if (!/\bif\s+first_number\s*>\s*second_number\s*:/.test(code)) {
                return fail("Use if first_number > second_number:");
            }
            if (!/\belif\s+first_number\s*<\s*second_number\s*:/.test(code)) {
                return fail("Use elif first_number < second_number:");
            }
            if (!/\belse\s*:/.test(code)) return fail("Use else for equal values.");
            return pass("Correct — your program handles greater than, less than and equal values.");
        }
    },
    {
        id: "selection-challenge",
        topic: 2,
        title: "10. Selection challenge",
        instruction: "Ask for a password. Display \"Access granted\" when it is python; otherwise display \"Access denied\".",
        starter: `# Ask the user for a password
password =

# Check the password and display the correct message
`,
        hint: 'Use == to compare the password with the string "python".',
        solution: `password = input("Enter the password: ")

if password == "python":
    print("Access granted")
else:
    print("Access denied")`,
        check(result, code) {
            const password = result.snapshot.password;
            if (!/\binput\s*\(/.test(code)) return fail("Use input() to ask for the password.");
            if (!password?.exists || password.type !== "str") {
                return fail("Store the answer as a string in a variable called password.");
            }
            if (!/\bif\s+password\s*==\s*["']python["']\s*:/.test(code)) {
                return fail('Compare the password using if password == "python":');
            }
            if (!/\belse\s*:/.test(code)) return fail("Add an else block for an incorrect password.");
            if (!/\bprint\s*\(\s*["']Access granted["']\s*\)/.test(code)) {
                return fail('Display "Access granted" for the correct password.');
            }
            if (!/\bprint\s*\(\s*["']Access denied["']\s*\)/.test(code)) {
                return fail('Display "Access denied" for any other password.');
            }
            return pass("Challenge complete — your program checks the password correctly.");
        }
    }

    ,
  {
    id: "iteration-for",
    topic: 3,
    title: "11. Iteration: Simple for loop",
    instruction: "Use a for loop to display the numbers 1 to 5.",
    starter: `# Use a for loop to display the numbers 1 to 5

`,
    hint: "Use for number in range(1, 6): and indent the print() line.",
    solution: `for number in range(1, 6):
    print(number)`,
    check(result, code) {
      const number = result.snapshot.number;

      if (!/\bfor\s+number\s+in\s+range\s*\(\s*1\s*,\s*6\s*\)\s*:/.test(code)) {
        return fail("Use for number in range(1, 6):");
      }
      if (!/\bprint\s*\(\s*number\s*\)/.test(code)) {
        return fail("Print number inside the loop.");
      }
      if (!number?.exists || number.type !== "int" || number.value !== 5) {
        return fail("Run the loop from 1 to 5 using the variable number.");
      }

      return pass("Well done — your for loop displays the numbers 1 to 5.");
    }
  },
  {
    id: "iteration-range",
    topic: 3,
    title: "12. Iteration: Using range",
    instruction: "Use range() to display the even numbers 2, 4, 6, 8 and 10.",
    starter: `# Display the even numbers from 2 to 10

`,
    hint: "range() can use a start, stop and step: range(2, 11, 2)",
    solution: `for number in range(2, 11, 2):
    print(number)`,
    check(result, code) {
      const number = result.snapshot.number;

      if (!/\bfor\s+number\s+in\s+range\s*\(\s*2\s*,\s*11\s*,\s*2\s*\)\s*:/.test(code)) {
        return fail("Use for number in range(2, 11, 2):");
      }
      if (!/\bprint\s*\(\s*number\s*\)/.test(code)) {
        return fail("Print number inside the loop.");
      }
      if (!number?.exists || number.type !== "int" || number.value !== 10) {
        return fail("The loop should finish with number storing 10.");
      }

      return pass("Correct — the step value makes the loop count in twos.");
    }
  },
  {
    id: "iteration-while",
    topic: 3,
    title: "13. Iteration: while loop",
    instruction: "Use a while loop to display the numbers 1 to 5.",
    starter: `count = 1

# Repeat while count is 5 or less

`,
    hint: "Use while count <= 5:, then print count and increase it by 1.",
    solution: `count = 1

while count <= 5:
    print(count)
    count += 1`,
    check(result, code) {
      const count = result.snapshot.count;

      if (!/\bcount\s*=\s*1\b/.test(code)) {
        return fail("Start by setting count to 1.");
      }
      if (!/\bwhile\s+count\s*<=\s*5\s*:/.test(code)) {
        return fail("Use while count <= 5:");
      }
      if (!/\bprint\s*\(\s*count\s*\)/.test(code)) {
        return fail("Print count inside the loop.");
      }

      const increasesCount =
        /\bcount\s*\+=\s*1\b/.test(code) ||
        /\bcount\s*=\s*count\s*\+\s*1\b/.test(code);

      if (!increasesCount) {
        return fail("Increase count by 1 inside the loop so that it can stop.");
      }
      if (!count?.exists || count.type !== "int" || count.value !== 6) {
        return fail("After the loop finishes, count should contain 6.");
      }

      return pass("Correct — the condition is checked before each repetition.");
    }
  },
  {
    id: "iteration-total",
    topic: 3,
    title: "14. Iteration: Running total",
    instruction: "Use a loop to ask for three integers, add them to total and display the final total.",
    starter: `total = 0

# Repeat three times
# Ask for an integer and add it to total

print("Total:", total)`,
    hint: "Use for repeat in range(3):. Inside the loop, use int(input(...)) and add the number to total.",
    solution: `total = 0

for repeat in range(3):
    number = int(input("Enter a number: "))
    total += number

print("Total:", total)`,
    check(result, code) {
      const { total, number } = result.snapshot;

      if (!/\btotal\s*=\s*0\b/.test(code)) {
        return fail("Start the running total with total = 0.");
      }
      if (!/\bfor\s+repeat\s+in\s+range\s*\(\s*3\s*\)\s*:/.test(code)) {
        return fail("Use for repeat in range(3):");
      }
      if (!/\bnumber\s*=\s*int\s*\(\s*input\s*\(/.test(code)) {
        return fail("Ask for each number and convert it using int(input(...)).");
      }

      const addsToTotal =
        /\btotal\s*\+=\s*number\b/.test(code) ||
        /\btotal\s*=\s*total\s*\+\s*number\b/.test(code);

      if (!addsToTotal) {
        return fail("Add number to total during each repetition.");
      }
      if (!total?.exists || total.type !== "int") {
        return fail("total should contain the final integer total.");
      }
      if (!number?.exists || number.type !== "int") {
        return fail("Store each entered integer in a variable called number.");
      }

      return pass("Excellent — your loop collects three numbers and keeps a running total.");
    }
  },
  {
    id: "iteration-challenge",
    topic: 3,
    title: "15. Iteration challenge",
    instruction: "Ask for an integer and display its multiplication table from 1 to 10.",
    starter: `# Ask for the table number and convert it to an integer
table_number =

# Use a for loop to display the multiplication table

`,
    hint: "Loop through multiplier values 1 to 10 using range(1, 11), then multiply table_number by multiplier.",
    solution: `table_number = int(input("Enter a table number: "))

for multiplier in range(1, 11):
    answer = table_number * multiplier
    print(table_number, "x", multiplier, "=", answer)`,
    check(result, code) {
      const { table_number, multiplier } = result.snapshot;

      if (!/\btable_number\s*=\s*int\s*\(\s*input\s*\(/.test(code)) {
        return fail("Ask for the table number using table_number = int(input(...)).");
      }
      if (!/\bfor\s+multiplier\s+in\s+range\s*\(\s*1\s*,\s*11\s*\)\s*:/.test(code)) {
        return fail("Use for multiplier in range(1, 11):");
      }

      const multipliesValues =
        /\btable_number\s*\*\s*multiplier\b/.test(code) ||
        /\bmultiplier\s*\*\s*table_number\b/.test(code);

      if (!multipliesValues) {
        return fail("Multiply table_number by multiplier inside the loop.");
      }
      if (!/\bprint\s*\(/.test(code)) {
        return fail("Display each line of the multiplication table.");
      }
      if (!table_number?.exists || table_number.type !== "int") {
        return fail("Store the entered integer in table_number.");
      }
      if (!multiplier?.exists || multiplier.type !== "int" || multiplier.value !== 10) {
        return fail("The loop should use multiplier values from 1 to 10.");
      }

      return pass("Challenge complete — your program displays a full multiplication table.");
    }
  }

    
];



const STORAGE_PREFIX = "nptc-python-practice-v1:";
const SNAPSHOT_NAMES = ["score", "name", "age", "height", "enrolled", "course", "number", "mark", "first_number", "second_number", "password", "count", "total", "table_number", "multiplier"];
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
const topicNumber = Number.parseInt(urlParams.get("topic"), 10);
const visibleTasks = Number.isInteger(topicNumber)
    ? TASKS.filter(task => task.topic === topicNumber)
    : TASKS;

let currentTask = visibleTasks[0] || TASKS[0];
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

populateTasks();
clearTerminal(true);
createWorker();
