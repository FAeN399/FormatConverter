export function parse(input) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');
  // Recursive function to convert DOM Node to JS object
  function nodeToObj(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return { text: node.textContent };
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }
    const obj = { tag: node.tagName.toLowerCase() };
    if (node.attributes && node.attributes.length > 0) {
      obj.attrs = {};
      for (let attr of node.attributes) {
        obj.attrs[attr.name] = attr.value;
      }
    }
    const children = [];
    node.childNodes.forEach(child => {
      const childObj = nodeToObj(child);
      if (childObj) children.push(childObj);
    });
    if (children.length > 0) {
      obj.children = children;
    }
    return obj;
  }
  // Convert body children to object structure
  const bodyChildren = [];
  doc.body.childNodes.forEach(child => {
    const childObj = nodeToObj(child);
    if (childObj) bodyChildren.push(childObj);
  });
  return bodyChildren.length === 1 ? bodyChildren[0] : bodyChildren;
}

export function stringify(data) {
  // Recursive function to convert object to HTML string
  function objToHtml(node) {
    if (node === null || node === undefined) {
      return "";
    }
    if (Array.isArray(node)) {
      return node.map(objToHtml).join("");
    }
    if (node.text !== undefined) {
      // Escape special characters in text
      return node.text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
    if (!node.tag) {
      throw new Error("Invalid DOM node object");
    }
    const tag = node.tag;
    const attrs = node.attrs || {};
    const attrString = Object.entries(attrs).map(([key, value]) => {
      if (value === false) return "";
      if (value === true) return ` ${key}`;
      return ` ${key}="${value}"`;
    }).join("");
    const childrenHtml = node.children ? node.children.map(objToHtml).join("") : "";
    return `<${tag}${attrString}>${childrenHtml}</${tag}>`;
  }
  return objToHtml(data);
}
