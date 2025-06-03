import { parse as parseToml, stringify as stringifyToml } from '@iarna/toml';

export function parse(input) {
  return parseToml(input);
}

export function stringify(data) {
  return stringifyToml(data);
}
