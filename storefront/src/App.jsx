import { useEffect, useState } from "react";
import { Layout } from "./components";
import { Routes, Route } from "react-router-dom";
import { ProductList, ProductDetail } from "./pages/products";
import { Cart, CheckoutPage } from "./pages/cart";
import { HomePage } from "./pages/home";
import { FlatPage } from "./pages/help";
import { CategoriesPage } from "./pages/categories";
import { SigninPage, RegisterPage, ForgotPassword } from "./pages/auth";
import { OrderPage, OrderPageDetail } from "./pages/account";
import { Post } from "./pages/deal/post";
import { Suspense } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { ROUTES } from "./constants";
import SplashScreen from "./components/SplashScreen";

import "./App.css";

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
        <Suspense fallback={<ProgressSpinner />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
              <Route path={ROUTES.FLATPAGE}>
                <Route
                  path={`${ROUTES.FLATPAGE}/:slug`}
                  element={<FlatPage />}
                />
              </Route>
              <Route path={ROUTES.DEAL}>
                <Route path={`${ROUTES.DEAL}/:slug`} element={<Post />} />
              </Route>
              <Route path={ROUTES.PRODUCTS}>
                <Route index element={<ProductList />} />
                <Route
                  path={ROUTES.PRODUCT_DETAIL}
                  element={<ProductDetail />}
                />
              </Route>
              <Route path={ROUTES.CART} element={<Cart />} />
            </Route>
            <Route element={<Layout canAuth={true} />}>
              <Route path={ROUTES.ORDER}>
                <Route index element={<OrderPage />} />
                <Route
                  path={ROUTES.ORDER_DETAIL}
                  element={<OrderPageDetail />}
                />
              </Route>
              <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
            </Route>
            <Route element={<Layout />}>
              <Route path={ROUTES.LOGIN} element={<SigninPage />} />
              <Route path={ROUTES.SIGNUP} element={<RegisterPage />} />
              <Route
                path={ROUTES.FORGOT_PASSWORD}
                element={<ForgotPassword />}
              />
              <Route path="*" element={<>Error</>} />
            </Route>
          </Routes>
        </Suspense>
      )}
    </>
  );
};

export default App;
