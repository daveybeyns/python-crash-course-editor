"use strict";

const pass = message => ({ ok: true, message });
const fail = message => ({ ok: false, message });

export default {
    topic: 3,
    title: "Iteration",
    snapshotNames: [
    "number",
    "count",
    "total",
    "table_number",
    "multiplier"
],
    tasks: [
    {
        id: "iteration-for",
        topic: 3,
        title: "11. Iteration: Simple for loop",
        instruction: "Use a for loop to display the numbers 1 to 5.",
        starter: "# Use a for loop to display the numbers 1 to 5\n\n",
        hint: "Use for number in range(1, 6): and indent the print() line.",
        solution: "for number in range(1, 6):\n    print(number)",
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
        starter: "# Display the even numbers from 2 to 10\n\n",
        hint: "range() can use a start, stop and step: range(2, 11, 2)",
        solution: "for number in range(2, 11, 2):\n    print(number)",
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
        starter: "count = 1\n\n# Repeat while count is 5 or less\n\n",
        hint: "Use while count <= 5:, then print count and increase it by 1.",
        solution: "count = 1\n\nwhile count <= 5:\n    print(count)\n    count += 1",
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
        starter: "total = 0\n\n# Repeat three times\n# Ask for an integer and add it to total\n\nprint(\"Total:\", total)",
        hint: "Use for repeat in range(3):. Inside the loop, use int(input(...)) and add the number to total.",
        solution: "total = 0\n\nfor repeat in range(3):\n    number = int(input(\"Enter a number: \"))\n    total += number\n\nprint(\"Total:\", total)",
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
        starter: "# Ask for the table number and convert it to an integer\ntable_number =\n\n# Use a for loop to display the multiplication table\n\n",
        hint: "Loop through multiplier values 1 to 10 using range(1, 11), then multiply table_number by multiplier.",
        solution: "table_number = int(input(\"Enter a table number: \"))\n\nfor multiplier in range(1, 11):\n    answer = table_number * multiplier\n    print(table_number, \"x\", multiplier, \"=\", answer)",
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
    ]
};
