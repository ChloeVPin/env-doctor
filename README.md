<div align="center">
  <img src="./assets/env-doctor.svg" alt="env-doctor logo" width="200" />
  <h1>🩺 env-doctor</h1>
  <p><strong>Catch missing .env variables before your app crashes.</strong></p>

  [![npm version](https://img.shields.io/npm/v/env-doctor.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/env-doctor)
  [![npm downloads](https://img.shields.io/npm/dm/env-doctor.svg?style=flat-square)](https://www.npmjs.com/package/env-doctor)
  [![CI](https://img.shields.io/github/actions/workflow/status/ChloeVPin/env-doctor/ci.yml?branch=main&style=flat-square&label=tests)](https://github.com/ChloeVPin/env-doctor/actions)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

  <br />
</div>

---

## ⚡ The Problem

Every backend project has a `.env` file and a `.env.example` file.  
Every time you pull new code or a teammate adds an integration, you risk a silent crash because a new variable is missing. You end up manually eyeballing the two files to figure out what changed.

`env-doctor` diffs them instantly. One command. Zero config. Unbreakable peace of mind.

---

## 🚀 Quick Start

**No install needed.** Just run it in any project directory:

```bash
npx env-doctor
```

Or install globally:

```bash
npm install -g env-doctor
env-doctor
```

---

## ✨ What It Checks

- ✅ **Present** — variable exists in both `.env` and `.env.example`
- ❌ **Missing** — variable is in `.env.example` but not your `.env` *(exits 1)*
- ⚠️ **Extra** — variable is in your `.env` but not in `.env.example`
- ⚠️ **Empty** — variable exists in `.env` but has no value (`KEY=`)

<br/>

<div align="center">
  <img src="./assets/env-doctor.webp" alt="env-doctor output example" width="600" />
</div>

---

## 🛠️ The Killer Feature: `--fix`

When it finds missing variables, `env-doctor --fix` prompts you to fill them in one by one.

**It only appends.** Your existing `.env` content is never overwritten, reordered, or read. Any new keys are safely added to the bottom of the file with a helpful timestamp comment.

```bash
npx env-doctor --fix
```

```text
  🩺 env-doctor --fix
  Fill in missing variables (press Enter to leave blank):

  ❌ STRIPE_SECRET_KEY = sk_test_...
  ❌ SENDGRID_API_KEY = 

  ✅ 2 variables appended to .env
```

---

## ⚙️ Options

| Flag | Description | Example |
|------|-------------|---------|
| `--fix` | Interactive mode — prompts you to fill in missing variables | `npx env-doctor --fix` |
| `--ci` | Non-interactive CI mode — plain text, no colors | `npx env-doctor --ci` |
| `--strict` | Treats empty variables (`KEY=`) as errors (exits 1) | `npx env-doctor --strict` |
| `--quiet` | Only show errors and warnings, hide successful matches | `npx env-doctor --quiet` |
| `--file` | Use a custom `.env` file path | `npx env-doctor --file .env.production` |
| `--example`| Use a custom reference file path | `npx env-doctor --example .env.sample` |
| `--json` | Output results as JSON | `npx env-doctor --json` |

---

## 🛡️ CI/CD Integration

`env-doctor` is built for pipelines. It exits `0` if everything matches, and exits `1` if variables are missing. Catch bad PRs *before* they are merged.

**GitHub Actions Example:**
Add this to your `.github/workflows/ci.yml` before your tests run:

```yaml
- name: Check .env completeness
  run: npx env-doctor --ci
```

---

## 🔒 Security

**`env-doctor` never reads your secrets.**  
It parses your `.env` file structurally to find keys, but it *never* prints, logs, or transmits the actual values. It's safe to run anywhere. 

---

## 🤝 Contributing & Maintenance

Built for exactly one job, done perfectly. 
- Fast (~100ms execution)
- Safe (does not touch your values)
- Tested (22 unit tests passing)

We love PRs! See our [Contributing Guide](CONTRIBUTING.md) to get started, or check out the [Changelog](CHANGELOG.md).

## 📄 License

[MIT](LICENSE) © env-doctor contributors
