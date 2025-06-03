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
