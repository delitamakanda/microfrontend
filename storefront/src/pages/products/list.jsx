import { ProductCart } from '../../components/ProductCart';
// import Button from '../../Button'
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import { Checkbox} from 'primereact/checkbox';
import axiosInstance from '../../lib/api';
import { useState, useEffect, useMemo } from'react';
import { ProgressSpinner } from 'primereact/progressspinner';

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
    sortOrder: -1,
    query: '',
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(null);


  useEffect(() => {
    setLoading(true);
    fetchLazyData();
    const timeout = setTimeout(() => {
      setDebounceSearch(search);
    }, 500);
    return () => clearTimeout(timeout);
  }, [lazyState, debounceSearch]);

  const fetchLazyData = () => {
    setLoading(true);
    axiosInstance.get(`store/product/?category_name_in=${lazyState.query}&q=${search}&limit=${lazyState.rows}&offset=${lazyState.first}&ordering=${lazyState.sortOrder === -1 ? '-': ''}${lazyState.sortField}`)
    .then(response => {
        setData(response.data)
        setTimeout(() => {
          setLoading(false)
        }, 100)
      })
  };

  const fetchCategories = () => {
    axiosInstance.get('store/category-list/')
      .then((response) => {
        if (response.data) {
          response.data.unshift({uuid: '00000000-0000-0000-0000-000000000000', name: 'All'});
          setCategories(response.data)
          setSelectedCategories([response.data[0]])
          setLoading(false)
        }
      })
  }

  useMemo(() => {
    fetchCategories();
  }, [])

  const onPageChange = (e) => {
    setLazyState({
      first: e.first,
      rows: e.rows,
      total: e.total,
      page: e.page,
      sortField: lazyState.sortField,
      sortOrder: lazyState.sortOrder,
      query: lazyState.query,
    });
  }

  const onCategoryChange = (e) => {
    let _selectedCategories = [...selectedCategories];

    if (e.checked)
        _selectedCategories.push(e.value);
    else
        _selectedCategories = _selectedCategories.filter(category => category.uuid !== e.value.uuid);
    setSelectedCategories(_selectedCategories);
    setLazyState({
      ...lazyState,
      query: _selectedCategories.filter(c => c.name !== 'All').map(category => category.name).join(','),
    })
};
    
  return (
      <>
      {/*<Button />*/}
      <h2 className="sr-only">Products</h2>
      <div className='container flex justify-between mx-auto'>
      <div className='hidden w-4/12 -mx-8 lg:block'>
      <div className="card">
  <InputText value={search} placeholder='Search products' className='w-full' onChange={(e) => {
                  setSearch(e.target.value);
                  setLazyState({
                    ...lazyState,
                      first: 0,
                      rows: 10,
                      total: 0,
                      page: 1,
                  })
              }} />
  {isLoading && <ProgressSpinner style={{width: '50px', height: '50px'}} />}
</div>
      {!isLoading && <div>
        {categories?.map((c) => (
          <div key={c.uuid}>
            <h3 className="sr-only">{c.name}</h3>
            <div className="ui-group">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
              </div>
              <div key={c.uuid} className="flex align-items-center">
                <Checkbox inputId={c.uuid} name="category" value={c} onChange={onCategoryChange} checked={selectedCategories.some((item) => item.uuid === c.uuid)}/>
                <label htmlFor={c.uuid} className="ml-2">{c?.name}</label>
            </div>
            </div>
          </div>
        ))}
        </div>}
      </div>
      <div className="w-full lg:w-8/12">
      <div className="my-5" />
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {data?.results?.map((article, idx) => (
          <ProductCart key={idx} product={article} />
        ))}
      </div>
      <Paginator first={lazyState?.first} rows={lazyState?.rows} totalRecords={data?.count} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />
      </div>
      </div>
      </>
  )
}
