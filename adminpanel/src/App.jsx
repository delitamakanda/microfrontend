import { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Login } from "./pages/login";
import { ErrorComponent } from "./components/core";
import { Layout } from "./components/layout";
import {
  CategoryList,
  CategoryEdit,
  CategoryShow,
  CategoryCreate,
} from "./pages/categories";
import {
  ProductList,
  ProductEdit,
  ProductShow,
  ProductCreate,
} from "./pages/products";
import { DealList, DealEdit, DealCreate } from "./pages/deals";
import { CouponList, CouponEdit, CouponCreate } from "./pages/coupons";
import { FlatPageList, FlatPageUpdate } from "./pages/static";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/nano/theme.css";

import { PrimeReactProvider } from "primereact/api";
import { ConfirmDialog } from "primereact/confirmdialog";
import SplashScreen from "storefrontApp/SplashScreen";

function App() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, []);

  return (
    <PrimeReactProvider>
      <div>
        {isLoading && <SplashScreen />}
        {!isLoading && (
          <>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<Layout />}>
                <Route index path="/" element={<Dashboard />} />
              </Route>

              <Route element={<Layout />}>
                <Route path="/products">
                  <Route index element={<ProductList />} />
                  <Route path="create" element={<ProductCreate />} />
                  <Route path="edit/:id" element={<ProductEdit />} />
                  <Route path="show/:id" element={<ProductShow />} />
                </Route>
              </Route>

              <Route element={<Layout />}>
                <Route path="/categories">
                  <Route index element={<CategoryList />} />
                  <Route path="create" element={<CategoryCreate />} />
                  <Route path="edit/:id" element={<CategoryEdit />} />
                  <Route path="show/:id" element={<CategoryShow />} />
                </Route>
              </Route>

              <Route element={<Layout />}>
                <Route path="/deals">
                  <Route index element={<DealList />} />
                  <Route path="create" element={<DealCreate />} />
                  <Route path="edit/:slug" element={<DealEdit />} />
                </Route>
              </Route>

              <Route element={<Layout />}>
                <Route path="/coupons">
                  <Route index element={<CouponList />} />
                  <Route path="create" element={<CouponCreate />} />
                  <Route path="edit/:code" element={<CouponEdit />} />
                </Route>
              </Route>

              <Route element={<Layout />}>
                <Route path="/pages">
                  <Route index element={<FlatPageList />} />
                  <Route path="edit/:id" element={<FlatPageUpdate />} />
                </Route>
              </Route>

              <Route path="*" element={<ErrorComponent />} />
            </Routes>
            <ConfirmDialog />
          </>
        )}
      </div>
    </PrimeReactProvider>
  );
}

export default App;
