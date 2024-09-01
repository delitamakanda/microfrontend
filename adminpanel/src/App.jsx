import { useState, useEffect } from "react";
import { ErrorComponent } from "./components/core";
import { Layout } from "./components/layout";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Login } from "./pages/login";
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
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ConfirmDialog } from "primereact/confirmdialog";
import "./App.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import SplashScreen from "storefrontApp/SplashScreen";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      {isLoading && <SplashScreen />}
      {!isLoading && (
        <HelmetProvider>
          <Helmet>
            <title>Dearest. | Admin panel</title>
          </Helmet>
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
                <Route path="edit/:id" element={<DealEdit />} />
              </Route>
            </Route>

            <Route element={<Layout />}>
              <Route path="/coupons">
                <Route index element={<CouponList />} />
                <Route path="create" element={<CouponCreate />} />
                <Route path="edit/:id" element={<CouponEdit />} />
              </Route>
            </Route>

            <Route path="*" element={<ErrorComponent />} />
          </Routes>
          <ConfirmDialog />
        </HelmetProvider>
      )}
    </>
  );
};

export default App;
