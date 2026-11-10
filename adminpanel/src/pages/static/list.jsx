import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "storefrontApp/api";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { isSuccess, previewText } from "../../helpers/flatpage";

export const FlatPageList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pages, setPages] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const rows = 10;

  // Toast handed over by the create / edit pages.
  useEffect(() => {
    const message = location.state?.toast;
    if (message) {
      toast.current?.show(message);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setFirst(0);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    axiosInstance
      .get("store/flatpage/", {
        params: { q: debouncedSearch, limit: rows, offset: first },
      })
      .then((response) => {
        if (cancelled) return;
        if (!response?.data) {
          setError(true);
          return;
        }
        setTotalRecords(response.data.count);
        setPages(response.data.results);
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, first, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  const deletePage = async (id) => {
    let response;
    try {
      response = await axiosInstance.delete(`store/flatpage/${id}/`);
    } catch {
      response = undefined;
    }
    if (isSuccess(response)) {
      toast.current?.show({ severity: "success", summary: "Page deleted" });
      // Go back one page when the last row of a page is removed.
      if (pages.length === 1 && first > 0) setFirst(first - rows);
      else reload();
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Deletion failed",
        detail: "The page could not be deleted. Please try again.",
      });
    }
  };

  const confirmDeletePage = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.title}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => deletePage(rowData.id),
    });
  };

  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-1">
      <Button
        type="button"
        icon="pi pi-eye"
        text
        aria-label={`View ${rowData.title}`}
        onClick={() => navigate(`/pages/show/${rowData.id}`)}
      />
      <Button
        type="button"
        icon="pi pi-pencil"
        text
        aria-label={`Edit ${rowData.title}`}
        onClick={() => navigate(`/pages/edit/${rowData.id}`)}
      />
      <Button
        type="button"
        icon="pi pi-trash"
        text
        severity="danger"
        aria-label={`Delete ${rowData.title}`}
        onClick={() => confirmDeletePage(rowData)}
      />
    </div>
  );

  const header = (
    <div className="flex flex-wrap gap-2 justify-content-between">
      <Button
        type="button"
        icon="pi pi-filter-slash"
        label="Clear"
        outlined
        className="p-button-secondary"
        onClick={() => setSearch("")}
      />
      <Button
        type="button"
        icon="pi pi-plus"
        label="Add New"
        className="p-button-success"
        onClick={() => navigate("/pages/create")}
      />
      <span className="p-input-icon-left">
        <i className="pi pi-search" aria-hidden="true" />
        <InputText
          type="search"
          value={search}
          placeholder="Search..."
          aria-label="Search pages"
          onChange={(e) => setSearch(e.target.value)}
        />
      </span>
    </div>
  );

  const emptyMessage = error ? (
    <div className="flex flex-column align-items-center gap-2 p-3" role="alert">
      <span className="p-error">The pages could not be loaded.</span>
      <Button type="button" label="Retry" icon="pi pi-refresh" outlined onClick={reload} />
    </div>
  ) : debouncedSearch ? (
    <div className="p-3 text-center">No pages match your search.</div>
  ) : (
    <div className="flex flex-column align-items-center gap-2 p-3">
      <span>No pages yet</span>
      <Button
        type="button"
        label="Add New"
        icon="pi pi-plus"
        onClick={() => navigate("/pages/create")}
      />
    </div>
  );

  return (
    <Card className="shadow-1">
      <Toast ref={toast} />
      <DataTable
        value={error ? [] : pages}
        dataKey="id"
        showGridlines
        lazy
        paginator
        rows={rows}
        first={first}
        totalRecords={totalRecords}
        onPage={(e) => setFirst(e.first)}
        header={header}
        loading={isLoading}
        emptyMessage={emptyMessage}
        scrollable
        scrollHeight="flex"
      >
        <Column field="title" header="Title" style={{ minWidth: "10rem" }} />
        <Column field="url" header="URL" style={{ minWidth: "10rem" }} />
        <Column
          header="Content"
          style={{ minWidth: "14rem" }}
          body={(rowData) => previewText(rowData.content)}
        />
        <Column
          header="Action"
          body={actionBodyTemplate}
          style={{ minWidth: "10rem", width: "10rem" }}
        />
      </DataTable>
    </Card>
  );
};
