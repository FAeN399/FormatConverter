// Simple YAML parser/stringifier for basic data types
export function parse(input) {
  const result = {};
  const lines = input.trim().split('\n');
  let currentLevel = 0;
  let stack = [result];
  
  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    
    const indent = line.length - line.trimLeft().length;
    const trimmed = line.trim();
    
    // Handle arrays
    if (trimmed.startsWith('- ')) {
      const value = trimmed.slice(2);
      const parent = stack[stack.length - 1];
      if (!Array.isArray(parent.currentArray)) {
        parent.currentArray = [];
        // Find the current key and make it an array
        const keys = Object.keys(parent);
        const lastKey = keys[keys.length - 1];
        if (lastKey && lastKey !== 'currentArray') {
          parent[lastKey] = parent.currentArray;
        }
      }
      parent.currentArray.push(parseValue(value));
      continue;
    }
    
    // Handle key: value pairs
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = trimmed.slice(0, colonIndex).trim();
    const value = trimmed.slice(colonIndex + 1).trim();
    
    // Adjust stack based on indentation
    while (stack.length > 1 && indent <= currentLevel) {
      stack.pop();
      currentLevel -= 2;
    }
    
    const current = stack[stack.length - 1];
    
    if (value === '') {
      // Object start
      current[key] = {};
      stack.push(current[key]);
      currentLevel = indent;
    } else {
      current[key] = parseValue(value);
    }
  }
  
  return result;
}

export function stringify(data, indent = 0) {
  const lines = [];
  const spaces = ' '.repeat(indent);
  
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      lines.push(`${spaces}${key}:`);
      for (const item of value) {
        if (typeof item === 'object' && !Array.isArray(item)) {
          lines.push(`${spaces}- `);
          const itemLines = stringify(item, indent + 2).split('\n');
          lines.push(...itemLines.map(line => `${spaces}  ${line}`));
        } else {
          lines.push(`${spaces}- ${formatValue(item)}`);
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      lines.push(`${spaces}${key}:`);
      lines.push(stringify(value, indent + 2));
    } else {
      lines.push(`${spaces}${key}: ${formatValue(value)}`);
    }
  }
  
  return lines.join('\n');
}

function parseValue(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (!isNaN(Number(value)) && value !== '') return Number(value);
  if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1);
  return value;
}

function formatValue(value) {
  if (typeof value === 'string') {
    return value.includes(' ') || value.includes(':') ? `"${value}"` : value;
  }
  return String(value);
}
