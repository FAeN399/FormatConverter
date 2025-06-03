import { JSDOM } from 'jsdom';
const dom = new JSDOM("<!DOCTYPE html>");
global.DOMParser = dom.window.DOMParser;
global.XMLSerializer = dom.window.XMLSerializer;
global.Node = dom.window.Node;

import { strict as assert } from 'assert';
import * as fc from 'fast-check';
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
