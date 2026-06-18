"use strict";

const pass = message => ({ ok: true, message });
const fail = message => ({ ok: false, message });

export default {
    topic: 2,
    title: "Selection",
    snapshotNames: [
    "age",
    "number",
    "mark",
    "first_number",
    "second_number",
    "password"
],
    tasks: [
    {
        id: "selection-if",
        topic: 2,
        title: "6. Selection: Simple if",
        instruction: "Ask the user for their age. Display \"You are an adult.\" only when the age is 18 or over.",
        starter: "# Ask for the user's age and convert it to an integer\nage =\n\n# Display the message only when age is 18 or over\n",
        hint: "Use age = int(input(...)), then write if age >= 18: and indent the print() line.",
        solution: "age = int(input(\"Enter your age: \"))\n\nif age >= 18:\n    print(\"You are an adult.\")",
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
        starter: "# Ask for an integer\nnumber =\n\n# Use if and else to display the correct message\n",
        hint: "Check whether number > 0. Remember that both the if and else lines need a colon.",
        solution: "number = int(input(\"Enter a number: \"))\n\nif number > 0:\n    print(\"Positive\")\nelse:\n    print(\"Not positive\")",
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
        starter: "# Ask for the mark and convert it to an integer\nmark =\n\n# Display Distinction, Pass or Not passed\n",
        hint: "Check mark >= 70 first, then use elif mark >= 40, followed by else.",
        solution: "mark = int(input(\"Enter your mark: \"))\n\nif mark >= 70:\n    print(\"Distinction\")\nelif mark >= 40:\n    print(\"Pass\")\nelse:\n    print(\"Not passed\")",
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
        starter: "# Ask for two integers\nfirst_number =\nsecond_number =\n\n# Compare the numbers using if, elif and else\n",
        hint: "Use > for greater than, < for less than, and let else handle equal values.",
        solution: "first_number = int(input(\"Enter the first number: \"))\nsecond_number = int(input(\"Enter the second number: \"))\n\nif first_number > second_number:\n    print(\"The first number is greater.\")\nelif first_number < second_number:\n    print(\"The first number is smaller.\")\nelse:\n    print(\"The numbers are equal.\")",
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
        starter: "# Ask the user for a password\npassword =\n\n# Check the password and display the correct message\n",
        hint: "Use == to compare the password with the string \"python\".",
        solution: "password = input(\"Enter the password: \")\n\nif password == \"python\":\n    print(\"Access granted\")\nelse:\n    print(\"Access denied\")",
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
    ]
};
