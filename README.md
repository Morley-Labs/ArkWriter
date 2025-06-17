[![ArkWriter Logo](https://raw.githubusercontent.com/Morley-Labs/Documentation/refs/heads/main/docs/branding/arkwriter_logo_multi-use.png)](https://app.morleylang.org)

# ArkWriter

A web based ladder logic IDE written in React and TypeScript. The application allows users to design and manage PLC projects that can be compiled to Plutus Smart Contracts.

## Features

- Ladder logic editor with drag and drop components
- Project settings, variable manager and I/O configuration dialogs
- Wallet integration via `lucid-cardano`
- Compile ladder logic to Plutus scripts using Pyodide

## Requirements

- Node.js `>=18`
- npm

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open <http://localhost:5173> in your browser.

To create a production build:

```bash
npm run build
npm run preview
```

Lint the codebase with:

```bash
npm run lint
```

Run the test suite with:

```bash
npm test
```

## Project structure

- `src/` – React components, hooks and services
- `services/` – utilities for compiling, project management and wallet access
- `hooks/` – reusable hooks for editor state

## License

This project is licensed under the [Apache-2.0](LICENSE) license.

