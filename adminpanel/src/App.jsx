import './App.css'

import Button from 'storefrontApp/Button'
import { useArticleData } from 'storefrontApp/store'

function App() {
  const [ data ] = useArticleData();

  return (
    <>
      <h1>admin panel</h1>
      <div className="card">
        <Button />
      </div>
      {data && data?.results.map(article => (
        <div key={article.id}>
          <h2>{article.name}</h2>
          <img src={article.image_url} alt={article.name} />
          <p>{article.price}</p>
        </div>
      ))}
    </>
  )
}

export default App
