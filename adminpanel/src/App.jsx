import { ErrorComponent } from './components/core';
import { DocumentTitleHandler, UnsavedChangesNotifier } from './components/kbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
// import Button from 'storefrontApp/Button'
// import { useArticleData } from 'storefrontApp/store'
import './App.css'
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="*" element={<ErrorComponent />} />
    </Routes>
    <DocumentTitleHandler />
    <UnsavedChangesNotifier />
    </BrowserRouter>
  )
}

export default App
