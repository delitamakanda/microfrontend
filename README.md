# Microfrontend implementation

```bash
# app 1
pnpm create vite storefront --template react

# app 2
pnpm create vite adminpanel --template react

# app 3
...
```

```bash
cd storefront
pnpm install
pnpm run dev
```

## add module federation
```bash
pnpm add @originjs/vite-plugin-federation -D
```

## Bonus: add create module-federation-app
```bash
npx create-mf-app
```

## Demo
1. Blog
[App 1](https://mellifluous-cocada-015edf.netlify.app/)

2. Admin panel
[App 2](https://astonishing-dieffenbachia-7f20d2.netlify.app/)

3. Storefront (WIP)
[App 3](https://resplendent-strudel-83725d.netlify.app/)
