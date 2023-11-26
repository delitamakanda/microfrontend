import { ErrorComponent } from './components/core';
import { Layout } from './components/layout';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import { Login } from './pages/login';
import { CategoryList, CategoryEdit, CategoryShow, CategoryCreate } from './pages/categories'
import { ProductList, ProductEdit, ProductShow, ProductCreate } from './pages/products'
import ThemeSwitcher from 'storefrontApp/ThemeSwitcher'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ConfirmDialog } from 'primereact/confirmdialog';
import './App.css'

function App() {

  return (
    <>
    <HelmetProvider>
      <Helmet>
            <title>Dearest. | Admin panel</title>
      </Helmet>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route index path="/"  element={<Dashboard />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="/products" >
            <Route index element={<ProductList />} />
            <Route path='create' element={<ProductCreate />} />
            <Route path='edit/:id' element={<ProductEdit />} />
            <Route path='show/:id' element={<ProductShow />} />
          </Route>
        </Route>

        <Route element={<Layout />}>
          <Route path="/categories">
            <Route index element={<CategoryList />} />
            <Route path='create' element={<CategoryCreate />} />
            <Route path='edit/:id' element={<CategoryEdit />} />
            <Route path='show/:id' element={<CategoryShow />} />
          </Route>
        </Route>
        
        <Route path="*" element={<ErrorComponent />} />
      </Routes>
      <ConfirmDialog />
      <ThemeSwitcher />
    </HelmetProvider>
    </>
  )
}

export default App
