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
// Option to convert to all other formats
const optAll = document.createElement('option');
optAll.value = 'All';
optAll.textContent = 'All Formats';
outputSelect.appendChild(optAll);
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
    // Format categories to restrict cross-type conversions
    const docFormats = ["Markdown", "HTML", "AML"];
    const dataFormats = ["JSON", "YAML", "TOML", "CSV"];

    // Parse input using the selected format engine
    const engineIn = engines[inFormat];
    const intermediate = engineIn.parse(inputText);

    const isCrossType = (target) => (
      (docFormats.includes(inFormat) && dataFormats.includes(target)) ||
      (dataFormats.includes(inFormat) && docFormats.includes(target))
    );

    if (outFormat === 'All') {
      const outputs = [];
      for (const fmt of Object.keys(engines)) {
        if (fmt === inFormat) continue;
        if (isCrossType(fmt)) continue;
        const result = engines[fmt].stringify(intermediate);
        outputs.push(`=== ${fmt} ===\n${result}`);
      }
      outputTextArea.value = outputs.join('\n\n');
    } else {
      if (isCrossType(outFormat)) {
        throw new Error('Conversion between document and data formats is not supported.');
      }
      const engineOut = engines[outFormat];
      const result = engineOut.stringify(intermediate);
      outputTextArea.value = result;
    }
  } catch (err) {
    outputTextArea.value = "Error: " + err.message;
    console.error(err);
  }
});
