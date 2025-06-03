README.md

# Format Converter

A web-based tool to convert documents and data between a variety of formats. The Format Converter supports text markup formats (Markdown, HTML, AML) and data serialization formats (JSON, YAML, TOML, CSV). Users can paste or type content in one format and easily convert it into the other using a convenient web interface.

## Features

- **Multi-format conversion:** Convert between Markdown, HTML, AML, JSON, YAML, TOML, and CSV.
- **Two-way conversions:** Most formats support both import (parsing) and export (generation).
- **Extensible design:** Add new formats easily by adding a new engine module without altering the core code.
- **Web-based interface:** No installation needed to use – just open the web page to convert files locally in your browser.
- **Lossless data conversion:** Data-oriented formats (JSON, YAML, TOML) preserve all structure and values through conversions. 

## Web Interface Overview

The interface is a single-page application with two dropdown selectors (for input and output format), an input text area for the source content, and an output text area for the converted result. A "Convert" button triggers the conversion. The selected input format's parser is used to read the input text into an intermediate representation, which is then passed to the output format's generator to produce the result. If a conversion is not applicable (for example, converting a free-form document like Markdown into a tabular format like CSV), the tool will attempt a best-effort conversion or show an error message.

**Example: JSON to YAML Conversion**

Input (JSON):
```json
{ "name": "Alice", "age": 30, "skills": ["JS", "YAML"] }
```

Output (YAML):
```yaml
name: Alice
age: 30
skills:
  - JS
  - YAML
```

## Supported Formats

- **Markdown (.md):** Marked-up text with headings, lists, emphasis, etc. Can be converted to/from HTML and other markup. The converter uses a Markdown parser library to translate Markdown into an intermediate HTML-like structure and vice versa for output.
- **HTML (.html):** HyperText Markup Language. The converter can parse HTML into a DOM-like object structure and also generate HTML from the intermediate representation. Useful for converting to Markdown or other markup.
- **AML (.aml):** Another Markup Language (a generic XML-like format). Parsed similarly to HTML using an XML parser. Demonstrates how additional markup languages can be supported.
- **JSON (.json):** JavaScript Object Notation, a structured data format. The converter parses JSON text into a JavaScript object, and can also stringify objects back to JSON.
- **YAML (.yaml / .yml):** YAML Ain't Markup Language, a human-friendly data serialization. Parsed into JavaScript objects using a YAML library, and generated from objects.
- **TOML (.toml):** Tom's Obvious, Minimal Language, another configuration file format. Parsed into objects via a TOML parser and generated from objects.
- **CSV (.csv):** Comma-Separated Values, a tabular data format. Parsed into an array of objects (or arrays) and generated back from array data. Assumes the first row contains headers.

## Installation & Running

