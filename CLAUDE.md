# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from the repository root (there is no pnpm workspace: each app has its own `node_modules`).

```bash
bash scripts/agent/install.sh            # both apps: pnpm 8 for storefront (lockfile v6), pnpm 9 for adminpanel (lockfile v9)
bash scripts/agent/test.sh [app]         # node:test in each app (storefront, adminpanel)
bash scripts/agent/build.sh [app]        # production builds into .agent-out/build/<app>/
node scripts/agent/check-changed.mjs --fix   # then --check: ESLint on changed lines + federation contract
bash scripts/agent/start-app.sh          # demo API (merch_store, cloned) on :8000 + storefront on :3000 + admin on :5001
bash scripts/agent/wait-storefront.sh    # after editing storefront/: wait for the remote to be rebuilt
bash scripts/agent/api.sh --as demo-admin GET /api/store/coupon/   # call the local API
```

Per app (`cd storefront` or `cd adminpanel`): `pnpm dev`, `pnpm build`, `pnpm lint`, `node --test`. Use the pnpm version above (`npx -y pnpm@8.15.9` / `npx -y pnpm@9.15.9`); pnpm 9+ refuses the storefront lockfile with `--frozen-lockfile`.

The codebase is **not** lint-clean yet (≈27 ESLint errors in storefront, ≈29 in adminpanel). Do not fix unrelated files: `check-changed.mjs` only fails on errors in lines you added or changed. Its federation-contract check always runs on the whole admin.

## Architecture

Three independently deployed React 18 apps (Netlify). Only the first two are federated; **`blog/` (Webpack 5, Markdown posts, no tests) is out of scope for the agents**.

| App | Tooling | Role | Dev port |
| --- | --- | --- | --- |
| `storefront/` | Vite 4, ESLint 8 (`.eslintrc.cjs`), Tailwind 3 + PrimeReact unstyled (Tailwind pass-through), Jotai, react-hook-form + yup | Customer shop **and federation remote** | 3000 |
| `adminpanel/` | Vite 5, ESLint 9 (flat config), PrimeReact (nano theme) + PrimeFlex, Chart.js, Quill | Back office, **federation host** | 5001 |
| `blog/` | Webpack 5 + Babel, Tailwind 2 | Standalone marketing blog | 8080 |

### Module Federation (`@originjs/vite-plugin-federation`)

- `storefront/vite.config.js` exposes, as `storefront_app` / `storefrontEntry.js`: `./Button`, `./useLocalStorage`, `./localstore`, `./store`, `./constants`, `./api` (the Axios instance), `./ThemeSwitcher`, `./SplashScreen`, `./useAuth`, `./AuthProvider`. Shared: `react`, `react-dom`, `jotai`.
- `adminpanel/vite.config.js` declares the remote `storefrontApp`: `http://localhost:3000/assets/storefrontEntry.js` in dev, the production storefront on Netlify otherwise. Shared: `react`, `react-dom`.
- The admin takes its whole session and data layer from the remote: `AuthProvider` (in `main.jsx`), `useAuth`, `api`, `SplashScreen`.
- **The remote entry only exists after a build** (this plugin does not serve it from the dev server). Locally the storefront must run as `vite build` (or `build --watch`) + `vite preview` for the admin to load it; `start-app.sh` does that.
- Contract: the admin may only import what `exposes` lists, and only names the exposed file actually exports (`check-changed.mjs` enforces both). Changing an exposed module means keeping the admin compatible in the same PR and **deploying the storefront first** (the production admin loads the production remote at runtime).

### Data and auth

- Backend: the Django/DRF repository **`delitamakanda/merch_store`** (private). Its CORS only accepts `http://localhost:3000` and `http://localhost:5001` locally: keep those ports and open the apps via `localhost`, never `127.0.0.1`.
- API root: `storefront/src/constants.js` — `BASE_URL` comes from `VITE_API_URL` (read at build time, with a trailing `/`, see `storefront/.env.example`) and defaults to the production API. `API_URL = BASE_URL + 'api/'`.
- `storefront/src/lib/api.js`: Axios instance, `Authorization: Bearer <token>` from `localStorage` (`token`, `refresh`, `user`, JSON-encoded), refresh on 401 via `auth/token/refresh/`.
- `storefront/src/providers/Auth.jsx`: `login` (`POST auth/login/` → `{ access, refresh, user }`), `register` (`registration/`), `logout`. Each app has its own origin, so its own session.
- Guards are client-side only: storefront `Layout canAuth` redirects to `/login`; admin `Layout` requires a token and `user.is_staff`.
- Endpoints live under `/api/store/` (products, `category-list/`, `deals/`, `coupon/`, `flatpage/`, `order/`, `customers-order/`, `user/`, stats `dailyRevenue/`, `dailyOrders/`, `newCustomers/`…). Pages call the Axios instance directly (no service layer); paths are relative to `/api/` (`store/coupon/`).
- Demo data (`manage.py seed_demo`, run by `start-app.sh`): `demo-admin` (staff) and `demo-customer`, password `demo-password-123`; 5 "Demo …" products in 3 categories, coupon `DEMO10`, deal `demo-winter-sale`, one order for `demo-customer`.

### Known issues

- The response interceptor in `storefront/src/lib/api.js` only rethrows in the 401/refresh path: any other HTTP error **resolves to `undefined`** instead of rejecting, so `catch` blocks do not run and `response.data` throws. `includeCredentials` is not an Axios option (no-op).
- On the agent's SQLite database, `store/dailyRevenue/`, `store/dailyOrders/` and `store/newCustomers/` return 500 (backend bug): the admin dashboard cards fail locally.
- Backend `IsStaffOrReadOnly` does not protect list/create endpoints (see `merch_store`'s CLAUDE.md): the admin's `is_staff` check is UI only.
- `storefront/vite.config.js.timestamp-*.mjs` is a stray committed file.
- Demo products have no images, and real product images are hosted elsewhere: expect empty image slots locally.

## Conventions

- Function components and hooks, JavaScript/JSX (no TypeScript). Follow the style of the file you edit.
- The admin never creates its own Axios instance or hard-codes an API URL: `import axiosInstance from "storefrontApp/api"` and `useAuth` from `storefrontApp/useAuth`.
- Handle loading, empty and error states; reuse the PrimeReact components already used in the app and the existing layouts.
- User-facing text is in English, like the rest of the UI. Pages stay usable at 390 px and meet WCAG AA (labels, focus, contrast, `alt`).
- Tests: native `node:test` + `node:assert/strict`, `*.test.js` in a `__tests__/` folder next to the code. Node does not parse JSX and there is no DOM: test pure logic (helpers, Jotai atoms via `createStore`), extracted into `.js` modules that import no `.jsx` or PrimeReact. Never call the network.
- No new dependency without a ticket asking for it; `package.json` and `pnpm-lock.yaml` change together, with that app's pnpm version.
- Do not change the API contract on the front side alone: if a ticket needs a backend change, say so (issue on `merch_store`).
- `.claude/agents/` has project subagents: `test-writer`, `ui-reviewer`, `dependency-keeper`.

## Agentic workflow

Issues are specs: a Claude agent (GitHub Actions) refines them, implements one ticket at a time against the running platform (demo API + storefront remote + admin host) and opens a PR for human review. See `docs/agentic-workflow.md`. Agents must never modify `.github/`.
