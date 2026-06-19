(function () {
    "use strict";

    function normalise(text) {
        return String(text || "").replace(/\r/g, "").trim();
    }

    function containsAll(text, values) {
        const source = normalise(text).toLowerCase();
        return values.every(function (value) {
            return source.includes(String(value).toLowerCase());
        });
    }

    function result(passed, success, failure) {
        return {
            passed: Boolean(passed),
            success: Boolean(passed),
            message: passed ? success : failure,
            feedback: passed ? success : failure
        };
    }

    const tasks = [
        {
            id: "list-basics",
            title: "Create and access a list",
            shortTitle: "List basics",
            instructions: "Create a list called subjects containing Computing, Maths and Physics. Print the first item, the third item and the number of items in the list.",
            task: "Create a list called subjects containing Computing, Maths and Physics. Print the first item, the third item and the number of items in the list.",
            starterCode: "subjects = [\"Computing\", \"Maths\", \"Physics\"]\n\n# Print the first subject\n\n# Print the third subject\n\n# Print the number of subjects\n",
            starter: "subjects = [\"Computing\", \"Maths\", \"Physics\"]\n\n# Print the first subject\n\n# Print the third subject\n\n# Print the number of subjects\n",
            hint: "List positions start at 0. Use subjects[0], subjects[2] and len(subjects).",
            solutionCode: "subjects = [\"Computing\", \"Maths\", \"Physics\"]\n\nprint(subjects[0])\nprint(subjects[2])\nprint(len(subjects))\n",
            solution: "subjects = [\"Computing\", \"Maths\", \"Physics\"]\n\nprint(subjects[0])\nprint(subjects[2])\nprint(len(subjects))\n",
            check: function (context) {
                context = context || {};
                const code = context.code || context.source || "";
                const output = context.output || "";
                const passed = /subjects\s*=\s*\[/.test(code) && /subjects\s*\[\s*0\s*\]/.test(code) && /subjects\s*\[\s*2\s*\]/.test(code) && /len\s*\(\s*subjects\s*\)/.test(code) && containsAll(output, ["Computing", "Physics", "3"]);
                return result(passed, "Excellent — you created the list and accessed it correctly.", "Check the index positions and remember that the first item is at index 0.");
            }
        },
        {
            id: "update-list",
            title: "Update a list",
            shortTitle: "Update a list",
            instructions: "Start with the skills list. Add Iteration, replace Variables with Data Types, remove Selection, then print the finished list.",
            task: "Start with the skills list. Add Iteration, replace Variables with Data Types, remove Selection, then print the finished list.",
            starterCode: "skills = [\"Variables\", \"Selection\"]\n\n# Add Iteration\n\n# Replace Variables with Data Types\n\n# Remove Selection\n\nprint(skills)\n",
            starter: "skills = [\"Variables\", \"Selection\"]\n\n# Add Iteration\n\n# Replace Variables with Data Types\n\n# Remove Selection\n\nprint(skills)\n",
            hint: "Use append(), an index assignment such as skills[0] = ..., and remove().",
            solutionCode: "skills = [\"Variables\", \"Selection\"]\n\nskills.append(\"Iteration\")\nskills[0] = \"Data Types\"\nskills.remove(\"Selection\")\n\nprint(skills)\n",
            solution: "skills = [\"Variables\", \"Selection\"]\n\nskills.append(\"Iteration\")\nskills[0] = \"Data Types\"\nskills.remove(\"Selection\")\n\nprint(skills)\n",
            check: function (context) {
                context = context || {};
                const code = context.code || context.source || "";
                const output = context.output || "";
                const passed = /\.append\s*\(/.test(code) && /skills\s*\[\s*0\s*\]\s*=/.test(code) && /\.remove\s*\(/.test(code) && containsAll(output, ["Data Types", "Iteration"]) && !normalise(output).includes("Selection");
                return result(passed, "Well done — you added, replaced and removed list items.", "Use append(), change index 0, and remove the value Selection.");
            }
        },
        {
            id: "loop-list",
            title: "Loop through a list",
            shortTitle: "Loop through a list",
            instructions: "Use a for loop to print every score. Add the scores together and print the average.",
            task: "Use a for loop to print every score. Add the scores together and print the average.",
            starterCode: "scores = [72, 65, 81]\ntotal = 0\n\n# Loop through the scores\n\n# Print the average\n",
            starter: "scores = [72, 65, 81]\ntotal = 0\n\n# Loop through the scores\n\n# Print the average\n",
            hint: "Inside the loop, print score and add it to total. The average is total / len(scores).",
            solutionCode: "scores = [72, 65, 81]\ntotal = 0\n\nfor score in scores:\n    print(score)\n    total = total + score\n\naverage = total / len(scores)\nprint(average)\n",
            solution: "scores = [72, 65, 81]\ntotal = 0\n\nfor score in scores:\n    print(score)\n    total = total + score\n\naverage = total / len(scores)\nprint(average)\n",
            check: function (context) {
                context = context || {};
                const code = context.code || context.source || "";
                const output = context.output || "";
                const passed = /for\s+\w+\s+in\s+scores\s*:/.test(code) && /len\s*\(\s*scores\s*\)/.test(code) && containsAll(output, ["72", "65", "81", "72.666"]);
                return result(passed, "Correct — your loop processed the list and calculated the average.", "Make sure the loop uses scores and divide the total by len(scores).");
            }
        },
        {
            id: "dictionary-basics",
            title: "Create and update a dictionary",
            shortTitle: "Dictionary basics",
            instructions: "Print the student's name and course. Change the year to 2, add a passed key with the value True, then print the dictionary.",
            task: "Print the student's name and course. Change the year to 2, add a passed key with the value True, then print the dictionary.",
            starterCode: "student = {\n    \"name\": \"Aisha\",\n    \"course\": \"Computing\",\n    \"year\": 1\n}\n\n# Print the name and course\n\n# Update the year\n\n# Add passed: True\n\n# Print the dictionary\n",
            starter: "student = {\n    \"name\": \"Aisha\",\n    \"course\": \"Computing\",\n    \"year\": 1\n}\n\n# Print the name and course\n\n# Update the year\n\n# Add passed: True\n\n# Print the dictionary\n",
            hint: "Access a value with student[\"name\"]. Use the same form on the left of = to add or update a value.",
            solutionCode: "student = {\n    \"name\": \"Aisha\",\n    \"course\": \"Computing\",\n    \"year\": 1\n}\n\nprint(student[\"name\"])\nprint(student[\"course\"])\nstudent[\"year\"] = 2\nstudent[\"passed\"] = True\nprint(student)\n",
            solution: "student = {\n    \"name\": \"Aisha\",\n    \"course\": \"Computing\",\n    \"year\": 1\n}\n\nprint(student[\"name\"])\nprint(student[\"course\"])\nstudent[\"year\"] = 2\nstudent[\"passed\"] = True\nprint(student)\n",
            check: function (context) {
                context = context || {};
                const code = context.code || context.source || "";
                const output = context.output || "";
                const passed = /student\s*\[\s*["']name["']\s*\]/.test(code) && /student\s*\[\s*["']course["']\s*\]/.test(code) && /student\s*\[\s*["']year["']\s*\]\s*=\s*2/.test(code) && /student\s*\[\s*["']passed["']\s*\]\s*=\s*True/.test(code) && containsAll(output, ["Aisha", "Computing", "2", "True"]);
                return result(passed, "Excellent — you accessed, updated and added dictionary values.", "Check the spelling and capitalisation of each dictionary key.");
            }
        },
        {
            id: "lists-dictionaries-challenge",
            title: "Lists and dictionaries challenge",
            shortTitle: "Combined challenge",
            instructions: "Loop through the topics list. For each topic, print its name and score from the results dictionary. Calculate and print the average score and the strongest topic.",
            task: "Loop through the topics list. For each topic, print its name and score from the results dictionary. Calculate and print the average score and the strongest topic.",
            starterCode: "topics = [\"Variables\", \"Selection\", \"Iteration\"]\nresults = {\n    \"Variables\": 8,\n    \"Selection\": 7,\n    \"Iteration\": 9\n}\n\ntotal = 0\n\n# Print each topic and score, and build the total\n\n# Calculate and print the average\n\n# Find and print the strongest topic\n",
            starter: "topics = [\"Variables\", \"Selection\", \"Iteration\"]\nresults = {\n    \"Variables\": 8,\n    \"Selection\": 7,\n    \"Iteration\": 9\n}\n\ntotal = 0\n\n# Print each topic and score, and build the total\n\n# Calculate and print the average\n\n# Find and print the strongest topic\n",
            hint: "Inside the loop, use results[topic]. The strongest topic can be found with max(results, key=results.get).",
            solutionCode: "topics = [\"Variables\", \"Selection\", \"Iteration\"]\nresults = {\n    \"Variables\": 8,\n    \"Selection\": 7,\n    \"Iteration\": 9\n}\n\ntotal = 0\n\nfor topic in topics:\n    print(topic, results[topic])\n    total = total + results[topic]\n\naverage = total / len(topics)\nprint(\"Average:\", average)\n\nstrongest = max(results, key=results.get)\nprint(\"Strongest topic:\", strongest)\n",
            solution: "topics = [\"Variables\", \"Selection\", \"Iteration\"]\nresults = {\n    \"Variables\": 8,\n    \"Selection\": 7,\n    \"Iteration\": 9\n}\n\ntotal = 0\n\nfor topic in topics:\n    print(topic, results[topic])\n    total = total + results[topic]\n\naverage = total / len(topics)\nprint(\"Average:\", average)\n\nstrongest = max(results, key=results.get)\nprint(\"Strongest topic:\", strongest)\n",
            check: function (context) {
                context = context || {};
                const code = context.code || context.source || "";
                const output = context.output || "";
                const passed = /for\s+\w+\s+in\s+topics\s*:/.test(code) && /results\s*\[/.test(code) && /len\s*\(\s*topics\s*\)/.test(code) && /max\s*\(\s*results/.test(code) && containsAll(output, ["Variables", "8", "Selection", "7", "Iteration", "9", "8.0", "Iteration"]);
                return result(passed, "Challenge complete — you used a list and dictionary together successfully.", "Loop through topics, access results[topic], calculate the average, and use max() to find the strongest topic.");
            }
        }
    ];

    const topic = {
        number: 5,
        topicNumber: 5,
        id: "topic-5",
        slug: "lists-dictionaries",
        title: "Lists & Dictionaries",
        name: "Lists & Dictionaries",
        heading: "Topic 5: Lists & Dictionaries",
        tasks: tasks,
        TASKS: tasks,
        snapshotNames: ["subjects", "skills", "scores", "total", "average", "student", "topics", "results", "strongest"],
        SNAPSHOT_NAMES: ["subjects", "skills", "scores", "total", "average", "student", "topics", "results", "strongest"]
    };

    window.PYTHON_CRASH_COURSE_TOPICS = window.PYTHON_CRASH_COURSE_TOPICS || {};
    window.PYTHON_CRASH_COURSE_TOPICS[5] = topic;
    window.PYTHON_COURSE_TOPICS = window.PYTHON_COURSE_TOPICS || {};
    window.PYTHON_COURSE_TOPICS[5] = topic;
    window.PYTHON_TOPIC = topic;
    window.TOPIC_DATA = topic;
    window.TASKS = tasks;
    window.SNAPSHOT_NAMES = topic.snapshotNames;

    if (typeof window.registerPythonTopic === "function") {
        window.registerPythonTopic(topic);
    } else if (typeof window.registerTopic === "function") {
        window.registerTopic(topic);
    }
})();
