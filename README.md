# Python Crash Course – Compact Moodle Editor

A compact Python practice editor for embedding in Moodle with GitHub Pages.

## Included features

- One editor containing five practice tasks
- Variables, data types, input, casting and combined practice
- Distinct Coding Lab appearance with a charcoal header and neutral workspace
- Python syntax highlighting
- Terminal-style `input()` inside the output panel
- Run, Stop, Check, Reset, Hint and Solution controls
- Friendly line-numbered Python errors
- Worker-based execution so an infinite loop can be stopped without freezing Moodle
- Student code saved locally in the browser for each task
- No Moodle grades, names, code or answers are sent to GitHub

## Files

- `index.html` – page structure
- `styles.css` – Coding Lab styling with NPTC accents and VS Code Dark+
- `app.js` – tasks, editor controls and checking
- `python-worker.js` – Pyodide Python runner
- `moodle-embed.html` – iframe block to paste into Moodle

## Publish with GitHub Pages

1. Create a new public GitHub repository named `python-crash-course-editor`.
2. Upload all files from this folder to the root of the repository.
3. Open the repository's **Settings**.
4. Select **Pages** in the left menu.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and the `/ (root)` folder.
7. Select **Save**.
8. GitHub will publish the page at an address similar to:
   `https://YOUR-GITHUB-USERNAME.github.io/python-crash-course-editor/`

The first publication can take a short while to appear. Refresh the GitHub Pages settings page to see the published address.

## Test before using Moodle

Open the published GitHub Pages address in Chrome or Edge.

Check that:

1. The status changes from **Loading Python…** to **Python ready**.
2. The Variables task runs after entering `score = 10`.
3. The Input task lets you type directly after the prompt in the terminal and press Enter.
4. The Check button gives feedback.
5. The Stop button can stop a deliberately repeating program.

Pyodide is downloaded the first time the page opens, so the first load is slower than later loads.

## Embed in Moodle

1. Open `moodle-embed.html`.
2. Replace `YOUR-GITHUB-USERNAME` with your GitHub username.
3. In Moodle, add a **Text and media area**.
4. Open Moodle's HTML/source-code view.
5. Paste the complete iframe block.
6. Save and display the Moodle course page.

If Moodle removes the iframe or refuses to display it, the college Moodle administrator may need to allow iframe embedding or trust the `github.io` domain.

## Open a particular task automatically

The same editor can open a chosen task using a URL parameter:

- `?task=variables`
- `?task=data-types`
- `?task=input`
- `?task=casting`
- `?task=combined`

Example:

`https://YOUR-GITHUB-USERNAME.github.io/python-crash-course-editor/?task=input`

The dropdown remains available, so students can still move between all tasks.

## Change or add tasks

Open `app.js`. Each task is an object inside the `TASKS` list with:

- `id`
- `title`
- `instruction`
- `starter`
- `hint`
- `solution`
- `check(result, code)`

Add new simple variables that need checking to the `SNAPSHOT_NAMES` list in `app.js`.

## External libraries

The page loads:

- Pyodide 0.29.4 from jsDelivr
- CodeMirror 5.65.20 from cdnjs

Students therefore need internet access when the editor loads.
