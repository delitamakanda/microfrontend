import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import axiosInstance from "storefrontApp/api";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";

export const CouponList = () => {
  const navigate = useNavigate();

  const goToCouponCreate = () => {
    navigate("/coupons/create", { replace: true });
  };

  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    total: 0,
    page: 1,
  });

  let networkTimeout = null;

  useEffect(() => {
    fetchData();
    const timeout = setTimeout(() => {
      setDebounceSearch(search);
    }, 500);
    return () => clearTimeout(timeout);
  }, [lazyState, search, 500]);

  const fetchData = () => {
    setLoading(true);
    if (networkTimeout) {
      clearTimeout(networkTimeout);
    }

    networkTimeout = setTimeout(() => {
      axiosInstance
        .get(
          `/store/coupon/?q=${search}&limit=${lazyState.rows}&offset=${lazyState.first}`
        )
        .then((response) => {
          setPageCount(response.data.count);
          setCoupons(response.data.results);
          setLoading(false);
        });
    }, 1000);
  };

  const confirmDeleteDeal = (code) => {
    confirmDialog({
      message: "Are you sure you want to delete this coupon?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        axiosInstance.delete(`/store/coupon/${code}/`).then(() => {
          setCoupons(coupons.filter((coupon) => coupon.code !== code));
        });
      },
    });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-pencil"
          text
          className="btn btn-sm btn-primary"
          onClick={() => navigate(`/coupons/edit/${rowData.id}`)}
        />
        <Button
          type="button"
          icon="pi pi-trash"
          text
          className="btn btn-sm btn-danger"
          onClick={() => confirmDeleteDeal(rowData.code)}
        />
      </div>
    );
  };

  const validFromDateTemplate = (rowData) => {
    return new Date(rowData.valid_from).toLocaleString("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  const validToDateTemplate = (rowData) => {
    return new Date(rowData.valid_to).toLocaleString("en-US", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  const header = (
    <div className="flex justify-content-between">
      <Button
        type="button"
        icon="pi pi-filter-slash"
        label="Clear"
        outlined
        onClick={() => {
          setSearch("");
          setLazyState({
            first: 0,
            rows: 10,
            total: 0,
            page: 1,
          });
        }}
      />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="p-inputtext p-fill"
        />
      </span>
    </div>
  );

  const onPageChange = (event) => {
    setLazyState(event);
  };

  return (
    <Card
      className="shadow-1"
      title={
        <div className="flex justify-content-between align-items-center">
          <span className="p-card-title">Coupons</span>
          <Button
            icon="pi pi-plus"
            label="Create"
            onClick={goToCouponCreate}
            className="ml-2"
          />
        </div>
      }
    >
      <Helmet>
        <title>Dearest. | Coupons</title>
      </Helmet>
      <DataTable
        value={coupons}
        showGridlines
        dataKey="code"
        paginator
        lazy={true}
        rowsPerPageOptions={[5, 10, 25, 50]}
        header={header}
        first={lazyState.first}
        rows={lazyState.rows}
        onPage={onPageChange}
        totalRecords={pageCount}
        filterDisplay="row"
        loading={isLoading}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
        currentPageReportTemplate={"total " + ":" + pageCount + " entries"}
      >
        <Column field="code" header="Code" sortable />
        <Column
          field="valid_from"
          header="Valid From"
          body={validFromDateTemplate}
          sortable
        />
        <Column
          field="valid_to"
          header="Valid To"
          body={validToDateTemplate}
          sortable
        />
        <Column
          field="active"
          header="Active"
          body={(rowData) => (rowData.active ? "Yes" : "No")}
        />
        <Column field="actions" header="Actions" body={actionBodyTemplate} />
      </DataTable>
    </Card>
  );
};
