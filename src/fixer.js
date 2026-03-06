import { appendFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

/**
 * Interactive fix mode — prompts the user for each missing key
 * and appends them to the .env file.
 *
 * SECURITY: Never reads or displays existing values from .env.
 * Only writes new keys that were missing.
 *
 * @param {string[]} missingKeys  - Array of missing key names
 * @param {string}   envPath      - Path to the .env file to append to
 */
export async function fixMissing(missingKeys, envPath) {
    if (missingKeys.length === 0) {
        console.log('\n  ✅ Nothing to fix — all variables are present!\n');
        return;
    }

    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const ask = (question) =>
        new Promise((resolve) => {
            rl.question(question, (answer) => resolve(answer));
        });

    console.log('');
    console.log('  🩺 env-clinic --fix');
    console.log('  Fill in missing variables (press Enter to leave blank):');
    console.log('');

    const date = new Date().toISOString().slice(0, 10);
    const entries = [];

    for (const key of missingKeys) {
        const value = await ask(`  ❌ ${key} = `);
        entries.push(`${key}=${value}`);
    }

    rl.close();

    // Append to .env with a comment header
    const block = `\n# Added by env-clinic on ${date}\n${entries.join('\n')}\n`;
    appendFileSync(envPath, block, 'utf-8');

    console.log('');
    console.log(`  ✅ ${entries.length} variable${entries.length === 1 ? '' : 's'} appended to ${envPath}`);
    console.log('');
}
