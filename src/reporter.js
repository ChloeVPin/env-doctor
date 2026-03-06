import chalk from 'chalk';

/**
 * Print a colorized, human-friendly report to stdout.
 *
 * @param {object} result         - Output from compareEnvs()
 * @param {object} options
 * @param {boolean} [options.ci]     - Plain text, no colors
 * @param {boolean} [options.quiet]  - Only show errors/warnings
 * @param {boolean} [options.json]   - Output JSON instead
 * @param {boolean} [options.strict] - Treat empty vars as errors
 */
export function printReport(result, options = {}) {
    const { present, missing, extra, empty, passed } = result;

    // JSON output
    if (options.json) {
        const output = {
            present,
            missing,
            extra,
            empty,
            passed: options.strict ? passed && empty.length === 0 : passed,
        };
        console.log(JSON.stringify(output, null, 2));
        return;
    }

    const c = options.ci ? noColor : chalk;

    // Header
    console.log('');
    console.log(c.bold('  🩺 env-doctor'));
    console.log(c.dim('  ─────────────────────────────────'));
    console.log('');

    // Present variables
    if (!options.quiet) {
        for (const key of present) {
            console.log(`  ${c.green('✅')} ${c.white(key)}  ${c.dim('— present')}`);
        }
    }

    // Missing variables
    for (const key of missing) {
        console.log(`  ${c.red('❌')} ${c.white(key)}  ${c.red('— MISSING')} ${c.dim('(in example but not in .env)')}`);
    }

    // Extra variables
    for (const key of extra) {
        console.log(`  ${c.yellow('⚠️')}  ${c.white(key)}  ${c.yellow('— EXTRA')} ${c.dim('(in .env but not in example)')}`);
    }

    // Empty variables
    for (const key of empty) {
        const label = options.strict ? c.red('— EMPTY (strict mode: treated as error)') : c.yellow('— EMPTY (present but has no value)');
        const icon = options.strict ? c.red('❌') : c.yellow('⚠️');
        console.log(`  ${icon}  ${c.white(key)}  ${label}`);
    }

    // Summary
    console.log('');
    console.log(c.dim('  ─────────────────────────────────'));
    console.log(c.bold('  Summary:'));

    if (present.length > 0) {
        console.log(`  ${c.green('✅')} ${present.length} variable${present.length === 1 ? '' : 's'} present`);
    }
    if (missing.length > 0) {
        console.log(`  ${c.red('❌')} ${missing.length} variable${missing.length === 1 ? '' : 's'} missing`);
    }
    if (extra.length > 0) {
        console.log(`  ${c.yellow('⚠️')}  ${extra.length} extra variable${extra.length === 1 ? '' : 's'} (may be safe to remove)`);
    }
    if (empty.length > 0) {
        const emptyLabel = options.strict ? 'empty (treated as error)' : 'empty (present but has no value)';
        const emptyIcon = options.strict ? c.red('❌') : c.yellow('⚠️');
        console.log(`  ${emptyIcon}  ${empty.length} ${emptyLabel}`);
    }

    if (missing.length === 0 && extra.length === 0 && empty.length === 0) {
        console.log(`  ${c.green('✅')} All variables match — your .env is healthy!`);
    }

    console.log('');
}

/**
 * No-color passthrough for CI mode — wraps strings without ANSI codes.
 */
const noColor = new Proxy({}, {
    get() {
        return (str) => str;
    },
});