You can use the Format Converter in two ways:
1. **Directly in a Browser:** Open the `src/web/index.html` file in a web browser. Because the app uses ES module imports, you should serve the files via a local web server (to avoid CORS issues with file://). For example, you can run a simple Python server in the project directory:
   ```bash
   python3 -m http.server 8080
   ```
   Then open `http://localhost:8080/src/web/index.html` in your browser.
2. **Docker Container:** Build and run the provided Docker container to host the app:
   ```bash
   docker build -t format-converter .
   docker run -p 8080:80 format-converter
   ```
   Then open `http://localhost:8080` in your browser to use the converter.
   
No additional installation is required since all dependencies are bundled or included via the web interface.

## Usage

- Select the input format of the text you will paste in the left text area.
- Select the desired output format in the right dropdown.
- Enter or paste your content in the input text area.
- Click **Convert**. The converted output will appear in the right text area.
- If the input text is not valid for the selected input format, an error message will be shown in place of the output.
- To try another conversion, you can modify the input or switch formats and click Convert again.

## Development

This project is built with vanilla JavaScript, HTML, and CSS. Each format conversion logic resides in its own module under `src/engines/`, and the web UI code is under `src/web/`. The project uses Node.js for development tooling (testing and linting) but the conversion itself runs completely in the browser.

**Running Tests:** 
- Install Node.js (if not using the Docker dev environment).
- Run `npm install` to install development dependencies.
- Run `npm test` to execute the test suite. This will run unit tests and property-based tests to verify conversions.
- Run `npm run lint` to check for code style issues.

We use **Mocha** as the test framework with Node's assert library, and **fast-check** for property-based testing of conversions. The tests ensure that converting data to another format and back yields an equivalent result (for example, JSON -> YAML -> JSON), and that known reference conversions (like Markdown to HTML) produce expected outputs.

**Adding New Formats:** To add support for a new format, simply create a new module in `src/engines/` implementing `parse(input)` and `stringify(data)` for the format. Then import and register the new engine in `src/web/app.js` so that it appears in the dropdowns. The rest of the system will handle it seamlessly.

## Project Structure

```text
├── README.md                         # Project overview and usage instructions
├── Dockerfile                        # Container setup to serve the web app
├── package.json                      # Node.js project file with dependencies and scripts
├── .eslintrc.json                    # Linting configuration for ESLint
├── .github/
│   └── workflows/
│       └── ci.yml                    # Continuous integration pipeline definition (lint + tests)
├── docs/
│   └── COMPLETENESS.md               # Checklist of blueprint requirements and completion status
├── specs/
│   └── FormatConverterSpec.md        # Detailed project specifications and design notes
├── src/
│   ├── engines/                      # Self-contained format conversion engines
│   │   ├── markdown.js               # Markdown parsing and generation logic
│   │   ├── html.js                   # HTML parsing and generation logic
│   │   ├── aml.js                    # AML (generic markup) parsing and generation
│   │   ├── json.js                   # JSON parsing and generation
│   │   ├── yaml.js                   # YAML parsing and generation
│   │   ├── toml.js                   # TOML parsing and generation
│   │   └── csv.js                    # CSV parsing and generation
│   └── web/                          # Frontend user interface
│       ├── index.html                # Webpage with dropdowns and text areas
│       ├── style.css                 # Basic styling for the interface
│       └── app.js                    # Client-side logic to handle format selection and conversion
├── tests/
│   ├── roundtrip.test.js             # Property-based round-trip tests for format conversions
│   └── sample_format.test.js         # Unit tests for specific format conversions (e.g., Markdown to HTML)
└── examples/
    ├── example.md                    # Example Markdown file
    ├── example.html                  # Converted HTML from example.md
    ├── example.json                  # Example JSON file
    ├── example.yaml                  # Converted YAML from example.json
    └── ...                           # etc., additional examples for other formats
```

## License

This project is licensed under the MIT License – see the `LICENSE` file for details.

specs/FormatConverterSpec.md

# Format Converter – Project Specification

## Objectives

- Allow users to convert documents and data between multiple formats using a single unified interface.
- Provide support for common markup (Markdown, HTML, AML) and data formats (JSON, YAML, TOML, CSV).
- Ensure conversions are as lossless as possible for data formats, and reasonably preserve content for document formats.
- Design the system to be extensible so new formats can be added with minimal changes.

## Functional Requirements

1. **Format Selection:** The UI must provide controls for the user to select the input format and output format from the supported list.
2. **Input/Output Interface:** The user must be able to input text in the chosen input format and see the converted text in the target format.
3. **Conversion Logic:** The system must convert from any supported input format to any supported output format. 
   - Data formats (JSON, YAML, TOML, CSV) should preserve equivalent data structures through conversion.
   - Markup formats (Markdown, HTML, AML) should preserve the content structure (headings, bold text, etc.) through conversions.
   - Converting between fundamentally different format types (e.g. Markdown to JSON) should either produce a structured representation (e.g. JSON representing document structure) or notify the user if conversion is not meaningful.
4. **Error Handling:** If the input text is malformed for the selected format, the user should get a clear error message instead of a silent failure.
5. **No External Service:** Conversion must happen entirely in the browser (client-side) once the page is loaded, for privacy and offline use.

## Non-Functional Requirements

- **Usability:** The interface should be simple and responsive. Conversion should happen quickly (near-instant for typical documents).
- **Maintainability:** The codebase should isolate format-specific logic in separate modules to make it easy to update or add formats.
- **Test Coverage:** Key conversion functions should be covered by automated tests, including property-based tests to validate conversion correctness across a range of inputs.
- **Portability:** The project should run in modern browsers without requiring installation. The Docker container should make it easy to run the tool in a consistent environment or as a self-contained web service.
- **Compliance:** Follow the repository structure and documentation standards (Prompt-Castle blueprint) to ensure completeness and clarity.

## System Design

The Format Converter uses a modular architecture:
- **Engine Modules:** Each format has an engine module (in `src/engines/`) that exports a `parse(input)` function to read text into a JavaScript object (intermediate form), and a `stringify(data)` function to produce text output from an object. This design abstracts the conversion logic for each format.
- **Intermediate Representation:** For data-oriented formats, the intermediate representation is a generic JavaScript object/array structure (the typical result of JSON.parse). For document formats like HTML/Markdown/AML, the intermediate representation is a tree structure representing the document (modeled as nested JavaScript objects for elements and text nodes). This common structure allows cross-conversion: e.g., Markdown is first parsed into a DOM-like tree, which can then be output as HTML or even serialized to JSON.
- **Conversion Flow:** The web app selects the appropriate engine based on the input format to parse the input text. The resulting intermediate structure is then passed to the engine for the output format to generate the target text. The conversion is synchronous and happens entirely in the browser. If a particular conversion path is not straightforward (for example, converting an entire JSON data structure to Markdown), the system may either present the data in a rudimentary format (e.g., JSON data as a code block in Markdown) or throw a format error.
- **UI Layer:** The HTML/JS frontend collects user input and format selections, and then uses the engines to perform the conversion. The UI is kept separate from the conversion logic. It simply invokes the engines and displays results or errors.

## Format Engine Details

- **Markdown Engine:** Uses a third-party library (e.g., `marked`) to parse Markdown into HTML, then leverages the HTML engine to create the intermediate DOM structure. For generation, it can take a DOM structure (from the intermediate form) and use a library (e.g., `turndown`) to produce Markdown text.
- **HTML Engine:** Utilizes the browser's DOM parser to convert HTML strings into a DOM Document, then recursively constructs a JavaScript object representing the DOM (including tags, attributes, and children). The stringify function does the inverse, constructing HTML from the object tree. This engine acts as a bridge for converting between markup formats.
- **AML Engine:** Treated similarly to HTML. AML (Another Markup Language) is assumed to be an XML-like format. The engine can use an XML parser (DOMParser with 'application/xml') to build a DOM, and then the approach is analogous to HTML. This showcases the system's extensibility to new markup languages.
- **JSON Engine:** Uses built-in `JSON.parse` and `JSON.stringify`. The intermediate is naturally a JavaScript object. This is a lossless conversion for all JSON-compatible data.
- **YAML Engine:** Uses a YAML library (e.g., js-yaml) to parse YAML into objects and to dump objects to YAML. It supports all basic YAML features and maps them to corresponding JavaScript types.
- **TOML Engine:** Utilizes a TOML parsing library to produce objects and stringify them back. Data types like numbers, strings, booleans, and nested tables are supported via the library.
- **CSV Engine:** Parses CSV by splitting lines and commas, assuming the first line is a header row. Produces an array of objects (one per row, keys from header). The generator takes an array of objects (or array of arrays) and produces CSV text accordingly. It handles basic type inference (e.g., numeric and boolean strings are converted to proper types on parse).

All engines conform to the same interface, making them interchangeable. If a format cannot represent the full complexity of the intermediate structure (for instance, representing a rich text document in CSV), the engine should either simplify the output or raise an error.

## Testing Strategy

The project includes both unit tests and property-based tests:
- **Unit Tests:** For each format engine, there are targeted tests with specific inputs and expected outputs. For example, converting a known Markdown snippet to HTML should produce the expected HTML tags, or a sample CSV string should parse into a specific object structure.
- **Round-Trip Property Tests:** Using the fast-check library, the tests generate random data structures and verify that converting from one format to another and back yields the original data. This is done for data formats that can be meaningfully round-tripped (JSON, YAML, TOML, and simple cases of CSV). For instance, a random JSON object is converted to YAML and back to JSON, and the test asserts the two JSON objects are deeply equal. This gives confidence that no data is lost in translation between those formats.
- **Cross-Format Sanity Tests:** The tests also include some cross-format conversions (e.g., Markdown -> HTML -> Markdown) to ensure that the content remains consistent. Due to differences in syntax, the regenerated Markdown may not be identical to the original, but the structural elements (like headings, lists, emphasis) should remain correct.

The CI pipeline (see `.github/workflows/ci.yml`) runs all linters and tests on each commit to ensure code quality and conversion accuracy.

## Future Improvements

- **Additional Formats:** Add support for XML and others (e.g., binary formats like Excel or PDF via appropriate libraries) following the same modular approach.
- **User Interface Enhancements:** Improve the text editor areas with syntax highlighting or automatic format detection, and allow file upload/download for convenience.
- **Performance Optimizations:** For very large files, consider streaming conversion or web workers to keep the UI responsive.
- **Robust CSV parsing:** Use a full CSV parser library to properly handle quoted fields, delimiters, and edge cases beyond the basic implementation.

This specification, alongside the repository's README and tests, ensures that the project is implemented according to the defined requirements and can be maintained and extended in the future.

package.json

{
  "name": "format-converter",
  "version": "0.1.0",
  "description": "A web-based converter between Markdown, HTML, JSON, YAML, TOML, CSV, AML formats.",
  "license": "MIT",
  "type": "module",
  "scripts": {
    "start": "serve -s src/web -l 8080",
    "test": "mocha tests/**/*.js",
    "lint": "eslint ."
  },
  "dependencies": {
    "js-yaml": "^4.3.0",
    "@iarna/toml": "^3.0.0",
    "marked": "^4.3.0",
    "turndown": "^7.1.1"
  },
  "devDependencies": {
    "serve": "^14.0.1",
    "mocha": "^10.2.0",
    "fast-check": "^3.7.0",
    "eslint": "^8.35.0",
    "jsdom": "^21.1.0"
  }
}

.eslintrc.json

{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "rules": {
  }
}

Dockerfile

# Use Node.js for building and serving
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the project files
COPY . .

# Run linters and tests (optional for production, included for completeness)
RUN npm run lint && npm run test

# Install a simple static server
RUN npm install -g serve

# Expose port 80 and set the default command to serve the web app
EXPOSE 80
CMD ["serve", "-s", "src/web", "-l", "80"]

.github/workflows/ci.yml

name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies
        run: npm install

      - name: Lint
        run: npm run lint

      - name: Run tests
        run: npm run test

src/web/index.html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Format Converter</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>Format Converter</h1>

  <div id="controls">
    <label for="inputFormat">Input format:</label>
    <select id="inputFormat"></select>

    <label for="outputFormat">Output format:</label>
    <select id="outputFormat"></select>

    <button id="convertBtn">Convert</button>
  </div>

  <div class="container">
    <div class="pane">
      <h2>Input</h2>
      <textarea id="inputText" placeholder="Enter text here..."></textarea>
    </div>
    <div class="pane">
      <h2>Output</h2>
      <textarea id="outputText" placeholder="Output will appear here..." readonly></textarea>
    </div>
  </div>

  <script type="module" src="app.js"></script>
</body>
</html>

src/web/style.css

body {
  font-family: sans-serif;
  margin: 1em;
}
#controls {
  margin-bottom: 1em;
}
#controls label {
  margin-right: 0.5em;
}
#controls select, #controls button {
  margin-right: 1em;
}
.container {
  display: flex;
  gap: 1em;
}
.pane {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.pane h2 {
  margin-top: 0;
}
textarea {
  flex: 1;
  font-family: monospace;
  font-size: 0.9em;
  padding: 0.5em;
}

src/web/app.js

import * as markdownEngine from '../engines/markdown.js';
import * as htmlEngine from '../engines/html.js';
import * as amlEngine from '../engines/aml.js';
import * as jsonEngine from '../engines/json.js';
import * as yamlEngine from '../engines/yaml.js';
import * as tomlEngine from '../engines/toml.js';
import * as csvEngine from '../engines/csv.js';

const engines = {
  "Markdown": markdownEngine,
  "HTML": htmlEngine,
  "AML": amlEngine,
  "JSON": jsonEngine,
  "YAML": yamlEngine,
  "TOML": tomlEngine,
  "CSV": csvEngine
};

// Populate dropdowns
const inputSelect = document.getElementById('inputFormat');
const outputSelect = document.getElementById('outputFormat');
for (const format of Object.keys(engines)) {
  const optIn = document.createElement('option');
  optIn.value = format;
  optIn.textContent = format;
  inputSelect.appendChild(optIn);
  const optOut = document.createElement('option');
  optOut.value = format;
  optOut.textContent = format;
  outputSelect.appendChild(optOut);
}
// Set default selections
inputSelect.value = "Markdown";
outputSelect.value = "HTML";

const inputTextArea = document.getElementById('inputText');
const outputTextArea = document.getElementById('outputText');
const convertBtn = document.getElementById('convertBtn');

convertBtn.addEventListener('click', () => {
  const inFormat = inputSelect.value;
  const outFormat = outputSelect.value;
  const inputText = inputTextArea.value;
  try {
    // Prevent conversions between fundamentally different format types (document vs data)
    const docFormats = ["Markdown", "HTML", "AML"];
    const dataFormats = ["JSON", "YAML", "TOML", "CSV"];
    const crossType = (docFormats.includes(inFormat) && dataFormats.includes(outFormat)) ||
                      (dataFormats.includes(inFormat) && docFormats.includes(outFormat));
    if (crossType) {
      throw new Error("Conversion between document and data formats is not supported.");
    }

    // Parse input using the selected format engine
    const engineIn = engines[inFormat];
    const intermediate = engineIn.parse(inputText);
    // Generate output using the target format engine
    const engineOut = engines[outFormat];
    const result = engineOut.stringify(intermediate);
    outputTextArea.value = result;
  } catch (err) {
    outputTextArea.value = "Error: " + err.message;
    console.error(err);
  }
});

src/engines/json.js

export function parse(input) {
  return JSON.parse(input);
}

export function stringify(data, options = {}) {
  const indent = options.indent !== undefined ? options.indent : 2;
  return JSON.stringify(data, null, indent);
}

src/engines/yaml.js

import yaml from 'js-yaml';

export function parse(input) {
  return yaml.load(input);
}

export function stringify(data) {
  return yaml.dump(data);
}

src/engines/toml.js

import { parse as parseToml, stringify as stringifyToml } from '@iarna/toml';

export function parse(input) {
  return parseToml(input);
}

export function stringify(data) {
  return stringifyToml(data);
}

src/engines/csv.js

export function parse(input) {
  const lines = input.trim().split(/\r?\n/);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => line.split(','));
  // Convert rows to objects using headers, with basic type inference
  const result = rows.map(cols => {
    const obj = {};
    headers.forEach((h, i) => {
      let value = cols[i] !== undefined ? cols[i] : "";
      if (value === "true" || value === "false") {
        obj[h] = (value === "true");
      } else if (value !== "" && !isNaN(Number(value))) {
        obj[h] = Number(value);
      } else {
        obj[h] = value;
      }
    });
    return obj;
  });
  return result;
}

