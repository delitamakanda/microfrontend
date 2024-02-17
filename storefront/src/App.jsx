import { Layout } from './components/Layout';
import { Routes, Route } from "react-router-dom";
import { ProductList, ProductDetail } from './pages/products';
import { Cart } from './pages/cart';
import { HomePage } from './pages/home';
import { FaqPage, AboutPage, ShippingPage } from './pages/help';
import { CategoriesPage } from './pages/categories';
import { Suspense } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';


import './App.css'

function App() {
  return (
      <>
      <Suspense fallback={<ProgressSpinner />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/help" element={<FaqPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/products">
                <Route index element={<ProductList />} />
                <Route path=":id" element={<ProductDetail />} />
              </Route>
              <Route path="/cart" element={<Cart />} />
            </Route>
            <Route path="*" element={<>Error</>} />
          </Routes>
      </Suspense>
      </>
  )
}

export default App
