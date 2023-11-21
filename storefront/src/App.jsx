import { Layout } from './components/Layout';
import { Routes, Route } from "react-router-dom";
import { ProductList, ProductDetail } from './pages/products';
import { Cart } from './pages/cart';
import { Suspense } from 'react';

import './App.css'

function App() {
  return (
      <>
      <Suspense fallback={<>Loading...</>}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/">
                <Route index element={<ProductList />} />
                <Route path=":id" element={<ProductDetail />} />
              </Route>
            </Route>

            <Route element={<Layout />}>
              <Route path="/cart" element={<Cart />} />
            </Route>

            <Route path="*" element={<>Error</>} />
          </Routes>
      </Suspense>
      </>
  )
}

export default App
