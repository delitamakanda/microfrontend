# Microfrontend Commerce Platform

This repository demonstrates a multi-frontend commerce experience composed of three independently deployed applications that cooperate through Module Federation. Each application can be developed and deployed on its own cadence while still sharing UI widgets, authentication, and routing contracts.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
  - [Storefront (Vite)](#storefront-vite)
  - [Admin Panel (Vite)](#admin-panel-vite)
  - [Blog (Webpack)](#blog-webpack)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Module Federation Layout](#module-federation-layout)
- [Shared Utilities](#shared-utilities)
- [Development Tips](#development-tips)
- [Deployment Notes](#deployment-notes)
- [Demo Links](#demo-links)
- [License](#license)

## Architecture Overview

| Microfrontend | Tooling | Purpose | Port (Dev) |
| ------------- | ------- | ------- | ---------- |
| `storefront/` | Vite + React | Customer-facing shopping experience exposing shared UI and hooks. | `3000` |
| `adminpanel/` | Vite + React | Back office dashboard that consumes storefront remotes and provides analytics tooling. | `5001` |
| `blog/` | Webpack + React | Marketing blog rendered as a standalone bundle that can be embedded or linked from the storefront. | `8080` |

The two Vite applications are federated using [`@originjs/vite-plugin-federation`](https://github.com/originjs/vite-plugin-federation). The blog keeps a traditional Webpack configuration to showcase interop with a legacy build pipeline.

## Getting Started

### Prerequisites
- Node.js 20+
- [pnpm](https://pnpm.io/) 8+

Clone the repository and install the dependencies for each application individually (no workspace is defined):

```bash
pnpm install --dir storefront
pnpm install --dir adminpanel
pnpm install --dir blog
```

### Storefront (Vite)
```bash
cd storefront
pnpm dev        # start the local dev server on http://localhost:3000
pnpm build      # produce a production bundle in dist/
```

Environment variables can be configured by copying `.env.example` to `.env` and adjusting the API host for product and auth data.

### Admin Panel (Vite)
```bash
cd adminpanel
pnpm dev        # start the admin dev server on http://localhost:5001
pnpm build      # build the microfrontend that consumes storefront remotes
```

Ensure that the storefront dev server is running when testing remote components locally, or point `vite.config.js` to the deployed storefront remote entry.

### Blog (Webpack)
```bash
cd blog
pnpm dev        # run webpack-dev-server on http://localhost:8080
pnpm build      # emit the production assets to dist/
```

The blog relies on classic Webpack loaders and can be deployed independently to any static host.

## Available Scripts

Each microfrontend exposes a consistent set of package scripts:

| Script | Description |
| ------ | ----------- |
| `pnpm dev` | Boot the development server with hot module reloading. |
| `pnpm build` | Produce an optimized production bundle. |
| `pnpm preview` | (Vite apps) Serve the built assets locally for smoke-testing. |
| `pnpm lint` | Run ESLint with project-specific rules. |
| `pnpm test` | Execute Node.js tests covering hooks, atoms, and utility helpers. |

Run the command from the respective application directory.

## Testing

Unit tests are written with the native [`node:test`](https://nodejs.org/api/test.html) runner. Examples include:
- `storefront/src/__tests__/store.test.js` validating Jotai cart state transitions.
- `adminpanel/src/helpers/__tests__/utils.test.js` ensuring currency/amount formatting edge cases are handled.

Execute the suites from the application folder:

```bash
cd storefront && pnpm test
cd adminpanel && pnpm test
```

## Module Federation Layout

- **Exposed modules:** The storefront shares UI primitives and hooks via `storefrontApp/*` remotes defined in `storefront/vite.config.js`.
- **Remote consumption:** The admin panel declares the storefront as a remote in `adminpanel/vite.config.js` and lazy-loads shared widgets where needed.
- **Shared libraries:** React, React DOM, and PrimeReact are configured as shared dependencies to avoid bundling duplicates across the Vite microfrontends.

When adjusting remote URLs for staging or production, update the `remotes` map in each Vite config or rely on environment variables with `define` replacements.

## Shared Utilities

Common cross-cutting concerns include:
- **Authentication context** – Provided by the storefront and consumed by admin to keep session handling consistent.
- **Axios instance** – Centralized interceptors manage token refresh and header decoration.
- **Formatting helpers** – Located in `adminpanel/src/helpers/` with tests documenting expected behavior for monetary amounts.

Consider extracting these into a shared package (via PNPM workspace) if the codebase grows.

## Development Tips

1. Start the storefront first so the admin remote loads without 404s.
2. Keep an eye on `vite.config.js` flags such as `modulePreload` and `minify` when optimizing bundle size for production.
3. Use the provided ESLint scripts before committing to enforce consistent React best practices.
4. Run `pnpm build` periodically in each app to ensure Module Federation manifests remain compatible.

## Deployment Notes

- Output directories (`dist/`) can be deployed to any static CDN. Configure cache headers aggressively for files that include content hashes.
- For Netlify/Static hosting, ensure redirects are configured for client-side routing (`/* -> /index.html` for the Vite apps).
- Align environment variable usage (`VITE_API_URL`, etc.) across microfrontends so they resolve against the same backend services.

## Demo Links

1. **Blog** – <https://mellifluous-cocada-015edf.netlify.app/>
2. **Admin panel** – <https://astonishing-dieffenbachia-7f20d2.netlify.app/>
3. **Storefront (WIP)** – <https://resplendent-strudel-83725d.netlify.app/>

## License

This project is provided for educational purposes. Adapt and extend it to fit your own microfrontend architecture needs.
