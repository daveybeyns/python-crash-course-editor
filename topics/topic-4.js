"use strict";

const pass = message => ({ ok: true, message });
const fail = message => ({ ok: false, message });

export default {
    topic: 4,
    title: "Functions",
    snapshotNames: ["answer", "price", "quantity", "total"],
    tasks: [
        {
            id: "functions-define-call",
            topic: 4,
            title: "16. Functions: Define and call",
            instruction: "Define a function called show_message that displays \"Functions make code reusable.\" Then call the function.",
            starter: `# Define a function called show_message


# Call the function
`,
            hint: "Start with def show_message():, indent the print() line, then call show_message() without indentation.",
            solution: `def show_message():
    print("Functions make code reusable.")

show_message()`,
            check(result, code) {
                if (!/\bdef\s+show_message\s*\(\s*\)\s*:/.test(code)) {
                    return fail("Define the function using def show_message():");
                }
                if (!/\bprint\s*\(\s*["']Functions make code reusable\.["']\s*\)/.test(code)) {
                    return fail('Display the exact message "Functions make code reusable." inside the function.');
                }
                const calls = code.match(/\bshow_message\s*\(\s*\)/g) || [];
                if (calls.length < 2) {
                    return fail("Call show_message() after defining it.");
                }
                return pass("Well done — you defined the function and then called it.");
            }
        },
        {
            id: "functions-parameter",
            topic: 4,
            title: "17. Functions: Parameter",
            instruction: "Complete the greet function so it receives a name and displays \"Hello\" followed by that name. Call it with \"Aisha\".",
            starter: `# Add a parameter called name
def greet():
    # Display Hello followed by the name
    

# Call the function with "Aisha"
`,
            hint: "Put name inside the brackets in the function heading, then call greet(\"Aisha\").",
            solution: `def greet(name):
    print("Hello", name)

greet("Aisha")`,
            check(result, code) {
                if (!/\bdef\s+greet\s*\(\s*name\s*\)\s*:/.test(code)) {
                    return fail("Use name as the parameter: def greet(name):");
                }
                if (!/\bprint\s*\([^\n)]*["']Hello["'][^\n)]*\bname\b[^\n)]*\)/.test(code)) {
                    return fail('Inside the function, display "Hello" followed by name.');
                }
                if (!/\bgreet\s*\(\s*["']Aisha["']\s*\)/.test(code)) {
                    return fail('Call the function using greet("Aisha").');
                }
                return pass("Correct — the argument is passed into the name parameter.");
            }
        },
        {
            id: "functions-two-parameters",
            topic: 4,
            title: "18. Functions: Two parameters",
            instruction: "Create a function called show_total with price and quantity parameters. Multiply them and display the total. Call it using 4 and 3.",
            starter: `# Define show_total with two parameters


# Call the function using 4 and 3
`,
            hint: "Use def show_total(price, quantity): and calculate total = price * quantity inside the function.",
            solution: `def show_total(price, quantity):
    total = price * quantity
    print("Total:", total)

show_total(4, 3)`,
            check(result, code) {
                if (!/\bdef\s+show_total\s*\(\s*price\s*,\s*quantity\s*\)\s*:/.test(code)) {
                    return fail("Define the function with price and quantity parameters.");
                }
                if (!/\btotal\s*=\s*(?:price\s*\*\s*quantity|quantity\s*\*\s*price)\b/.test(code)) {
                    return fail("Inside the function, calculate total by multiplying price and quantity.");
                }
                if (!/\bprint\s*\([^\n)]*\btotal\b[^\n)]*\)/.test(code)) {
                    return fail("Display total inside the function.");
                }
                if (!/\bshow_total\s*\(\s*4\s*,\s*3\s*\)/.test(code)) {
                    return fail("Call the function using show_total(4, 3).");
                }
                return pass("Excellent — your function receives and uses two arguments.");
            }
        },
        {
            id: "functions-return",
            topic: 4,
            title: "19. Functions: Return a value",
            instruction: "Complete double_number so it returns double its parameter. Store double_number(6) in answer and display it.",
            starter: `def double_number(number):
    # Return number multiplied by 2
    

# Call the function and store its returned value
answer =

print(answer)`,
            hint: "Use return number * 2, then answer = double_number(6).",
            solution: `def double_number(number):
    return number * 2

answer = double_number(6)

print(answer)`,
            check(result, code) {
                const answer = result.snapshot.answer;
                if (!/\bdef\s+double_number\s*\(\s*number\s*\)\s*:/.test(code)) {
                    return fail("Define double_number with a parameter called number.");
                }
                if (!/\breturn\s+(?:number\s*\*\s*2|2\s*\*\s*number)\b/.test(code)) {
                    return fail("Return number multiplied by 2.");
                }
                if (!/\banswer\s*=\s*double_number\s*\(\s*6\s*\)/.test(code)) {
                    return fail("Store double_number(6) in answer.");
                }
                if (!answer?.exists || answer.type !== "int" || answer.value !== 12) {
                    return fail("After the function call, answer should contain the integer 12.");
                }
                return pass("Correct — the function returns a value that is stored in answer.");
            }
        },
        {
            id: "functions-challenge",
            topic: 4,
            title: "20. Functions challenge",
            instruction: "Create calculate_total(price, quantity), return price multiplied by quantity, collect both values from the user, call the function and display the final total.",
            starter: `# Define a function that returns price multiplied by quantity


# Ask for a price and cast it to a float
price =

# Ask for a quantity and cast it to an integer
quantity =

# Call the function and store the returned value
total =

print("Total:", total)`,
            hint: "Use float(input(...)) for price, int(input(...)) for quantity, and total = calculate_total(price, quantity).",
            solution: `def calculate_total(price, quantity):
    return price * quantity

price = float(input("Enter the price: "))
quantity = int(input("Enter the quantity: "))

total = calculate_total(price, quantity)

print("Total:", total)`,
            check(result, code) {
                const { price, quantity, total } = result.snapshot;
                if (!/\bdef\s+calculate_total\s*\(\s*price\s*,\s*quantity\s*\)\s*:/.test(code)) {
                    return fail("Define calculate_total with price and quantity parameters.");
                }
                if (!/\breturn\s+(?:price\s*\*\s*quantity|quantity\s*\*\s*price)\b/.test(code)) {
                    return fail("Return price multiplied by quantity from the function.");
                }
                if (!/\bprice\s*=\s*float\s*\(\s*input\s*\(/.test(code)) {
                    return fail("Ask for price using float(input(...)).");
                }
                if (!/\bquantity\s*=\s*int\s*\(\s*input\s*\(/.test(code)) {
                    return fail("Ask for quantity using int(input(...)).");
                }
                if (!/\btotal\s*=\s*calculate_total\s*\(\s*price\s*,\s*quantity\s*\)/.test(code)) {
                    return fail("Call calculate_total(price, quantity) and store the result in total.");
                }
                if (!price?.exists || price.type !== "float") {
                    return fail("price should contain a float after casting.");
                }
                if (!quantity?.exists || quantity.type !== "int") {
                    return fail("quantity should contain an integer after casting.");
                }
                if (!total?.exists || !["float", "int"].includes(total.type)) {
                    return fail("total should contain the value returned by the function.");
                }
                return pass("Challenge complete — your function receives values and returns the calculated total.");
            }
        }
    ]
};
