/**
 * Compare two parsed env key maps and classify every variable.
 *
 * @param {Map<string, string>} envKeys      - Keys from the actual .env file
 * @param {Map<string, string>} exampleKeys  - Keys from the reference file
 * @returns {{
 *   present: string[],
 *   missing: string[],
 *   extra:   string[],
 *   empty:   string[],
 *   passed:  boolean
 * }}
 */
export function compareEnvs(envKeys, exampleKeys) {
    const present = [];
    const missing = [];
    const extra = [];
    const empty = [];

    // Walk through the reference keys in insertion order
    for (const key of exampleKeys.keys()) {
        if (!envKeys.has(key)) {
            missing.push(key);
        } else {
            const value = envKeys.get(key);
            if (value === '') {
                empty.push(key);
            } else {
                present.push(key);
            }
        }
    }

    // Find extra keys (in .env but not in example)
    for (const key of envKeys.keys()) {
        if (!exampleKeys.has(key)) {
            extra.push(key);
        }
    }

    return {
        present,
        missing,
        extra,
        empty,
        passed: missing.length === 0,
    };
}
