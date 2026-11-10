import { ProductCart } from '../../components/ProductCart';
import { ProductRow } from '../../components/ProductRow';
// import Button from '../../Button'
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import { Checkbox} from 'primereact/checkbox';
import { Sidebar } from 'primereact/sidebar';
import axiosInstance from '../../lib/api';
import { Button } from 'primereact/button';
import { useState, useEffect, useRef } from'react';
import { useSearchParams } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { buildProductQuery, parseCategoryParams, serializeCategoryParams } from '../categories/categoryFilter';
import { parseViewParam, serializeViewParam, VIEW_GRID, VIEW_LIST } from './viewMode';

// "All" is a virtual category: it never goes into the URL nor the API query.
const ALL_CATEGORY ={uuid: '00000000-0000-0000-0000-000000000000', name: 'All'};

export const ProductList = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [debounceSearch, setDebounceSearch] = useState('');
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    total: 0,
    page: 1,
    sortField: 'created_at',
    sortOrder: -1,
  });
  const [categories, setCategories] = useState([]);
  const [categoriesReady, setCategoriesReady] = useState(false);
  const [categoriesError, setCategoriesError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const latestRequest = useRef(0);
  const filtersButtonRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  // The URL is the source of truth: names of the selected categories (empty = All).
  const selectedNames = parseCategoryParams(searchParams, categories);
  const query = selectedNames.join(',');
  const view = parseViewParam(searchParams);

  useEffect(() => {
    if (!categoriesReady) return undefined;
    setLoading(true);
    fetchLazyData();
    const timeout = setTimeout(() => {
      setDebounceSearch(search);
    }, 500);
    return () => clearTimeout(timeout);
  }, [lazyState, debounceSearch, query, categoriesReady, reloadKey]);

  const fetchLazyData = () => {
    // Only the latest request may update the state (filters can change quickly).
    const requestId = ++latestRequest.current;
    setLoading(true);
    const queryString = buildProductQuery({
      names: selectedNames,
      search: debounceSearch,
      limit: lazyState.rows,
      offset: lazyState.first,
      ordering: `${lazyState.sortOrder === -1 ? '-' : ''}${lazyState.sortField}`,
    });
    axiosInstance.get(`store/product/?${queryString}`)
      .then(response => {
        if (requestId !== latestRequest.current) return;
        if (response?.data) setData(response.data)
        setError(!response?.data)
        setLoading(false)
      })
      .catch(() => {
        if (requestId !== latestRequest.current) return;
        setError(true)
        setLoading(false)
      })
  };

  useEffect(() => {
    axiosInstance.get('store/category-list/')
      .then((response) => {
        const list = Array.isArray(response?.data) ? response.data : null
        setCategories([ALL_CATEGORY, ...(list ?? [])])
        setCategoriesError(!list)
      })
      .catch(() => {
        setCategories([ALL_CATEGORY])
        setCategoriesError(true)
      })
      .finally(() => setCategoriesReady(true))
  }, [])

  const onPageChange = (e) => {
    setLazyState({
      first: e.first,
      rows: e.rows,
      total: e.total,
      page: e.page,
      sortField: lazyState.sortField,
      sortOrder: lazyState.sortOrder,
    });
  }

  const updateCategories = (names) => {
    setSearchParams(serializeCategoryParams(names, searchParams), { replace: true });
    setLazyState({ ...lazyState, first: 0, page: 1 });
  };

  const onViewChange = (value) => {
    setSearchParams(serializeViewParam(value, searchParams), { replace: true });
  };

  const onCategoryChange = (e) => {
    if (e.value.name === ALL_CATEGORY.name) {
      updateCategories([]);
    } else if (e.checked) {
      updateCategories([...selectedNames, e.value.name]);
    } else {
      updateCategories(selectedNames.filter(name => name !== e.value.name));
    }
  };

  const onSearchChange = (e) => {
    setSearch(e.target.value);
    setLazyState({ ...lazyState, first: 0, total: 0, page: 1 });
  };

  const closeFilters = () => {
    setFiltersOpen(false);
    filtersButtonRef.current?.focus();
  };

  // Rendered twice (desktop column, mobile panel): ids must differ.
  const renderCategories = (idPrefix) => (
    <fieldset className="p-0 m-0 border-0">
      <legend className="sr-only">Categories</legend>
      {categories?.map((c) => (
        <div key={c.uuid} className="flex my-2 align-items-center">
          <Checkbox inputId={`${idPrefix}-${c.uuid}`} name="category" value={c} onChange={onCategoryChange} checked={c.name === ALL_CATEGORY.name ? selectedNames.length === 0 : selectedNames.includes(c.name)}/>
          <label htmlFor={`${idPrefix}-${c.uuid}`} className="ml-2">{c?.name}</label>
        </div>
      ))}
      {categoriesError && <p role="alert">Categories could not be loaded.</p>}
    </fieldset>
  );

  return (
      <>
      {/*<Button />*/}
      <h2 className="sr-only">Products</h2>
      <div className='container flex justify-between mx-auto'>
      <div className='hidden w-4/12 -mx-8 lg:block'>
      <div className="card">
  <InputText value={search} placeholder='Search products' aria-label='Search products' className='w-full' onChange={onSearchChange} />
  {isLoading && <ProgressSpinner style={{width: '50px', height: '50px'}} />}
</div>
      {renderCategories('desktop')}
      </div>
      <div className="w-full lg:w-8/12">
      <div className="flex items-center gap-3 my-3 lg:hidden">
        <button ref={filtersButtonRef} type="button" className="px-4 py-2 font-semibold text-gray-900 bg-white border border-gray-700 rounded focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-gray-900" onClick={() => setFiltersOpen(true)}>
          Filters{selectedNames.length > 0 ? ` (${selectedNames.length})` : ''}
        </button>
        {isLoading && <ProgressSpinner style={{width: '28px', height: '28px'}} strokeWidth="6" aria-label="Loading products" />}
      </div>
      <Sidebar visible={filtersOpen} position="left" header="Filters" onHide={closeFilters}>
        <InputText value={search} placeholder='Search products' aria-label='Search products' className='w-full mb-3' onChange={onSearchChange} />
        {renderCategories('mobile')}
        <div className="flex gap-2 mt-4">
          <Button label="Clear" outlined size="small" onClick={() => updateCategories([])} disabled={selectedNames.length === 0} />
          <Button label="Done" size="small" onClick={closeFilters} />
        </div>
      </Sidebar>
      {selectedNames.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 my-3 lg:hidden">
          <p className="font-semibold">Category: {selectedNames.join(', ')}</p>
          <Button label="Clear filter" link size="small" onClick={() => updateCategories([])} />
        </div>
      )}
      <div className="my-5" />
      {!isLoading && error && (
        <div role="alert" className="text-center">
          <p>Products could not be loaded.</p>
          <Button label="Retry" size="small" className="mt-2" onClick={() => setReloadKey((k) => k + 1)} />
        </div>
      )}
      {!isLoading && !error && categoriesReady && data?.results?.length === 0 && (
        <div className="text-center">
          <p>No products found</p>
          {selectedNames.length > 0 && <Button label="Clear filter" link size="small" onClick={() => updateCategories([])} />}
        </div>
      )}
      <div role="group" aria-label="Product view" className="flex flex-wrap justify-end gap-2 mb-4">
        <Button type="button" icon="pi pi-th-large" label="Grid view" aria-pressed={view === VIEW_GRID} outlined={view !== VIEW_GRID} size="small" onClick={() => onViewChange(VIEW_GRID)} />
        <Button type="button" icon="pi pi-list" label="List view" aria-pressed={view === VIEW_LIST} outlined={view !== VIEW_LIST} size="small" onClick={() => onViewChange(VIEW_LIST)} />
      </div>
      {view === VIEW_LIST ? (
        <ul className="m-0 p-0 list-none">
          {data?.results?.map((article) => (
            <ProductRow key={article.uuid} product={article} />
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {data?.results?.map((article) => (
            <ProductCart key={article.uuid} product={article} />
          ))}
        </div>
      )}
      <Paginator first={lazyState?.first} rows={lazyState?.rows} totalRecords={data?.count} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />
      </div>
      </div>
      </>
  )
}
