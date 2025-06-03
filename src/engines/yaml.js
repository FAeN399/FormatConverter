import yaml from 'js-yaml';

export function parse(input) {
  return yaml.load(input);
}

export function stringify(data) {
  return yaml.dump(data);
}
