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



[TODO](https://feixie1980.medium.com/fixing-node-js-modules-pollyfill-in-webpack-5-9e7979125aac)