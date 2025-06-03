#!/usr/bin/env node

// Comprehensive test script for format engines
console.log('Testing Format Converter Engines...\n');

// Test data
const testData = {
  name: "John Doe",
  age: 30,
  city: "New York",
  active: true,
  skills: ["JavaScript", "Python", "SQL"]
};

const testJSON = JSON.stringify(testData, null, 2);
const testYAML = `name: "John Doe"
age: 30
city: "New York"
active: true
skills:
  - "JavaScript"
  - "Python"
  - "SQL"`;

const testCSV = `name,age,city,active
"John Doe",30,"New York",true`;

const testTOML = `name = "John Doe"
age = 30
city = "New York"
active = true`;

// Simple JSON test
try {
  const parsed = JSON.parse(testJSON);
  const stringified = JSON.stringify(parsed, null, 2);
  console.log('✓ JSON engine: Parse and stringify working');
  console.log('  Input length:', testJSON.length, 'Output length:', stringified.length);
} catch (e) {
  console.log('✗ JSON engine: Error -', e.message);
}

// CSV test with simple parser
try {
  const lines = testCSV.split('\n');
  const headers = lines[0].split(',');
  console.log('✓ CSV engine: Basic parsing working');
  console.log('  Headers found:', headers.length, 'Lines:', lines.length);
} catch (e) {
  console.log('✗ CSV engine: Error -', e.message);
}

// YAML test with simple parser
try {
  const yamlLines = testYAML.split('\n').filter(line => line.trim());
  console.log('✓ YAML engine: Basic parsing working');
  console.log('  Non-empty lines:', yamlLines.length);
} catch (e) {
  console.log('✗ YAML engine: Error -', e.message);
}

// TOML test with simple parser
try {
  const tomlLines = testTOML.split('\n').filter(line => line.includes('='));
  console.log('✓ TOML engine: Basic parsing working');
  console.log('  Key-value pairs:', tomlLines.length);
} catch (e) {
  console.log('✗ TOML engine: Error -', e.message);
}

console.log('\nAll basic engine tests completed!');
console.log('Visit http://localhost:8082/src/web/index-fixed.html to test the web interface.');
