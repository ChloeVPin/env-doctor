import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { compareEnvs } from '../src/compare.js';

describe('compareEnvs', () => {
    test('identifies all present variables when keys match', () => {
        const env = new Map([['A', '1'], ['B', '2']]);
        const example = new Map([['A', 'x'], ['B', 'y']]);

        const result = compareEnvs(env, example);

        assert.deepEqual(result.present, ['A', 'B']);
        assert.deepEqual(result.missing, []);
        assert.deepEqual(result.extra, []);
        assert.deepEqual(result.empty, []);
        assert.equal(result.passed, true);
    });

    test('identifies missing variables', () => {
        const env = new Map([['A', '1']]);
        const example = new Map([['A', 'x'], ['B', 'y'], ['C', 'z']]);

        const result = compareEnvs(env, example);

        assert.deepEqual(result.present, ['A']);
        assert.deepEqual(result.missing, ['B', 'C']);
        assert.equal(result.passed, false);
    });

    test('identifies extra variables', () => {
        const env = new Map([['A', '1'], ['B', '2'], ['EXTRA', 'val']]);
        const example = new Map([['A', 'x'], ['B', 'y']]);

        const result = compareEnvs(env, example);

        assert.deepEqual(result.present, ['A', 'B']);
        assert.deepEqual(result.extra, ['EXTRA']);
        assert.equal(result.passed, true);
    });

    test('identifies empty variables', () => {
        const env = new Map([['A', '1'], ['B', '']]);
        const example = new Map([['A', 'x'], ['B', 'y']]);

        const result = compareEnvs(env, example);

        assert.deepEqual(result.present, ['A']);
        assert.deepEqual(result.empty, ['B']);
        assert.equal(result.passed, true);
    });

    test('handles all categories simultaneously', () => {
        const env = new Map([
            ['PRESENT', 'value'],
            ['EMPTY', ''],
            ['EXTRA', 'extra_val'],
        ]);
        const example = new Map([
            ['PRESENT', 'x'],
            ['EMPTY', 'y'],
            ['MISSING', 'z'],
        ]);

        const result = compareEnvs(env, example);

        assert.deepEqual(result.present, ['PRESENT']);
        assert.deepEqual(result.missing, ['MISSING']);
        assert.deepEqual(result.extra, ['EXTRA']);
        assert.deepEqual(result.empty, ['EMPTY']);
        assert.equal(result.passed, false);
    });

    test('handles empty maps', () => {
        const env = new Map();
        const example = new Map();

        const result = compareEnvs(env, example);

        assert.deepEqual(result.present, []);
        assert.deepEqual(result.missing, []);
        assert.deepEqual(result.extra, []);
        assert.deepEqual(result.empty, []);
        assert.equal(result.passed, true);
    });

    test('all env keys are extra when example is empty', () => {
        const env = new Map([['A', '1'], ['B', '2']]);
        const example = new Map();

        const result = compareEnvs(env, example);

        assert.deepEqual(result.extra, ['A', 'B']);
        assert.deepEqual(result.missing, []);
        assert.equal(result.passed, true);
    });

    test('all example keys are missing when env is empty', () => {
        const env = new Map();
        const example = new Map([['A', '1'], ['B', '2']]);

        const result = compareEnvs(env, example);

        assert.deepEqual(result.missing, ['A', 'B']);
        assert.deepEqual(result.present, []);
        assert.equal(result.passed, false);
    });
});
