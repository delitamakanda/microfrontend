import Button from './Button'
import './App.css'
// import { useArticleData } from './store';
import axiosInstance from './lib/api';
import { useEffect, useState } from 'react';

function App() {
  // const [ data ] = useArticleData();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ articles, setArticles ] = useState([]);

  useEffect(() => {
    setIsLoading(true)
    axiosInstance.get('store/product/?ordering=-created_at').then(res => {
      setTimeout(() => {
        setIsLoading(false)
        setArticles(res.data)
      }, 500)
    })
  }, [])

  return (
    <>
      <h1>store front</h1>
      <div className="card">
        <Button />
      </div>
      {isLoading && <div className="loader">Loading...</div>}
      {articles?.results?.map((article, idx) => (
        <div key={idx}>
          <h2>{article.name}</h2>
          <img src={article.image_url} alt={article.name} />
          <p>{article.price}</p>
        </div>
      ))}
    </>
  )
}

export default App
