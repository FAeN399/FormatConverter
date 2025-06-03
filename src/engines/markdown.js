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
