# Humanizer AI Studio

[![GitHub stars](https://img.shields.io/github/stars/noity0/humanizer-hmhs-?style=flat-square)](https://github.com/noity0/humanizer-hmhs-/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/noity0/humanizer-hmhs-?style=flat-square)](https://github.com/noity0/humanizer-hmhs-/issues)
[![Last commit](https://img.shields.io/github/last-commit/noity0/humanizer-hmhs-?style=flat-square)](https://github.com/noity0/humanizer-hmhs-/commits/main)

> An AI-assisted writing workspace for revising drafts, reviewing writing characteristics, and creating customizable handwritten-note exports.

Humanizer AI Studio is an HMHS project built with React, TypeScript, Vite, and an Express server. It connects to Google's Gemini API through the server-side `@google/genai` SDK.

## Features

- AI-assisted rewriting for clearer, more natural-sounding drafts.
- Writing analysis and feedback workflows.
- Customizable handwritten-note generation.
- Export support using the installed PDF-generation library.
- Responsive React interface with Tailwind CSS and Motion.
- Server-side API integration for Gemini requests.

The application is a writing aid. It does not guarantee that text will bypass AI detectors, plagiarism checks, or any other evaluation system. Review and fact-check generated content before using it.

## Technology

- React 19
- TypeScript 5
- Vite 6
- Node.js and Express
- Google Gemini through `@google/genai`
- Tailwind CSS 4, Motion, and Lucide React
- jsPDF

## Requirements

- Node.js 22 LTS recommended
- npm
- A Google Gemini API key for AI-powered features

Check your installed versions:

```bash
node --version
npm --version
```

## Setup on Windows

Open PowerShell in the folder where you want the project:

```powershell
git clone https://github.com/noity0/humanizer-hmhs-.git
Set-Location humanizer-hmhs-
npm install
```

Create your local environment file:

```powershell
Copy-Item .env.example .env
notepad .env
```

Set your own key in `.env`:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
APP_URL=http://localhost:3000
```

Keep the key private. Do not commit `.env`, paste credentials into issues, or expose them in screenshots.

## Run the application

Start the development server:

```powershell
npm run dev
```

Open the local address printed by the server in your terminal.

Create a production build:

```powershell
npm run build
npm start
```

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Express/TypeScript development server |
| `npm run build` | Build the Vite frontend and bundle the server |
| `npm start` | Start the built server |
| `npm run preview` | Preview the Vite frontend build |
| `npm run lint` | Run TypeScript checks without emitting files |

## Environment configuration

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | API key used by the server for Gemini requests |
| `APP_URL` | Application base URL; use the deployed URL in hosted environments |

Use the supplied `.env.example` as the configuration reference. Actual deployment requirements depend on the hosting environment.

## Project layout

```text
humanizer-hmhs-/
├── src/                 # React application
├── server.ts            # Express server and API entry point
├── index.html           # Vite HTML entry
├── package.json         # Dependencies and scripts
├── bun.lock             # Bun dependency lockfile
├── .env.example         # Environment variable template
└── vite.config.ts       # Vite configuration
```

## Privacy and responsible use

Do not submit confidential, personal, or sensitive text unless you understand the service and data-handling terms of the configured AI provider. Generated text can contain errors or invented details; verify names, facts, citations, and claims.

## Contributing

Bug reports, documentation improvements, and focused pull requests are welcome. Include reproduction steps and note which commands you ran.

- [Issues](https://github.com/noity0/humanizer-hmhs-/issues)
- [Source code](https://github.com/noity0/humanizer-hmhs-)

## License

Check the repository for a `LICENSE` file and follow its terms. If no license is present, reuse and redistribution are not automatically permitted.

## Search terms

AI humanizer, AI writing assistant, text rewriting, writing analysis, Gemini API, React writing app, TypeScript, Vite, Express, PDF export, HMHS.

<!-- COMMUNITY-CONTRIBUTORS-SECTION -->
## Contributors & community

[![Contributors](https://img.shields.io/github/contributors/noity0/humanizer-hmhs-?style=flat-square)](https://github.com/noity0/humanizer-hmhs-/graphs/contributors)
[![Pull requests](https://img.shields.io/github/issues-pr/noity0/humanizer-hmhs-?style=flat-square)](https://github.com/noity0/humanizer-hmhs-/pulls)
[![Good first issues](https://img.shields.io/github/issues/noity0/humanizer-hmhs-/good%20first%20issue?style=flat-square)](https://github.com/noity0/humanizer-hmhs-/labels/good%20first%20issue)

<a href="https://github.com/noity0/humanizer-hmhs-/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=noity0/humanizer-hmhs-" alt="Contributors to humanizer-hmhs-" />
</a>

The contributor graphic and GitHub contributor page reflect **real GitHub contribution activity**. Names, avatars, and contribution counts are not manually invented or assigned. As this project grows, accepted pull requests and other qualifying contributions will appear automatically.

### How to contribute

1. Browse the [open issues](https://github.com/noity0/humanizer-hmhs-/issues) and [existing pull requests](https://github.com/noity0/humanizer-hmhs-/pulls) before starting work.
2. For a major change, open an issue first to discuss the proposed approach.
3. Fork the repository and create a focused feature or fix branch.
4. Keep changes scoped, document user-visible behavior, and add or update tests when applicable.
5. Run the checks documented above and include the results in your pull request.
6. Never include API keys, passwords, personal data, or other secrets in commits or screenshots.

### Open-source ecosystem

This project builds on established open-source tools and developer ecosystems documented in its technology stack. Please visit and support the upstream projects, follow their licenses, and report issues to the correct upstream repository when the problem is not caused by this project.

- [GitHub community and contribution guidelines](https://docs.github.com/en/get-started/quickstart/contributing-to-projects)
- [Open-source licenses explained](https://choosealicense.com/)

**Community note:** No celebrity, company, or upstream maintainer is represented as a project contributor or endorser unless their contribution or endorsement is independently verifiable.
