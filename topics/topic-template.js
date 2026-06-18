"use strict";

const pass = message => ({ ok: true, message });
const fail = message => ({ ok: false, message });

export default {
    topic: 0,
    title: "Topic title",
    snapshotNames: ["variable_to_check"],
    tasks: [
        {
            id: "unique-task-id",
            topic: 0,
            title: "1. Task title",
            instruction: "Tell the student exactly what to create.",
            starter: `# Starter code goes here
`,
            hint: "Give one useful hint without revealing everything.",
            solution: `# Complete model solution goes here
`,
            check(result, code) {
                const variable = result.snapshot.variable_to_check;
                if (!variable?.exists) return fail("Explain what is missing.");
                return pass("Positive success feedback.");
            }
        }
    ]
};
