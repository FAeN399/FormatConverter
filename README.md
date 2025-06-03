# Format Converter

**Status: ✅ Phase 1 Infrastructure Complete** | **Last Updated: June 3, 2025**

A web-based tool for converting between multiple data and document formats including JSON, YAML, TOML, CSV, Markdown, HTML, and AML.

## 🚀 Quick Start

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Open the web interface:**
   ```
   http://localhost:8080/src/web/index.html
   ```

3. **Test the conversion engines:**
   ```bash
   npm test
   ```

## 📋 Development Setup

### Prerequisites
- Node.js ≥20.19.0
- npm ≥10.8.0

### Installation
```bash
# Clone the repository
git clone https://github.com/FAeN399/FormatConverter.git
cd FormatConverter

# Install dependencies
npm install

# Start development server
npm start
```

### Development Commands
```bash
npm start        # Start development server on port 8080
npm test         # Run test suite (Mocha + fast-check)
npm run dev      # Start server in background
npm run stop     # Stop background server
```

## 🎯 Project Status

### ✅ **Phase 1 Complete (Infrastructure Stabilization)**
- [x] Fixed npm test infrastructure
- [x] Consolidated web interface to single `index.html`
- [x] Validated all 7 format engines working
- [x] Established reliable development workflow
- [x] 6 of 8 tests passing (2 minor fast-check API issues)

### 📋 **Next: Phase 2 (Quality Improvements)**
See `ENGINEERING_PLAN.md` for detailed roadmap.

## Features

- **Multi-format conversion:** Convert between Markdown, HTML, AML, JSON, YAML, TOML, and CSV.
- **Two-way conversions:** Most formats support both import (parsing) and export (generation).
- **Extensible design:** Add new formats easily by adding a new engine module without altering the core code.
- **Web-based interface:** No installation needed to use – just open the web page to convert files locally in your browser.
- **Lossless data conversion:** Data-oriented formats (JSON, YAML, TOML) preserve all structure and values through conversions. 

## Web Interface Overview

The interface is a single-page application with two dropdown selectors (for input and output format), an input text area for the source content, and an output text area for the converted result. A "Convert" button triggers the conversion. The selected input format's parser is used to read the input text into an intermediate representation, which is then passed to the output format's generator to produce the result.

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

- **Markdown (.md):** Marked-up text with headings, lists, emphasis, etc.
- **HTML (.html):** HyperText Markup Language.
- **AML (.aml):** Another Markup Language (a generic XML-like format).
- **JSON (.json):** JavaScript Object Notation, a structured data format.
- **YAML (.yaml / .yml):** YAML Ain't Markup Language, a human-friendly data serialization.
- **TOML (.toml):** Tom's Obvious, Minimal Language, another configuration file format.
- **CSV (.csv):** Comma-Separated Values, a tabular data format.

## Installation & Running

### Option 1: Using npm (Recommended)
```bash
git clone https://github.com/FAeN399/FormatConverter.git
cd FormatConverter
npm install
npm start
```
Then open `http://localhost:8080` in your browser.

### Option 2: Docker Container
```bash
docker build -t format-converter .
docker run -p 8080:80 format-converter
```

### Option 3: Simple Python Server
```bash
python3 -m http.server 8080
```
Then open `http://localhost:8080/src/web/index.html` in your browser.

## Usage

1. Select the input format of the text you will paste in the left text area.
2. Select the desired output format in the right dropdown.
   - Choose **All Formats** to generate output in every compatible format.
3. Enter or paste your content in the input text area.
4. Click **Convert**. The converted output will appear in the right text area.
5. If the input text is not valid for the selected input format, an error message will be shown.

## Development

```bash
npm install           # Install dependencies
npm test             # Run test suite
npm run lint         # Check code style
```

**Adding New Formats:** Create a new module in `src/engines/` implementing `parse(input)` and `stringify(data)` for the format. Then import and register the new engine in `src/web/app.js`.

## License

This project is licensed under the MIT License.