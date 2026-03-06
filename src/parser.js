import { readFileSync } from 'node:fs';

/**
 * Parse a .env file into a Map of key → value entries.
 * Handles:
 *  - Comments (lines starting with #)
 *  - Blank lines
 *  - Quoted values (single and double quotes)
 *  - Values containing = signs
 *  - Keys with empty values (KEY= or KEY)
 *  - CRLF line endings
 *
 * @param {string} filePath - Absolute or relative path to the .env file
 * @returns {{ keys: Map<string, string>, order: string[] }}
 */
export function parseEnvFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  return parseEnvContent(content);
}

/**
 * Parse raw .env content string into a Map of key → value entries.
 *
 * @param {string} content - Raw file content
 * @returns {{ keys: Map<string, string>, order: string[] }}
 */
export function parseEnvContent(content) {
  const keys = new Map();
  const order = [];

  // Normalize line endings (CRLF → LF)
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Skip empty lines and comments
    if (line === '' || line.startsWith('#')) {
      continue;
    }

    // Find the first = sign
    const eqIndex = line.indexOf('=');

    let key;
    let value;

    if (eqIndex === -1) {
      // No = sign: treat the whole line as a key with empty value
      key = line.trim();
      value = '';
    } else {
      key = line.slice(0, eqIndex).trim();
      value = line.slice(eqIndex + 1).trim();
    }

    // Skip lines where the key is empty
    if (key === '') {
      continue;
    }

    // Strip surrounding quotes from value
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    keys.set(key, value);
    order.push(key);
  }

  return { keys, order };
}
