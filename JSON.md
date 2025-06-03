
1 ▸ package.json (put at repo root)

{
  "name": "format-converter",
  "version": "0.1.0",
  "description": "Web-based any-to-any document/data format converter",
  "license": "MIT",
  "type": "module",
  "scripts": {
    "start": "serve -s src/web -l 8080",
    "test": "mocha tests/**/*.js",
    "lint": "eslint . --ext .js",
    "prepublishOnly": "npm run lint && npm test"
  },
  "dependencies": {
    "js-yaml": "^4.1.0",
    "@iarna/toml": "^3.0.0",
    "marked": "^11.0.0",
    "turndown": "^7.1.2",
    "serve": "^14.2.0"
  },
  "devDependencies": {
    "eslint": "^8.57.0",
    "mocha": "^10.4.0",
    "fast-check": "^3.17.0",
    "jsdom": "^24.0.0"
  },
  "engines": {
    "node": ">=16"
  }
}
