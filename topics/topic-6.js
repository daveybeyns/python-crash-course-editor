"use strict";

const pass = message => ({ ok: true, message });
const fail = message => ({ ok: false, message });

export default {
  topic: 6,
  title: "String Handling",

  snapshotNames: [
    "word",
    "first_character",
    "fifth_character",
    "last_character",
    "phrase",
    "first_word",
    "second_word",
    "initials",
    "messy_name",
    "clean_name",
    "username",
    "text",
    "vowel_count",
    "space_count",
    "message",
    "cleaned",
    "normalised",
    "corrected",
    "challenge_first_word",
    "contains_python",
    "number_of_n"
  ],

  tasks: [
    {
      id: "strings-indexing",
      topic: 6,
      title: "26. String indexing",
      instruction: "Store the first, fifth and final characters of the word Programming in three variables, then display them.",
      starter: `word = "Programming"

# Store the first character
first_character =

# Store the fifth character
fifth_character =

# Store the final character
last_character =

# Display the three characters
`,
      hint: "String positions start at 0. Use word[0], word[4] and word[-1].",
      solution: `word = "Programming"

first_character = word[0]
fifth_character = word[4]
last_character = word[-1]

print(first_character)
print(fifth_character)
print(last_character)`,
      check(result, code) {
        const {
          word,
          first_character,
          fifth_character,
          last_character
        } = result.snapshot;

        if (!/\bword\s*=\s*["']Programming["']/.test(code)) {
          return fail('Use the string "Programming" in the word variable.');
        }

        if (!/\bfirst_character\s*=\s*word\s*\[\s*0\s*\]/.test(code)) {
          return fail("Use word[0] to get the first character.");
        }

        if (!/\bfifth_character\s*=\s*word\s*\[\s*4\s*\]/.test(code)) {
          return fail("Use word[4] to get the fifth character.");
        }

        if (!/\blast_character\s*=\s*word\s*\[\s*-\s*1\s*\]/.test(code)) {
          return fail("Use word[-1] to get the final character.");
        }

        if (!word?.exists || word.type !== "str" || word.value !== "Programming") {
          return fail('word should contain the string "Programming".');
        }

        if (!first_character?.exists || first_character.value !== "P") {
          return fail("first_character should contain P.");
        }

        if (!fifth_character?.exists || fifth_character.value !== "r") {
          return fail("fifth_character should contain r.");
        }

        if (!last_character?.exists || last_character.value !== "g") {
          return fail("last_character should contain g.");
        }

        return pass("Well done — you accessed characters using positive and negative indexes.");
      }
    },

    {
      id: "strings-slicing",
      topic: 6,
      title: "27. String slicing",
      instruction: "Use slices to extract Computer and Science from the phrase. Then create the initials CS using character indexes.",
      starter: `phrase = "Computer Science"

# Extract Computer
first_word =

# Extract Science
second_word =

# Create the initials CS
initials =

# Display the results
`,
      hint: "Computer is phrase[:8] and Science begins at position 9. Join phrase[0] and phrase[9] for the initials.",
      solution: `phrase = "Computer Science"

first_word = phrase[:8]
second_word = phrase[9:]
initials = phrase[0] + phrase[9]

print(first_word)
print(second_word)
print(initials)`,
      check(result, code) {
        const { phrase, first_word, second_word, initials } = result.snapshot;

        if (!/\bfirst_word\s*=\s*phrase\s*\[\s*:\s*8\s*\]/.test(code)) {
          return fail("Extract Computer using phrase[:8].");
        }

        if (!/\bsecond_word\s*=\s*phrase\s*\[\s*9\s*:\s*\]/.test(code)) {
          return fail("Extract Science using phrase[9:].");
        }

        if (
          !/\binitials\s*=\s*phrase\s*\[\s*0\s*\]\s*\+\s*phrase\s*\[\s*9\s*\]/.test(code)
        ) {
          return fail("Create the initials using phrase[0] + phrase[9].");
        }

        if (!phrase?.exists || phrase.type !== "str" || phrase.value !== "Computer Science") {
          return fail('phrase should contain "Computer Science".');
        }

        if (!first_word?.exists || first_word.value !== "Computer") {
          return fail("first_word should contain Computer.");
        }

        if (!second_word?.exists || second_word.value !== "Science") {
          return fail("second_word should contain Science.");
        }

        if (!initials?.exists || initials.value !== "CS") {
          return fail("initials should contain CS.");
        }

        return pass("Correct — you extracted parts of a string using slices and indexes.");
      }
    },

    {
      id: "strings-methods",
      topic: 6,
      title: "28. Cleaning and changing strings",
      instruction: "Clean the name by removing outside spaces and applying title case. Then create a lowercase username with an underscore instead of a space.",
      starter: `messy_name = "  aLiShA jOnEs  "

# Remove outside spaces and apply title case
clean_name =

# Convert to lowercase and replace the space
username =

# Display the clean name and username
`,
      hint: "Use messy_name.strip().title(). Then use clean_name.lower().replace(\" \", \"_\").",
      solution: `messy_name = "  aLiShA jOnEs  "

clean_name = messy_name.strip().title()
username = clean_name.lower().replace(" ", "_")

print(clean_name)
print(username)`,
      check(result, code) {
        const { messy_name, clean_name, username } = result.snapshot;

        if (
          !/\bclean_name\s*=\s*messy_name\s*\.\s*strip\s*\(\s*\)\s*\.\s*title\s*\(\s*\)/.test(code)
        ) {
          return fail("Create clean_name using messy_name.strip().title().");
        }

        if (
          !/\busername\s*=\s*clean_name\s*\.\s*lower\s*\(\s*\)\s*\.\s*replace\s*\(\s*["'] ["']\s*,\s*["']_["']\s*\)/.test(code)
        ) {
          return fail('Create username using clean_name.lower().replace(" ", "_").');
        }

        if (
          !messy_name?.exists ||
          messy_name.type !== "str" ||
          messy_name.value !== "  aLiShA jOnEs  "
        ) {
          return fail("Keep the supplied messy_name value.");
        }

        if (!clean_name?.exists || clean_name.value !== "Alisha Jones") {
          return fail("clean_name should contain Alisha Jones.");
        }

        if (!username?.exists || username.value !== "alisha_jones") {
          return fail("username should contain alisha_jones.");
        }

        return pass("Excellent — you cleaned and transformed the string using methods.");
      }
    },

    {
      id: "strings-loop-count",
      topic: 6,
      title: "29. Looping through a string",
      instruction: "Loop through the text one character at a time. Count its vowels and spaces, then display both totals.",
      starter: `text = "Python programming"
vowel_count = 0
space_count = 0

# Loop through each character

# Count vowels

# Count spaces

# Display both totals
`,
      hint: "Use for character in text. Test character.lower() in \"aeiou\" and character == \" \".",
      solution: `text = "Python programming"
vowel_count = 0
space_count = 0

for character in text:
    if character.lower() in "aeiou":
        vowel_count += 1

    if character == " ":
        space_count += 1

print("Vowels:", vowel_count)
print("Spaces:", space_count)`,
      check(result, code) {
        const { text, vowel_count, space_count } = result.snapshot;

        if (!/\bfor\s+character\s+in\s+text\s*:/.test(code)) {
          return fail("Loop through the text using for character in text:");
        }

        if (
          !/\bcharacter\s*\.\s*lower\s*\(\s*\)\s+in\s+["']aeiou["']/.test(code)
        ) {
          return fail('Check vowels using character.lower() in "aeiou".');
        }

        const addsVowel =
          /\bvowel_count\s*\+=\s*1\b/.test(code) ||
          /\bvowel_count\s*=\s*vowel_count\s*\+\s*1\b/.test(code);

        if (!addsVowel) {
          return fail("Add 1 to vowel_count when a vowel is found.");
        }

        if (!/\bcharacter\s*==\s*["'] ["']/.test(code)) {
          return fail('Check for a space using character == " ".');
        }

        const addsSpace =
          /\bspace_count\s*\+=\s*1\b/.test(code) ||
          /\bspace_count\s*=\s*space_count\s*\+\s*1\b/.test(code);

        if (!addsSpace) {
          return fail("Add 1 to space_count when a space is found.");
        }

        if (!text?.exists || text.type !== "str" || text.value !== "Python programming") {
          return fail('text should contain "Python programming".');
        }

        if (!vowel_count?.exists || vowel_count.type !== "int" || vowel_count.value !== 4) {
          return fail("vowel_count should contain 4.");
        }

        if (!space_count?.exists || space_count.type !== "int" || space_count.value !== 1) {
          return fail("space_count should contain 1.");
        }

        return pass("Well done — your loop examined every character and counted correctly.");
      }
    },

    {
      id: "strings-challenge",
      topic: 6,
      title: "30. String handling challenge",
      instruction: "Clean and normalise the message, replace coding with programming, extract the first word, check for python, count the letter n, and display the results using f-strings.",
      starter: `message = "  PYTHON makes coding FUN  "

# Remove the outside spaces
cleaned =

# Convert the text to lowercase
normalised =

# Replace coding with programming
corrected =

# Extract and title-case the first word
challenge_first_word =

# Check whether python is present
contains_python =

# Count the letter n
number_of_n =

# Display clear results using f-strings
`,
      hint: "Use strip(), lower(), replace(), a [:6] slice, the in operator and count(\"n\").",
      solution: `message = "  PYTHON makes coding FUN  "

cleaned = message.strip()
normalised = cleaned.lower()
corrected = normalised.replace("coding", "programming")
challenge_first_word = corrected[:6].title()
contains_python = "python" in corrected
number_of_n = corrected.count("n")

print(f"{challenge_first_word}: {corrected}")
print(f"Contains Python: {contains_python}")
print(f"Number of n characters: {number_of_n}")`,
      check(result, code) {
        const {
          message,
          cleaned,
          normalised,
          corrected,
          challenge_first_word,
          contains_python,
          number_of_n
        } = result.snapshot;

        if (!/\bcleaned\s*=\s*message\s*\.\s*strip\s*\(\s*\)/.test(code)) {
          return fail("Create cleaned using message.strip().");
        }

        if (!/\bnormalised\s*=\s*cleaned\s*\.\s*lower\s*\(\s*\)/.test(code)) {
          return fail("Create normalised using cleaned.lower().");
        }

        if (
          !/\bcorrected\s*=\s*normalised\s*\.\s*replace\s*\(\s*["']coding["']\s*,\s*["']programming["']\s*\)/.test(code)
        ) {
          return fail('Replace coding using normalised.replace("coding", "programming").');
        }

        if (
          !/\bchallenge_first_word\s*=\s*corrected\s*\[\s*:\s*6\s*\]\s*\.\s*title\s*\(\s*\)/.test(code)
        ) {
          return fail("Create challenge_first_word using corrected[:6].title().");
        }

        if (
          !/\bcontains_python\s*=\s*["']python["']\s+in\s+corrected\b/.test(code)
        ) {
          return fail('Check the text using contains_python = "python" in corrected.');
        }

        if (
          !/\bnumber_of_n\s*=\s*corrected\s*\.\s*count\s*\(\s*["']n["']\s*\)/.test(code)
        ) {
          return fail('Count n using corrected.count("n").');
        }

        if (!/\bprint\s*\(\s*f["']/.test(code)) {
          return fail("Display the results using at least one f-string.");
        }

        if (
          !message?.exists ||
          message.type !== "str" ||
          message.value !== "  PYTHON makes coding FUN  "
        ) {
          return fail("Keep the supplied message value.");
        }

        if (!cleaned?.exists || cleaned.value !== "PYTHON makes coding FUN") {
          return fail("cleaned should contain the message without its outside spaces.");
        }

        if (!normalised?.exists || normalised.value !== "python makes coding fun") {
          return fail("normalised should contain lowercase text.");
        }

        if (!corrected?.exists || corrected.value !== "python makes programming fun") {
          return fail("corrected should contain python makes programming fun.");
        }

        if (!challenge_first_word?.exists || challenge_first_word.value !== "Python") {
          return fail("challenge_first_word should contain Python.");
        }

        if (!contains_python?.exists || contains_python.value !== true) {
          return fail("contains_python should contain True.");
        }

        if (!number_of_n?.exists || number_of_n.type !== "int" || number_of_n.value !== 3) {
          return fail("number_of_n should contain 3.");
        }

        return pass("Challenge complete — you combined the main string-handling techniques successfully.");
      }
    }
  ]
};
