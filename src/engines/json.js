export function parse(input) {
  return JSON.parse(input);
}

export function stringify(data, options = {}) {
  const indent = options.indent !== undefined ? options.indent : 2;
  return JSON.stringify(data, null, indent);
}
