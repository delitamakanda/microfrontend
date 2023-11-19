import Button from './Button'
import './App.css'
import { useArticleData } from './store';
import { Provider as JotaiProvider } from 'jotai'
import { Layout } from './components/Layout';
import { ProductCart } from './components/ProductCart';

function App() {
  const [ data ] = useArticleData();

  return (
    <JotaiProvider>
      <Layout>
      <h1>store front</h1>
      <div className="card">
        <Button />
      </div>
      {data?.results?.map((article, idx) => (
        <ProductCart key={idx} product={article} />
      ))}
      </Layout>
    </JotaiProvider>
  )
}

export default App