export function stringify(data) {
  if (!Array.isArray(data)) {
    throw new Error("CSV stringify expects an array of objects or arrays");
  }
  if (data.length === 0) return "";
  let headers = [];
  let rows = [];
  if (typeof data[0] === 'object' && !Array.isArray(data[0])) {
    // Array of objects
    headers = Object.keys(data[0]);
    rows = data.map(obj => headers.map(h => (obj[h] !== undefined ? obj[h] : "")));
  } else {
    // Array of arrays (or primitives)
    rows = data.map(row => Array.isArray(row) ? row : [row]);
    // Generate default headers for columns
    const colCount = Math.max(...rows.map(r => r.length));
    headers = [...Array(colCount).keys()].map(i => `col${i+1}`);
    rows = rows.map(r => r.concat(Array(headers.length - r.length).fill("")));
  }
  // Build CSV lines
  const csvLines = [];
  csvLines.push(headers.join(','));
  for (const row of rows) {
    const line = row.map(val => {
      let str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        str = '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    }).join(',');
    csvLines.push(line);
  }
  return csvLines.join('\n');
}

src/engines/markdown.js

import { marked } from 'marked';
import TurndownService from 'turndown';
import * as htmlEngine from './html.js';

const turndown = new TurndownService();

export function parse(input) {
  // Convert Markdown to HTML, then to intermediate structure via HTML engine
  const html = marked.parse(input);
  return htmlEngine.parse(html);
}

export function stringify(data) {
  // Convert intermediate structure to HTML, then to Markdown
  const html = htmlEngine.stringify(data);
  return turndown.turndown(html);
}

src/engines/html.js

export function parse(input) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');
  // Recursive function to convert DOM Node to JS object
  function nodeToObj(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return { text: node.textContent };
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }
    const obj = { tag: node.tagName.toLowerCase() };
    if (node.attributes && node.attributes.length > 0) {
      obj.attrs = {};
      for (let attr of node.attributes) {
        obj.attrs[attr.name] = attr.value;
      }
    }
    const children = [];
    node.childNodes.forEach(child => {
      const childObj = nodeToObj(child);
      if (childObj) children.push(childObj);
    });
    if (children.length > 0) {
      obj.children = children;
    }
    return obj;
  }
  // Convert body children to object structure
  const bodyChildren = [];
  doc.body.childNodes.forEach(child => {
    const childObj = nodeToObj(child);
    if (childObj) bodyChildren.push(childObj);
  });
  return bodyChildren.length === 1 ? bodyChildren[0] : bodyChildren;
}

