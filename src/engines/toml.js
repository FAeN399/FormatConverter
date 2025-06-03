// Simple TOML parser/stringifier for basic data types
export function parse(input) {
  const result = {};
  const lines = input.trim().split('\n');
  let currentSection = result;
  let currentSectionName = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    // Handle sections [section]
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      currentSectionName = trimmed.slice(1, -1);
      currentSection = result[currentSectionName] = {};
      continue;
    }
    
    // Handle key = value pairs
    const equalIndex = trimmed.indexOf('=');
    if (equalIndex === -1) continue;
    
    const key = trimmed.slice(0, equalIndex).trim();
    let value = trimmed.slice(equalIndex + 1).trim();
    
    // Parse value types
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1); // String
    } else if (value.startsWith('[') && value.endsWith(']')) {
      // Array
      const arrayContent = value.slice(1, -1);
      value = arrayContent.split(',').map(item => {
        const trimmedItem = item.trim();
        if (trimmedItem.startsWith('"') && trimmedItem.endsWith('"')) {
          return trimmedItem.slice(1, -1);
        }
        return isNaN(Number(trimmedItem)) ? trimmedItem : Number(trimmedItem);
      });
    } else if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    } else if (!isNaN(Number(value))) {
      value = Number(value);
    }
    
    currentSection[key] = value;
  }
  
  return result;
}

export function stringify(data) {
  const lines = [];
  
  // First, add top-level key-value pairs
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      continue; // Skip objects for now, handle them as sections
    }
    lines.push(`${key} = ${formatValue(value)}`);
  }
  
  // Then add sections
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      if (lines.length > 0) lines.push(''); // Add blank line before section
      lines.push(`[${key}]`);
      for (const [subKey, subValue] of Object.entries(value)) {
        lines.push(`${subKey} = ${formatValue(subValue)}`);
      }
    }
  }
  
  return lines.join('\n');
}

function formatValue(value) {
  if (typeof value === 'string') {
    return `"${value}"`;
  } else if (Array.isArray(value)) {
    return `[${value.map(formatValue).join(', ')}]`;
  } else {
    return String(value);
  }
}
