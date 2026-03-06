import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Reference file names to search for, in priority order.
 */
const REFERENCE_FILES = [
    '.env.example',
    '.env.sample',
    '.env.template',
];

/**
 * Find the primary .env file and the reference (example) file.
 *
 * @param {object} options
 * @param {string} [options.envPath]     - Explicit path to .env file
 * @param {string} [options.examplePath] - Explicit path to reference file
 * @param {string} [options.cwd]         - Working directory (defaults to process.cwd())
 * @returns {{ envPath: string, examplePath: string }}
 * @throws {Error} If required files are not found
 */
export function findEnvFiles({ envPath, examplePath, cwd } = {}) {
    const dir = cwd || process.cwd();

    // Resolve .env path
    const resolvedEnv = envPath
        ? resolve(dir, envPath)
        : resolve(dir, '.env');

    if (!existsSync(resolvedEnv)) {
        const msg = envPath
            ? `Could not find the specified .env file: ${resolvedEnv}`
            : `Could not find .env in ${dir}\n  Create a .env file or specify one with --file <path>`;
        throw new Error(msg);
    }

    // Resolve reference file path
    let resolvedExample;

    if (examplePath) {
        resolvedExample = resolve(dir, examplePath);
        if (!existsSync(resolvedExample)) {
            throw new Error(`Could not find the specified example file: ${resolvedExample}`);
        }
    } else {
        // Auto-detect: try each candidate in priority order
        for (const name of REFERENCE_FILES) {
            const candidate = resolve(dir, name);
            if (existsSync(candidate)) {
                resolvedExample = candidate;
                break;
            }
        }

        if (!resolvedExample) {
            throw new Error(
                `Could not find a reference file in ${dir}\n` +
                `  Expected one of: ${REFERENCE_FILES.join(', ')}\n` +
                `  Create a .env.example file or specify one with --example <path>`
            );
        }
    }

    return {
        envPath: resolvedEnv,
        examplePath: resolvedExample,
    };
}
