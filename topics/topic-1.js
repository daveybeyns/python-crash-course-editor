"use strict";

const pass = message => ({ ok: true, message });
const fail = message => ({ ok: false, message });

export default {
    topic: 1,
    title: "Variables & Data Types",
    snapshotNames: [
    "score",
    "name",
    "age",
    "height",
    "enrolled",
    "course"
],
    tasks: [
    {
        id: "variables",
        topic: 1,
        title: "1. Variables",
        instruction: "Create a variable called score and store the integer 10 in it.",
        starter: "# Create a variable called score and store 10\n\n\nprint(score)",
        hint: "Use the variable name, an equals sign and the value: variable = value",
        solution: "score = 10\n\nprint(score)",
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
        starter: "# Complete the four variables\nname =\nage =\nheight =\nenrolled =\n\nprint(name, age, height, enrolled)",
        hint: "Strings need quotation marks. True begins with a capital T and does not use quotation marks.",
        solution: "name = \"Aisha\"\nage = 17\nheight = 1.68\nenrolled = True\n\nprint(name, age, height, enrolled)",
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
        starter: "# Ask the user for their name\n\n\nprint(\"Hello\", name)",
        hint: "Use name = input(\"What is your name? \")",
        solution: "name = input(\"What is your name? \")\n\nprint(\"Hello\", name)",
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
        starter: "# Ask for the user's age and convert it to an integer\n\n\nprint(\"Next year you will be\", age + 1)",
        hint: "Place input() inside int(): age = int(input(\"How old are you? \"))",
        solution: "age = int(input(\"How old are you? \"))\n\nprint(\"Next year you will be\", age + 1)",
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
        starter: "course = \"A Level Computer Science\"\n\n# Ask for the user's name\n\n\n# Ask for their age and cast it to an integer\n\n\nprint(\"Hello\", name)\nprint(\"You are\", age, \"years old.\")\nprint(\"Welcome to\", course)",
        hint: "Create name with input(), then create age with int(input(...)).",
        solution: "course = \"A Level Computer Science\"\n\nname = input(\"What is your name? \")\nage = int(input(\"How old are you? \"))\n\nprint(\"Hello\", name)\nprint(\"You are\", age, \"years old.\")\nprint(\"Welcome to\", course)",
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
    ]
};
