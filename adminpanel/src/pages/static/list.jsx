import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "storefrontApp/api";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";

export const FlatPageList = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [pages, setPages] = useState([]);
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
          `/store/flatpage/?q=${search}&limit=${lazyState.rows}&offset=${lazyState.first}`
        )
        .then((response) => {
          setPageCount(response.data.count);
          setPages(response.data.results);
          setLoading(false);
        });
    }, 1000);
  };
  const confirmDeletePage = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete this page?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        axiosInstance.delete(`/store/flatpage/${id}/`).then(() => {
          setPages(pages.filter((page) => page.id !== id));
        });
      },
    });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-eye"
          text
          className="btn btn-sm btn-info"
          onClick={() => navigate(`/pages/show/${rowData.id}`)}
          />
        <Button
          type="button"
          icon="pi pi-pencil"
          text
          className="btn btn-sm btn-primary"
          onClick={() => navigate(`/pages/edit/${rowData.id}`)}
        />
        <Button
          type="button"
          icon="pi pi-trash"
          text
          className="btn btn-sm btn-danger"
          onClick={() => confirmDeletePage(rowData.id)}
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
        className="p-button-secondary"
        onClick={() => setSearch("")}
      />
      <Button type="button"
              icon="pi pi-plus"
              label="Add New"
              className="p-button-success"
              onClick={() => navigate(`/pages/create`)}
        />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          value={search}
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          className="p-inputtext p-fill"
        />
      </span>
    </div>
  );

  const onPageChange = (event) => {
    setLazyState(event);
  };

  const truncateContentBody = (rowData) => {
    // escape html characters
    return rowData.content.length > 50
      ? `${rowData.content.substr(0, 50)}...`
      : rowData.content;
  };
  return (
    <Card className="shadow-1">
      <DataTable
        value={pages}
        dataKey="id"
        showGridlines
        lazy={true}
        filterDisplay="row"
        paginator
        rows={lazyState.rows}
        first={lazyState.first}
        totalRecords={pageCount}
        onPage={onPageChange}
        header={header}
        loading={isLoading}
      >
        <Column field="title" header="Title" sortable />
        <Column field="content" header="Content" body={truncateContentBody} />
        <Column
          field="action"
          header="Action"
          body={actionBodyTemplate}
          style={{ minWidth: "12rem", width: "12rem" }}
        />
      </DataTable>
    </Card>
  );
};
