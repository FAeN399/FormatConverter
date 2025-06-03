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
