import { ProductCart } from "../../components/ProductCart";
import axiosInstance from "../../lib/api";
import { useState, useEffect, useMemo } from "react";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { Spinner } from "../../components/ui/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

export const ProductList = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    total: 0,
    page: 1,
    sortField: "created_at",
    sortOrder: -1,
    query: "",
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

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
    axiosInstance
      .get(
        `store/product/?category_name_in=${encodeURIComponent(
          lazyState.query
        )}&q=${search}&limit=${lazyState.rows}&offset=${
          lazyState.first
        }&ordering=${lazyState.sortOrder === -1 ? "-" : ""}${
          lazyState.sortField
        }`
      )
      .then((response) => {
        setData(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 100);
      });
  };

  const fetchCategories = () => {
    axiosInstance.get("store/category-list/").then((response) => {
      if (response.data) {
        response.data.unshift({
          uuid: "00000000-0000-0000-0000-000000000000",
          name: "All",
        });
        setCategories(response.data);
        setSelectedCategories([response.data[0]]);
        setLoading(false);
      }
    });
  };

  useMemo(() => {
    fetchCategories();
  }, []);

  const totalPages = Math.ceil((data?.count || 0) / lazyState.rows);
  const currentPage = lazyState.page;

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setLazyState((prev) => ({
      ...prev,
      first: (page - 1) * prev.rows,
      page,
    }));
  };

  const onCategoryChange = (category, checked) => {
    let _selectedCategories = [...selectedCategories];

    if (checked) {
      _selectedCategories.push(category);
    } else {
      _selectedCategories = _selectedCategories.filter(
        (item) => item.uuid !== category.uuid
      );
    }

    setSelectedCategories(_selectedCategories);
    setLazyState({
      ...lazyState,
      query: _selectedCategories
        .filter((c) => c.name !== "All")
        .map((categoryItem) => categoryItem.name)
        .join(","),
    });
  };

  return (
    <>
      <h2 className="sr-only">Products</h2>
      <div className="container mx-auto flex flex-col gap-8 lg:flex-row">
        <div className="hidden w-full lg:block lg:w-4/12">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <Input
              value={search}
              placeholder="Search products"
              onChange={(e) => {
                setSearch(e.target.value);
                setLazyState({
                  ...lazyState,
                  first: 0,
                  rows: 10,
                  total: 0,
                  page: 1,
                });
              }}
            />
            {isLoading && <Spinner className="mt-3" />}
          </div>
          {!isLoading && (
            <div className="mt-6 space-y-4">
              {categories?.map((category) => (
                <div key={category.uuid} className="space-y-2">
                  <h3 className="sr-only">{category.name}</h3>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={category.uuid}
                      checked={selectedCategories.some(
                        (item) => item.uuid === category.uuid
                      )}
                      onCheckedChange={(checked) =>
                        onCategoryChange(category, Boolean(checked))
                      }
                    />
                    <label htmlFor={category.uuid} className="text-sm">
                      {category?.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-full lg:w-8/12">
          <div className="my-5" />
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {data?.results?.map((article, idx) => (
              <ProductCart key={idx} product={article} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => goToPage(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