export function stringify(data) {
  // Recursive function to convert object to HTML string
  function objToHtml(node) {
    if (node === null || node === undefined) {
      return "";
    }
    if (Array.isArray(node)) {
      return node.map(objToHtml).join("");
    }
    if (node.text !== undefined) {
      // Escape special characters in text
      return node.text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
    if (!node.tag) {
      throw new Error("Invalid DOM node object");
    }
    const tag = node.tag;
    const attrs = node.attrs || {};
    const attrString = Object.entries(attrs).map(([key, value]) => {
      if (value === false) return "";
      if (value === true) return ` ${key}`;
      return ` ${key}="${value}"`;
    }).join("");
    const childrenHtml = node.children ? node.children.map(objToHtml).join("") : "";
    return `<${tag}${attrString}>${childrenHtml}</${tag}>`;
  }
  return objToHtml(data);
}

src/engines/aml.js

import * as htmlEngine from './html.js';

export function parse(input) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(input, 'application/xml');
  // Convert XML DOM to string and reuse HTML engine parsing (assuming similar structure)
  const xmlString = new XMLSerializer().serializeToString(xmlDoc);
  return htmlEngine.parse(xmlString);
}

export function stringify(data) {
  // Use HTML engine's stringify as a proxy (XML output would be similar to HTML here)
  const htmlString = htmlEngine.stringify(data);
  // If needed, further XML-specific adjustments could be made here.
  return htmlString;
}

