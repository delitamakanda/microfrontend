// vite.config.js
import { defineConfig } from "file:///Users/delitamakanda/projects/microfrontend/storefront/node_modules/.pnpm/vite@4.3.2/node_modules/vite/dist/node/index.js";
import react from "file:///Users/delitamakanda/projects/microfrontend/storefront/node_modules/.pnpm/@vitejs+plugin-react@4.0.0_vite@4.3.2/node_modules/@vitejs/plugin-react/dist/index.mjs";
import federation from "file:///Users/delitamakanda/projects/microfrontend/storefront/node_modules/.pnpm/@originjs+vite-plugin-federation@1.2.2/node_modules/@originjs/vite-plugin-federation/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    federation({
      name: "storefront_app",
      filename: "storefrontEntry.js",
      exposes: {
        "./Button": "./src/Button",
        "./useLocalStorage": "./src/hooks/useLocalStorage",
        "./localstore": "./src/hooks/localstore",
        "./store": "./src/store",
        "./constants": "./src/constants",
        "./api": "./src/lib/api",
        "./ThemeSwitcher": "./src/components/ThemeSwitcher",
        "./SplashScreen": "./src/components/SplashScreen",
        "./useAuth": "./src/hooks/useAuth",
        "./AuthProvider": "./src/providers/Auth"
      },
      shared: ["react", "react-dom", "jotai"]
    })
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false
  },
  optimizeDeps: {
    exclude: ["/node_modules/"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZGVsaXRhbWFrYW5kYS9wcm9qZWN0cy9taWNyb2Zyb250ZW5kL3N0b3JlZnJvbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9kZWxpdGFtYWthbmRhL3Byb2plY3RzL21pY3JvZnJvbnRlbmQvc3RvcmVmcm9udC92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZGVsaXRhbWFrYW5kYS9wcm9qZWN0cy9taWNyb2Zyb250ZW5kL3N0b3JlZnJvbnQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IGZlZGVyYXRpb24gZnJvbSAnQG9yaWdpbmpzL3ZpdGUtcGx1Z2luLWZlZGVyYXRpb24nXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBmZWRlcmF0aW9uKHtcbiAgICAgIG5hbWU6ICdzdG9yZWZyb250X2FwcCcsXG4gICAgICBmaWxlbmFtZTogJ3N0b3JlZnJvbnRFbnRyeS5qcycsXG4gICAgICBleHBvc2VzOiB7XG4gICAgICAgICcuL0J1dHRvbic6ICcuL3NyYy9CdXR0b24nLFxuICAgICAgICAnLi91c2VMb2NhbFN0b3JhZ2UnOiAnLi9zcmMvaG9va3MvdXNlTG9jYWxTdG9yYWdlJyxcbiAgICAgICAgJy4vbG9jYWxzdG9yZSc6ICcuL3NyYy9ob29rcy9sb2NhbHN0b3JlJyxcbiAgICAgICAgJy4vc3RvcmUnOiAnLi9zcmMvc3RvcmUnLFxuICAgICAgICAnLi9jb25zdGFudHMnOiAnLi9zcmMvY29uc3RhbnRzJyxcbiAgICAgICAgJy4vYXBpJzogJy4vc3JjL2xpYi9hcGknLFxuICAgICAgICAnLi9UaGVtZVN3aXRjaGVyJzogJy4vc3JjL2NvbXBvbmVudHMvVGhlbWVTd2l0Y2hlcicsXG4gICAgICAgICcuL1NwbGFzaFNjcmVlbic6ICcuL3NyYy9jb21wb25lbnRzL1NwbGFzaFNjcmVlbicsXG4gICAgICAgICcuL3VzZUF1dGgnOiAnLi9zcmMvaG9va3MvdXNlQXV0aCcsXG4gICAgICAgICcuL0F1dGhQcm92aWRlcic6ICcuL3NyYy9wcm92aWRlcnMvQXV0aCcsXG4gICAgICB9LFxuICAgICAgc2hhcmVkOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdqb3RhaSddLFxuICAgIH0pXSxcbiAgYnVpbGQ6IHtcbiAgICBtb2R1bGVQcmVsb2FkOiBmYWxzZSxcbiAgICB0YXJnZXQ6ICdlc25leHQnLFxuICAgIG1pbmlmeTogZmFsc2UsXG4gICAgY3NzQ29kZVNwbGl0OiBmYWxzZSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogWycvbm9kZV9tb2R1bGVzLyddLFxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvVixTQUFTLG9CQUFvQjtBQUNqWCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxnQkFBZ0I7QUFHdkIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sV0FBVztBQUFBLE1BQ1QsTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLE1BQ1YsU0FBUztBQUFBLFFBQ1AsWUFBWTtBQUFBLFFBQ1oscUJBQXFCO0FBQUEsUUFDckIsZ0JBQWdCO0FBQUEsUUFDaEIsV0FBVztBQUFBLFFBQ1gsZUFBZTtBQUFBLFFBQ2YsU0FBUztBQUFBLFFBQ1QsbUJBQW1CO0FBQUEsUUFDbkIsa0JBQWtCO0FBQUEsUUFDbEIsYUFBYTtBQUFBLFFBQ2Isa0JBQWtCO0FBQUEsTUFDcEI7QUFBQSxNQUNBLFFBQVEsQ0FBQyxTQUFTLGFBQWEsT0FBTztBQUFBLElBQ3hDLENBQUM7QUFBQSxFQUFDO0FBQUEsRUFDSixPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsSUFDZixRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixjQUFjO0FBQUEsRUFDaEI7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxnQkFBZ0I7QUFBQSxFQUM1QjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
