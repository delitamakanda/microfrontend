import { ProductCart } from '../../components/ProductCart';
import Button from '../../Button'
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import axiosInstance from '../../lib/api';
import { useState, useEffect } from'react';


export const ProductList = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debounceSearch, setDebounceSearch] = useState('');
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    total: 0,
    page: 1,
    sortField: 'created_at',
    sortOrder: '-'
  });

  useEffect(() => {
    fetchLazyData();
    const timeout = setTimeout(() => {
      setDebounceSearch(search);
    }, 500);
    return () => clearTimeout(timeout);
  }, [lazyState, debounceSearch]);

  const fetchLazyData = () => {
    setLoading(true);
    axiosInstance.get(`store/product/?q=${search}&limit=${lazyState.rows}&offset=${lazyState.first}&ordering=${lazyState.sortOrder}${lazyState.sortField}`)
    .then(response => {
        setData(response.data)
        setTimeout(() => {
          setLoading(false)
        }, 0)
      })
  };

  const onPageChange = (e) => {
    setLazyState(e);
  }
    
  return (
      <>
      <Button />
      <h1>List products</h1>
      <div className="card">
        <InputText value={search} onChange={(e) => {
                        setSearch(e.target.value);
                        setLazyState({
                            first: 0,
                            rows: 10,
                            total: 0,
                            page: 1,
                        })
                    }} />
        {isLoading && <div className="loader">Loading...</div>}
      </div>
      <div className="my-5" />
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {data?.results?.map((article, idx) => (
          <ProductCart key={idx} product={article} />
        ))}
      </div>
      <Paginator first={lazyState?.first} rows={lazyState?.rows} totalRecords={data?.count} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />
      </>
  )
}
