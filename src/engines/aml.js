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