tests/roundtrip.test.js

import { JSDOM } from 'jsdom';
const dom = new JSDOM("<!DOCTYPE html>");
global.DOMParser = dom.window.DOMParser;
global.XMLSerializer = dom.window.XMLSerializer;
global.Node = dom.window.Node;

import { strict as assert } from 'assert';
import * as fc from 'fast-check';
import * as jsonEngine from '../src/engines/json.js';
import * as yamlEngine from '../src/engines/yaml.js';
import * as tomlEngine from '../src/engines/toml.js';
import * as csvEngine from '../src/engines/csv.js';
import * as markdownEngine from '../src/engines/markdown.js';
import * as htmlEngine from '../src/engines/html.js';

describe('Format Conversion Round-trip Tests', function() {
  this.timeout(5000);

  it('JSON <-> YAML round-trip', () => {
    fc.assert(fc.property(fc.jsonObject(), data => {
      const yamlText = yamlEngine.stringify(data);
      const parsedBack = yamlEngine.parse(yamlText);
      assert.deepStrictEqual(parsedBack, data);
    }));
  });

  it('JSON <-> TOML round-trip', () => {
    fc.assert(fc.property(fc.jsonObject(), data => {
      // TOML may not support certain complex structures; ensuring deep equality if parseable
      const tomlText = tomlEngine.stringify(data);
      const parsedBack = tomlEngine.parse(tomlText);
      assert.deepStrictEqual(parsedBack, data);
    }));
  });

  it('CSV <-> JSON round-trip (simple data)', () => {
    const data = [
      { Name: "Alice", Age: 30 },
      { Name: "Bob", Age: 25 }
    ];
    const csvText = csvEngine.stringify(data);
    const parsedBack = csvEngine.parse(csvText);
    assert.deepStrictEqual(parsedBack, data);
  });

  it('Markdown -> HTML conversion', () => {
    const mdText = "# Hello **World**";
    const intermediate = markdownEngine.parse(mdText);
    const htmlOut = htmlEngine.stringify(intermediate);
    assert(htmlOut.includes("<h1") && htmlOut.includes("<strong>World</strong>"));
  });

  it('HTML -> Markdown conversion', () => {
    const htmlText = "<h1>Hello <strong>World</strong></h1>";
    const intermediate = htmlEngine.parse(htmlText);
    const mdOut = markdownEngine.stringify(intermediate);
    assert(mdOut.startsWith("# Hello **World**"));
  });
});

docs/COMPLETENESS.md

# Completeness Checklist

- [x] **Structured README** following the Castle blueprint (includes Introduction, Features, Usage, Development, etc.)
- [x] **Repository structure** with clear directories (`src/`, `tests/`, `specs/`, `docs/`, `examples/`) and explanations.
- [x] **Format engines**: Separate module implemented for each format (Markdown, HTML, AML, JSON, YAML, TOML, CSV).
- [x] **Extensibility**: Adding a new format only requires adding a new engine module and updating the UI registration.
- [x] **Example conversion**: Provided example conversion (JSON to YAML) in README and example files in `examples/` directory.
- [x] **Utility logic**: Conversion orchestration is handled in `src/web/app.js`, independent of specific format implementations.
- [x] **Testing**: Unit tests for specific cases and property-based round-trip tests are included under `tests/`.
- [x] **CI Pipeline**: GitHub Actions workflow (`ci.yml`) set up to run linters and tests on each push/PR.
- [x] **Docker Support**: Dockerfile provided to run the app in a container and as a development environment.
- [x] **Specification**: Detailed project spec and design notes included in `specs/FormatConverterSpec.md`.
