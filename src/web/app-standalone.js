// All engines in one file to avoid module import issues
const engines = {};

// JSON Engine
engines.JSON = {
  parse: function(input) {
    return JSON.parse(input);
  },
  stringify: function(data, options = {}) {
    const indent = options.indent !== undefined ? options.indent : 2;
    return JSON.stringify(data, null, indent);
  }
};

// CSV Engine
engines.CSV = {
  parse: function(input) {
    const lines = input.trim().split('\n');
    if (lines.length === 0) return [];
    
    const headers = this.parseLine(lines[0]);
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseLine(lines[i]);
      const row = {};
      headers.forEach((header, index) => {
        row[header] = this.inferType(values[index] || '');
      });
      result.push(row);
    }
    
    return result;
  },
  
  parseLine: function(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  },
  
  inferType: function(value) {
    if (value === '') return '';
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (/^\d+$/.test(value)) return parseInt(value);
    if (/^\d*\.\d+$/.test(value)) return parseFloat(value);
    return value;
  },
  
  stringify: function(data) {
    if (!Array.isArray(data) || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    let result = headers.join(',') + '\n';
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return String(value);
      });
      result += values.join(',') + '\n';
    });
    
    return result;
  }
};

// YAML Engine
engines.YAML = {
  parse: function(input) {
    const lines = input.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
    const result = {};
    let currentObj = result;
    let indent = 0;
    
    lines.forEach(line => {
      const lineIndent = line.length - line.trimStart().length;
      const trimmed = line.trim();
      
      if (trimmed.includes(':')) {
        const [key, ...valueParts] = trimmed.split(':');
        const value = valueParts.join(':').trim();
        
        if (value) {
          currentObj[key.trim()] = this.parseValue(value);
        } else {
          currentObj[key.trim()] = {};
        }
      }
    });
    
    return result;
  },
  
  parseValue: function(value) {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (/^\d+$/.test(value)) return parseInt(value);
    if (/^\d*\.\d+$/.test(value)) return parseFloat(value);
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }
    return value;
  },
  
  stringify: function(data, indent = 0) {
    let result = '';
    const prefix = '  '.repeat(indent);
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result += `${prefix}${key}:\n`;
        result += this.stringify(value, indent + 1);
      } else {
        const valueStr = typeof value === 'string' ? `"${value}"` : String(value);
        result += `${prefix}${key}: ${valueStr}\n`;
      }
    }
    
    return result;
  }
};

// TOML Engine
engines.TOML = {
  parse: function(input) {
    const lines = input.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
    const result = {};
    let currentSection = result;
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        const sectionName = trimmed.slice(1, -1);
        result[sectionName] = {};
        currentSection = result[sectionName];
      } else if (trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').trim();
        currentSection[key.trim()] = this.parseValue(value);
      }
    });
    
    return result;
  },
  
  parseValue: function(value) {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (/^\d+$/.test(value)) return parseInt(value);
    if (/^\d*\.\d+$/.test(value)) return parseFloat(value);
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }
    return value;
  },
  
  stringify: function(data) {
    let result = '';
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result += `[${key}]\n`;
        for (const [subKey, subValue] of Object.entries(value)) {
          const valueStr = typeof subValue === 'string' ? `"${subValue}"` : String(subValue);
          result += `${subKey} = ${valueStr}\n`;
        }
        result += '\n';
      } else {
        const valueStr = typeof value === 'string' ? `"${value}"` : String(value);
        result += `${key} = ${valueStr}\n`;
      }
    }
    
    return result;
  }
};

// HTML Engine
engines.HTML = {
  parse: function(input) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/html');
    return this.domToObject(doc.body || doc.documentElement);
  },
  
  domToObject: function(element) {
    const obj = {
      tag: element.tagName ? element.tagName.toLowerCase() : 'text',
      attributes: {},
      children: []
    };
    
    if (element.attributes) {
      for (const attr of element.attributes) {
        obj.attributes[attr.name] = attr.value;
      }
    }
    
    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent.trim();
        if (text) {
          obj.children.push({ tag: 'text', content: text });
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        obj.children.push(this.domToObject(child));
      }
    }
    
    return obj;
  },
  
  stringify: function(data) {
    return this.objectToHtml(data);
  },
  
  objectToHtml: function(obj) {
    if (obj.tag === 'text') {
      return obj.content || '';
    }
    
    let html = `<${obj.tag}`;
    
    if (obj.attributes) {
      for (const [name, value] of Object.entries(obj.attributes)) {
        html += ` ${name}="${value}"`;
      }
    }
    
    html += '>';
    
    if (obj.children) {
      for (const child of obj.children) {
        html += this.objectToHtml(child);
      }
    }
    
    html += `</${obj.tag}>`;
    return html;
  }
};

// Markdown Engine
engines.Markdown = {
  parse: function(input) {
    // Convert markdown to HTML first, then parse as HTML
    const html = this.markdownToHtml(input);
    return engines.HTML.parse(html);
  },
  
  markdownToHtml: function(markdown) {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    
    // Bold and italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
    
    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = `<p>${html}</p>`;
    
    return `<html><body>${html}</body></html>`;
  },
  
  stringify: function(data) {
    return this.htmlToMarkdown(engines.HTML.stringify(data));
  },
  
  htmlToMarkdown: function(html) {
    let markdown = html;
    
    // Headers
    markdown = markdown.replace(/<h1>(.+?)<\/h1>/g, '# $1\n');
    markdown = markdown.replace(/<h2>(.+?)<\/h2>/g, '## $1\n');
    markdown = markdown.replace(/<h3>(.+?)<\/h3>/g, '### $1\n');
    
    // Bold and italic
    markdown = markdown.replace(/<strong>(.+?)<\/strong>/g, '**$1**');
    markdown = markdown.replace(/<em>(.+?)<\/em>/g, '*$1*');
    
    // Links
    markdown = markdown.replace(/<a href="(.+?)">(.+?)<\/a>/g, '[$2]($1)');
    
    // Remove HTML tags
    markdown = markdown.replace(/<[^>]+>/g, '');
    
    return markdown.trim();
  }
};

// AML (XML) Engine
engines.AML = {
  parse: function(input) {
    // Use HTML parser for XML-like content
    return engines.HTML.parse(input);
  },
  
  stringify: function(data) {
    return engines.HTML.stringify(data);
  }
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
inputSelect.value = "JSON";
outputSelect.value = "YAML";

const inputTextArea = document.getElementById('inputText');
const outputTextArea = document.getElementById('outputText');
const convertBtn = document.getElementById('convertBtn');

// Load example data
inputTextArea.value = '{"name": "John Doe", "age": 30, "city": "New York", "active": true}';

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
        try {
          const result = engines[fmt].stringify(intermediate);
          outputs.push(`=== ${fmt} ===\n${result}`);
        } catch (e) {
          outputs.push(`=== ${fmt} ===\nError: ${e.message}`);
        }
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
