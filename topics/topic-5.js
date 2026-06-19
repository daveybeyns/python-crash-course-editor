"use strict";

const pass = message => ({ ok: true, message });
const fail = message => ({ ok: false, message });

export default {
    topic: 5,
    title: "Lists & Dictionaries",
    snapshotNames: [
        "subjects",
        "skills",
        "scores",
        "total",
        "average",
        "student",
        "topics",
        "results",
        "strongest"
    ],
    tasks: [
        {
            id: "lists-create-access",
            topic: 5,
            title: "21. Lists: Create and access",
            instruction: "Create a list called subjects containing Computing, Maths and Physics. Display the first item, the third item and the number of items in the list.",
            starter: `subjects = ["Computing", "Maths", "Physics"]

# Display the first subject

# Display the third subject

# Display the number of subjects
`,
            hint: "List positions start at 0. Use subjects[0], subjects[2] and len(subjects).",
            solution: `subjects = ["Computing", "Maths", "Physics"]

print(subjects[0])
print(subjects[2])
print(len(subjects))`,
            check(result, code) {
                const subjects = result.snapshot.subjects;

                if (!/\bsubjects\s*=\s*\[/.test(code)) {
                    return fail("Create a list called subjects.");
                }
                if (!/\bsubjects\s*\[\s*0\s*\]/.test(code)) {
                    return fail("Access the first item using subjects[0].");
                }
                if (!/\bsubjects\s*\[\s*2\s*\]/.test(code)) {
                    return fail("Access the third item using subjects[2].");
                }
                if (!/\blen\s*\(\s*subjects\s*\)/.test(code)) {
                    return fail("Use len(subjects) to find the number of items.");
                }
                if (!subjects?.exists || subjects.type !== "list") {
                    return fail("subjects should contain a Python list.");
                }
                if (!["Computing", "Maths", "Physics"].every(value => subjects.repr.includes(value))) {
                    return fail("The subjects list should contain Computing, Maths and Physics.");
                }

                return pass("Well done — you created a list and accessed its items correctly.");
            }
        },
        {
            id: "lists-update",
            topic: 5,
            title: "22. Lists: Add, change and remove",
            instruction: "Start with the skills list. Add Iteration, replace Variables with Data Types, remove Selection, then display the finished list.",
            starter: `skills = ["Variables", "Selection"]

# Add Iteration

# Replace Variables with Data Types

# Remove Selection

print(skills)`,
            hint: "Use append(), an index assignment such as skills[0] = ..., and remove().",
            solution: `skills = ["Variables", "Selection"]

skills.append("Iteration")
skills[0] = "Data Types"
skills.remove("Selection")

print(skills)`,
            check(result, code) {
                const skills = result.snapshot.skills;

                if (!/\bskills\s*=\s*\[/.test(code)) {
                    return fail("Start with a list called skills.");
                }
                if (!/\bskills\s*\.\s*append\s*\(\s*["']Iteration["']\s*\)/.test(code)) {
                    return fail('Add Iteration using skills.append("Iteration").');
                }
                if (!/\bskills\s*\[\s*0\s*\]\s*=\s*["']Data Types["']/.test(code)) {
                    return fail('Replace the first item using skills[0] = "Data Types".');
                }
                if (!/\bskills\s*\.\s*remove\s*\(\s*["']Selection["']\s*\)/.test(code)) {
                    return fail('Remove Selection using skills.remove("Selection").');
                }
                if (!skills?.exists || skills.type !== "list") {
                    return fail("skills should contain a Python list.");
                }
                if (!skills.repr.includes("Data Types") || !skills.repr.includes("Iteration") || skills.repr.includes("Selection")) {
                    return fail("The finished list should contain Data Types and Iteration only.");
                }

                return pass("Correct — you added, changed and removed list items.");
            }
        },
        {
            id: "lists-loop-average",
            topic: 5,
            title: "23. Lists: Loop and calculate",
            instruction: "Use a for loop to display every score. Add the scores together, calculate the average and display it.",
            starter: `scores = [72, 65, 81]
total = 0

# Loop through the scores

# Calculate and display the average
`,
            hint: "Inside the loop, display score and add it to total. The average is total / len(scores).",
            solution: `scores = [72, 65, 81]
total = 0

for score in scores:
    print(score)
    total += score

average = total / len(scores)
print("Average:", average)`,
            check(result, code) {
                const { scores, total, average } = result.snapshot;

                if (!/\bfor\s+score\s+in\s+scores\s*:/.test(code)) {
                    return fail("Loop through the list using for score in scores:");
                }
                const addsToTotal = /\btotal\s*\+=\s*score\b/.test(code) || /\btotal\s*=\s*total\s*\+\s*score\b/.test(code);
                if (!addsToTotal) {
                    return fail("Add each score to total inside the loop.");
                }
                if (!/\baverage\s*=\s*total\s*\/\s*len\s*\(\s*scores\s*\)/.test(code)) {
                    return fail("Calculate average using total / len(scores).");
                }
                if (!scores?.exists || scores.type !== "list") {
                    return fail("scores should contain a Python list.");
                }
                if (!total?.exists || total.type !== "int" || total.value !== 218) {
                    return fail("After the loop, total should contain 218.");
                }
                if (!average?.exists || average.type !== "float" || Math.abs(average.value - 72.66666666666667) > 0.000001) {
                    return fail("The calculated average should be approximately 72.67.");
                }

                return pass("Excellent — your loop processed the list and calculated its average.");
            }
        },
        {
            id: "dictionaries-create-update",
            topic: 5,
            title: "24. Dictionaries: Access and update",
            instruction: "Display the student's name and course. Change the year to 2, add a passed key with the value True, then display the dictionary.",
            starter: `student = {
    "name": "Aisha",
    "course": "Computing",
    "year": 1
}

# Display the name and course

# Update the year

# Add passed: True

# Display the dictionary
`,
            hint: "Access a value with student[\"name\"]. Use the same form on the left of = to add or update a value.",
            solution: `student = {
    "name": "Aisha",
    "course": "Computing",
    "year": 1
}

print(student["name"])
print(student["course"])
student["year"] = 2
student["passed"] = True
print(student)`,
            check(result, code) {
                const student = result.snapshot.student;

                if (!/\bstudent\s*\[\s*["']name["']\s*\]/.test(code)) {
                    return fail('Access the name using student["name"].');
                }
                if (!/\bstudent\s*\[\s*["']course["']\s*\]/.test(code)) {
                    return fail('Access the course using student["course"].');
                }
                if (!/\bstudent\s*\[\s*["']year["']\s*\]\s*=\s*2\b/.test(code)) {
                    return fail('Change the year using student["year"] = 2.');
                }
                if (!/\bstudent\s*\[\s*["']passed["']\s*\]\s*=\s*True\b/.test(code)) {
                    return fail('Add the new value using student["passed"] = True.');
                }
                if (!student?.exists || student.type !== "dict") {
                    return fail("student should contain a Python dictionary.");
                }
                if (!["Aisha", "Computing", "'year': 2", "'passed': True"].every(value => student.repr.includes(value))) {
                    return fail("Check the final values stored in the student dictionary.");
                }

                return pass("Well done — you accessed, changed and added dictionary values.");
            }
        },
        {
            id: "lists-dictionaries-challenge",
            topic: 5,
            title: "25. Lists and dictionaries challenge",
            instruction: "Loop through the topics list. For each topic, display its name and score from the results dictionary. Calculate the average score and find the strongest topic.",
            starter: `topics = ["Variables", "Selection", "Iteration"]
results = {
    "Variables": 8,
    "Selection": 7,
    "Iteration": 9
}

total = 0

# Display each topic and score, and build the total

# Calculate and display the average

# Find and display the strongest topic
`,
            hint: "Inside the loop, use results[topic]. Find the strongest topic with max(results, key=results.get).",
            solution: `topics = ["Variables", "Selection", "Iteration"]
results = {
    "Variables": 8,
    "Selection": 7,
    "Iteration": 9
}

total = 0

for topic in topics:
    print(topic, results[topic])
    total += results[topic]

average = total / len(topics)
print("Average:", average)

strongest = max(results, key=results.get)
print("Strongest topic:", strongest)`,
            check(result, code) {
                const { topics, results, total, average, strongest } = result.snapshot;

                if (!/\bfor\s+topic\s+in\s+topics\s*:/.test(code)) {
                    return fail("Loop through the list using for topic in topics:");
                }
                if (!/\bresults\s*\[\s*topic\s*\]/.test(code)) {
                    return fail("Access each score using results[topic].");
                }
                if (!/\baverage\s*=\s*total\s*\/\s*len\s*\(\s*topics\s*\)/.test(code)) {
                    return fail("Calculate average using total / len(topics).");
                }
                if (!/\bstrongest\s*=\s*max\s*\(\s*results\s*,\s*key\s*=\s*results\.get\s*\)/.test(code)) {
                    return fail("Find the strongest topic using max(results, key=results.get).");
                }
                if (!topics?.exists || topics.type !== "list") {
                    return fail("topics should contain a Python list.");
                }
                if (!results?.exists || results.type !== "dict") {
                    return fail("results should contain a Python dictionary.");
                }
                if (!total?.exists || total.type !== "int" || total.value !== 24) {
                    return fail("The total of the three scores should be 24.");
                }
                if (!average?.exists || average.value !== 8) {
                    return fail("The average score should be 8.0.");
                }
                if (!strongest?.exists || strongest.type !== "str" || strongest.value !== "Iteration") {
                    return fail("The strongest topic should be Iteration.");
                }

                return pass("Challenge complete — you used a list and dictionary together successfully.");
            }
        }
    ]
};
