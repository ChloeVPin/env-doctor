# env-doctor 🩺

Catch missing `.env` variables before your app crashes.

[![npm version](https://img.shields.io/npm/v/env-doctor.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/env-doctor)
[![tests](https://img.shields.io/github/actions/workflow/status/ChloeVPin/env-doctor/ci.yml?branch=main&style=flat-square&label=tests)](https://github.com/ChloeVPin/env-doctor/actions)

Every backend project has a `.env` file and a `.env.example` file. Every time you pull new code or a teammate adds a new secret, you risk a silent crash because a variable is missing.

`env-doctor` is a zero-config CLI that diffs these files for you instantly.

---

## 🚀 Quick Start

No install needed. Just run it in your project root:

```bash
npx env-doctor
```

It automatically finds your `.env` and looks for an `.env.example` (or `.sample`, `.template`) to compare against.

---

## ✨ How it works

The tool checks your `.env` for completeness:

- ✅ **Present** — variable exists in both files.
- ❌ **Missing** — in example file but not your `.env` (**exits 1**).
- ⚠️ **Extra** — in your `.env` but not in the example.
- ⚠️ **Empty** — key exists but has no value (`KEY=`).

---

## 🛠️ The Fix Mode (`--fix`)

The killer feature is the interactive fix mode. Instead of manual copy-pasting, `env-doctor` can help you fill in the blanks.

```bash
npx env-doctor --fix
```

It will prompt you for each missing variable:

```text
  🩺 env-doctor --fix
  Fill in missing variables (press Enter to leave blank):

  ❌ STRIPE_SECRET_KEY = sk_test_...
  ❌ SENDGRID_API_KEY = 

  ✅ 2 variables appended to .env
```

**Security first:** It only **appends** to the bottom of your `.env`. It never reads, overwrites, or reorders your existing values. 

---

## ⚙️ Options

| Flag | Description |
|------|-------------|
| `--fix` | Interactive mode to fill in missing variables. |
| `--ci` | Plain text output for CI/CD pipelines. |
| `--strict` | Treats empty variables as errors (exits 1). |
| `--quiet` | Only shows errors/warnings. |
| `--file` | Custom `.env` path (e.g., `--file .env.prod`). |
| `--example`| Custom reference path (e.g., `--example .env.sample`). |
| `--json` | Output results as JSON for automation. |

---

## 🛡️ CI/CD

Stop broken deployments. Add this to your CI workflow (e.g., GitHub Actions) to ensure all required secrets are present:

```yaml
- name: Check .env completeness
  run: npx env-doctor --ci
```

`env-doctor` exits with `0` on match and `1` if anything is missing.

---

## 🤝 Contributing

This is a tiny, focused tool built to solve one specific pain point. If you have a bug fix or a small improvement, feel free to open a PR!

- [Contributing Guide](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

[MIT License](LICENSE) © 2026 env-doctor contributors
