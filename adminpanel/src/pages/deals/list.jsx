import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axiosInstance from "storefrontApp/api";
import { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export const DealList = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [deals, setDeals] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    total: 0,
    page: 1,
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  let networkTimeout = null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    if (networkTimeout) {
      clearTimeout(networkTimeout);
    }

    networkTimeout = setTimeout(() => {
      axiosInstance
        .get(
          `/store/deals/?start_date=${startDate}&end_date=${endDate}&limit=${lazyState.rows}&offset=${lazyState.first}`
        )
        .then((response) => {
          setPageCount(response.data.count);
          setDeals(response.data.results);
          setLoading(false);
        });
    }, 1000);
  };

  const confirmDeleteDeal = (uuid) => {
    // TODO delete deal
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          rounded
          icon="pi pi-pencil"
          text
          severity="secondary"
          className="btn btn-sm btn-primary"
          onClick={() => navigate(`/deals/edit/${rowData.uuid}`)}
        />
        <Button
          type="button"
          rounded
          icon="pi pi-trash"
          text
          className="btn btn-sm btn-danger"
          onClick={() => confirmDeleteDeal(rowData.uuid)}
        />
      </div>
    );
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
          placeholder="Keyword Search"
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
          <h4>Deals</h4>
          <Button
            type="button"
            icon="pi pi-plus"
            label="Create"
            outlined
            className="btn btn-primary"
            onClick={() => navigate("/deals/create")}
          />
        </div>
      }
    >
      <Helmet>
        <title>Dearest. | Deals</title>
      </Helmet>
      <DataTable
        value={deals.filter((d) => {
          return d.code.toLowerCase().includes(search.toLowerCase());
        })}
        showGridlines
        dataKey="uuid"
        lazy={true}
        paginator
        rowsPerPageOptions={[5, 10, 25, 50]}
        header={header}
        loading={isLoading}
        first={lazyState.first}
        rows={lazyState.rows}
        onPage={onPageChange}
        totalRecords={pageCount}
        filterDisplay="row"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
        currentPageReportTemplate={"total " + ":" + pageCount + " entries"}
      >
        <Column field="code" header="Code" sortable />
        <Column field="discount" header="Discount" />
        <Column field="active" header="Is active" />
        <Column
          body={actionBodyTemplate}
          header="Actions"
          style={{ minWidth: "12rem", width: "12rem" }}
        />
      </DataTable>
    </Card>
  );
};
