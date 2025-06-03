export function parse(input) {
  const lines = input.trim().split(/\r?\n/);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => line.split(','));
  // Convert rows to objects using headers, with basic type inference
  const result = rows.map(cols => {
    const obj = {};
    headers.forEach((h, i) => {
      let value = cols[i] !== undefined ? cols[i] : "";
      if (value === "true" || value === "false") {
        obj[h] = (value === "true");
      } else if (value !== "" && !isNaN(Number(value))) {
        obj[h] = Number(value);
      } else {
        obj[h] = value;
      }
    });
    return obj;
  });
  return result;
}

export function stringify(data) {
  if (!Array.isArray(data)) {
    throw new Error("CSV stringify expects an array of objects or arrays");
  }
  if (data.length === 0) return "";
  let headers = [];
  let rows = [];
  if (typeof data[0] === 'object' && !Array.isArray(data[0])) {
    // Array of objects
    headers = Object.keys(data[0]);
    rows = data.map(obj => headers.map(h => (obj[h] !== undefined ? obj[h] : "")));
  } else {
    // Array of arrays (or primitives)
    rows = data.map(row => Array.isArray(row) ? row : [row]);
    // Generate default headers for columns
    const colCount = Math.max(...rows.map(r => r.length));
    headers = [...Array(colCount).keys()].map(i => `col${i+1}`);
    rows = rows.map(r => r.concat(Array(headers.length - r.length).fill("")));
  }
  // Build CSV lines
  const csvLines = [];
  csvLines.push(headers.join(','));
  for (const row of rows) {
    const line = row.map(val => {
      let str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        str = '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    }).join(',');
    csvLines.push(line);
  }
  return csvLines.join('\n');
}
