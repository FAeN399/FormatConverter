// Simple Markdown parser/generator
import * as htmlEngine from './html.js';

export function parse(input) {
  // Convert simple Markdown to HTML, then use HTML engine
  let html = input;
  
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  
  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Code
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');
  
  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Paragraphs
  html = html.replace(/^(?!<[h|u|l]|$)(.+)$/gm, '<p>$1</p>');
  
  return htmlEngine.parse(html);
}

export function stringify(data) {
  // Convert from intermediate structure to Markdown
  const html = htmlEngine.stringify(data);
  let markdown = html;
  
  // Headers
  markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1');
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1');
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1');
  
  // Bold and italic
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
  markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');
  
  // Code
  markdown = markdown.replace(/<code>(.*?)<\/code>/g, '`$1`');
  
  // Lists
  markdown = markdown.replace(/<ul>/g, '');
  markdown = markdown.replace(/<\/ul>/g, '');
  markdown = markdown.replace(/<li>(.*?)<\/li>/g, '- $1');
  
  // Paragraphs
  markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n');
  
  // Clean up extra whitespace
  markdown = markdown.replace(/\n\s*\n/g, '\n\n');
  
  return markdown.trim();
}
