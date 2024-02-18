import { Layout } from './components/Layout';
import { Routes, Route } from "react-router-dom";
import { ProductList, ProductDetail } from './pages/products';
import { Cart, CheckoutPage } from './pages/cart';
import { HomePage } from './pages/home';
import { FaqPage, AboutPage, ShippingPage } from './pages/help';
import { CategoriesPage } from './pages/categories';
import { SigninPage, RegisterPage, ForgotPassword } from './pages/auth';
import { OrderPage, OrderPageDetail } from './pages/account';
import { Suspense } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ROUTES } from './constants';

import './App.css'

function App() {
  return (
      <>
      <Suspense fallback={<ProgressSpinner />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
              <Route path={ROUTES.HELP} element={<FaqPage />} />
              <Route path={ROUTES.SHIPPING} element={<ShippingPage />} />
              <Route path={ROUTES.ABOUT} element={<AboutPage />} />
              <Route path={ROUTES.PRODUCTS}>
                <Route index element={<ProductList />} />
                <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetail />} />
              </Route>
              <Route path={ROUTES.ORDER}>
                <Route index element={<OrderPage />} />
                <Route path={ROUTES.ORDER_DETAIL} element={<OrderPageDetail />} />
              </Route>
              <Route path={ROUTES.CART} element={<Cart />} />
              <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
            </Route>
            <Route path={ROUTES.LOGIN} element={<SigninPage />} />
            <Route path={ROUTES.SIGNUP} element={<RegisterPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path="*" element={<>Error</>} />
          </Routes>
      </Suspense>
      </>
  )
}

export default App
