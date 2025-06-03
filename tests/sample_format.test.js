import { JSDOM } from 'jsdom';
const dom = new JSDOM("<!DOCTYPE html>");
global.DOMParser = dom.window.DOMParser;
global.XMLSerializer = dom.window.XMLSerializer;
global.Node = dom.window.Node;

import { strict as assert } from 'assert';
import * as jsonEngine from '../src/engines/json.js';
import * as yamlEngine from '../src/engines/yaml.js';
import * as markdownEngine from '../src/engines/markdown.js';
import * as htmlEngine from '../src/engines/html.js';
import * as csvEngine from '../src/engines/csv.js';

describe('Sample Format Conversion Tests', function() {
  it('JSON to YAML conversion', () => {
    const jsonInput = '{"name": "Alice", "age": 30, "skills": ["JS", "YAML"]}';
    const data = jsonEngine.parse(jsonInput);
    const yamlOutput = yamlEngine.stringify(data);
    
    assert(yamlOutput.includes('name: Alice'));
    assert(yamlOutput.includes('age: 30'));
    assert(yamlOutput.includes('- JS'));
    assert(yamlOutput.includes('- YAML'));
  });

  it('Markdown to HTML conversion', () => {
    const markdownInput = '# Hello World\n\nThis is **bold** text.';
    const intermediate = markdownEngine.parse(markdownInput);
    const htmlOutput = htmlEngine.stringify(intermediate);
    
    assert(htmlOutput.includes('<h1>'));
    assert(htmlOutput.includes('Hello World'));
    assert(htmlOutput.includes('<strong>bold</strong>'));
  });

  it('CSV parsing and generation', () => {
    const csvInput = 'Name,Age,City\nAlice,30,NYC\nBob,25,LA';
    const data = csvEngine.parse(csvInput);
    
    assert.strictEqual(data.length, 2);
    assert.strictEqual(data[0].Name, 'Alice');
    assert.strictEqual(data[0].Age, 30);
    assert.strictEqual(data[1].Name, 'Bob');
    
    const csvOutput = csvEngine.stringify(data);
    assert(csvOutput.includes('Name,Age,City'));
    assert(csvOutput.includes('Alice,30,NYC'));
  });
});
