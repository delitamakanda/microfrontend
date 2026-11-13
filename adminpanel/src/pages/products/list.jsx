import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Image } from "primereact/image";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "storefrontApp/api";
import {
  DEFAULT_PAGE_SIZE,
  buildListQuery,
  formatPrice,
  getStatusSeverity,
} from "../../helpers/product";

const formatDateTime = (value) => {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const INITIAL_LAZY_STATE = {
  first: 0,
  rows: DEFAULT_PAGE_SIZE,
  sortField: "created_at",
  sortOrder: -1,
};

export const ProductList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef(null);

  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lazyState, setLazyState] = useState(INITIAL_LAZY_STATE);

  useEffect(() => {
    if (location.state?.toast) toast.current?.show(location.state.toast);
  }, [location.state]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceSearch(search);
      setLazyState((state) => (state.first ? { ...state, first: 0 } : state));
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(false);
    return axiosInstance
      .get(`store/product/?${buildListQuery({ search: debounceSearch, ...lazyState })}`)
      .then((response) => {
        // An older remote resolves to undefined on HTTP errors.
        if (!response?.data) {
          setError(true);
          return;
        }
        setTotalRecords(response.data.count ?? 0);
        setProducts(response.data.results ?? []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [debounceSearch, lazyState]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const confirmDelete = (product) => {
    confirmDialog({
      message: `Are you sure you want to delete "${product.name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        axiosInstance
          .delete(`store/product/${product.uuid}/detail/`)
          .then((response) => {
            if (!response) throw new Error("Not deleted");
            setProducts((list) => list.filter((item) => item.uuid !== product.uuid));
            setTotalRecords((count) => Math.max(0, count - 1));
            toast.current?.show({ severity: "success", summary: "Success", detail: "Product deleted" });
          })
          .catch((err) => {
            const unsupported = err?.response?.status === 405;
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: unsupported
                ? "Deleting products is not supported by the API yet."
                : "The product could not be deleted.",
            });
          });
      },
    });
  };

  const imageBodyTemplate = (rowData) =>
    rowData.image_url ? (
      <Image src={rowData.image_url} alt={rowData.name} width="64" />
    ) : (
      <span className="text-color-secondary">-</span>
    );

  const actionBodyTemplate = (rowData) => (
    <div className="flex justify-content-center">
      <Button
        icon="pi pi-eye"
        rounded
        text
        severity="secondary"
        aria-label={`View ${rowData.name}`}
        onClick={() => navigate(`/products/show/${rowData.uuid}`)}
      />
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="secondary"
        aria-label={`Edit ${rowData.name}`}
        onClick={() => navigate(`/products/edit/${rowData.uuid}`)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        aria-label={`Delete ${rowData.name}`}
        onClick={() => confirmDelete(rowData)}
      />
    </div>
  );

  const statusBodyTemplate = (product) => (
    <Tag value={product.status} severity={getStatusSeverity(product.status)} />
  );

  const header = (
    <div className="flex flex-wrap gap-2 justify-content-between">
      <Button
        type="button"
        icon="pi pi-filter-slash"
        label="Clear"
        outlined
        onClick={() => {
          setSearch("");
          setDebounceSearch("");
          setLazyState(INITIAL_LAZY_STATE);
        }}
      />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Keyword Search"
          aria-label="Search products"
        />
      </span>
    </div>
  );

  return (
    <Card
      className="shadow-1"
      title={
        <div className="flex justify-content-between align-items-center">
          <span className="p-card-title">Products</span>
          <Button
            icon="pi pi-plus"
            label="Create"
            onClick={() => navigate("/products/create")}
          />
        </div>
      }
    >
      {error && (
        <div role="alert" className="mb-3">
          <p className="text-red-700 mt-0">Products could not be loaded.</p>
          <Button label="Retry" icon="pi pi-refresh" outlined onClick={fetchProducts} />
        </div>
      )}
      <DataTable
        value={products}
        lazy
        showGridlines
        dataKey="uuid"
        paginator
        rows={lazyState.rows}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onPage={(event) => setLazyState((state) => ({ ...state, first: event.first, rows: event.rows }))}
        onSort={(event) =>
          setLazyState((state) => ({
            ...state,
            first: 0,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
          }))
        }
        sortField={lazyState.sortField}
        sortOrder={lazyState.sortOrder}
        first={lazyState.first}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
        currentPageReportTemplate={`Total: ${totalRecords} entries`}
        totalRecords={totalRecords}
        header={header}
        loading={isLoading}
        emptyMessage={error ? " " : "No products found."}
        scrollable
      >
        <Column
          field="image_url"
          header="Image"
          style={{ minWidth: "6rem", width: "8rem" }}
          body={imageBodyTemplate}
        />
        <Column field="name" header="Name" style={{ minWidth: "12rem" }} sortable />
        <Column
          field="price"
          header="Price"
          body={(rowData) => formatPrice(rowData.price)}
          style={{ minWidth: "8rem", width: "10rem" }}
          sortable
        />
        <Column
          field="status"
          sortField="stock_quantity"
          header="Status"
          body={statusBodyTemplate}
          style={{ minWidth: "9rem", width: "10rem" }}
          sortable
        />
        <Column
          field="created_at"
          header="Created at"
          body={(rowData) => formatDateTime(rowData.created_at)}
          style={{ minWidth: "11rem" }}
          sortable
        />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          align="center"
          style={{ minWidth: "10rem", width: "10rem" }}
        />
      </DataTable>
      <Toast ref={toast} />
    </Card>
  );
};
