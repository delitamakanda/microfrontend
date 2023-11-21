import Button from './Button'
import { useArticleData } from './store';
import { Provider as JotaiProvider } from 'jotai'
import { Layout } from './components/Layout';
import { ProductCart } from './components/ProductCart';
// import "primereact/resources/themes/tailwind-light/theme.css";
// import "primereact/resources/primereact.css";
// import "primeflex/primeflex.css";
// import "primeicons/primeicons.css";
import './App.css'

function App() {
  const [ data ] = useArticleData();

  return (
    <JotaiProvider>
      <Layout>
      <h1>store front</h1>
      <div className="card">
        <Button />
      </div>
      <div className="my-5" />
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {data?.results?.map((article, idx) => (
          <ProductCart key={idx} product={article} />
        ))}
      </div>
      </Layout>
    </JotaiProvider>
  )
}

export default App
