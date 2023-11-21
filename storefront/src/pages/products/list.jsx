import { ProductCart } from '../../components/ProductCart';
import { useArticleData } from '../../store';
import Button from '../../Button'

export const ProductList = () => {
    const [ data ] = useArticleData();
    return (
        <>
        <h1>List products</h1>
        <div className="card">
          <Button />
        </div>
        <div className="my-5" />
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {data?.results?.map((article, idx) => (
            <ProductCart key={idx} product={article} />
          ))}
        </div>
        </>
    )
}