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