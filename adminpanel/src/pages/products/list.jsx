import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Image } from 'primereact/image';
import { Tag } from 'primereact/tag';
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import axiosInstance from 'storefrontApp/api';

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    })
}

const formatDateTime = (value) => {
    return value.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
};

export const ProductList = () => {
    const navigate = useNavigate();

    const [ pageCount, setPageCount ] = useState(1);
    const [ search, setSearch ] = useState('');
    const [ debounceSearch, setDebounceSearch ] = useState('');
    const [data, setData] = useState([]);
    const [isLoading, setLoading ] = useState(false)
    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 10,
        total: 0,
        page: 1,
        sortField: 'created_at',
        sortOrder: '-'
    })

    let networkTimeout = null;

    useEffect(() => {
        fetchLazyData();
        const timeout = setTimeout(() => {
            setDebounceSearch(search);
        }, 500);
        return () => clearTimeout(timeout);
    }, [lazyState, search, 500])

    const fetchLazyData = () => {
        setLoading(true);
        if (networkTimeout) {
            clearTimeout(networkTimeout);
        }

        networkTimeout = setTimeout(() => {
            axiosInstance.get(`store/product/?q=${search}&limit=${lazyState.rows}&offset=${lazyState.first}&ordering=${lazyState.sortOrder}${lazyState.sortField}`)
              .then(response => {
                    setPageCount(response.data.count)
                    setData(response.data)
                    setTimeout(() => {
                        setLoading(false)
                    }, 0)
                })
        }, 1000);
        
    }


    const amountBodyTemplate = (rowData) => {
        return formatCurrency(+rowData.price);
    };

    const dateBodyTemplate = (rowData) => {
        return formatDateTime(new Date(rowData.created_at));
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <Image
                src={rowData.image_url}
                alt={rowData.name}
                width="100%"
                height="100%"
            />
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    text
                    severity="secondary"
                    onClick={() => navigate(`/products/edit/${rowData.uuid}`)}
                />
                <Button
                    icon="pi pi-eye"
                    rounded
                    text
                    severity="secondary"
                    onClick={() => navigate(`/products/show/${rowData.uuid}`)}
                />
            </>
        );
    };

    const statusBodyTemplate = (product) => {
        return <Tag value={product.status} severity={getSeverity(product)}></Tag>;
    };

    const getSeverity = (product) => {
        switch (product.status) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const header = (
        <div className="flex justify-content-between">
            <Button
                type="button"
                icon="pi pi-filter-slash"
                label="Clear"
                outlined
                onClick={() => {
                    setSearch('')
                    setLazyState({
                        first: 0,
                        rows: 10,
                        total: 0,
                        page: 1,
                    })
                }}
            />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setLazyState({
                            first: 0,
                            rows: 10,
                            total: 0,
                            page: 1,
                        })
                    }}
                    placeholder="Keyword Search"
                />
            </span>
        </div>
    );

    const onPage = (event) => {
        setLazyState(event)
    };

    const onSort = (event) => {
        event.sortOrder === 1 ? setLazyState({...lazyState, sortField: event.sortField, sortOrder: '' }) : setLazyState({...lazyState, sortField: event.sortField, sortOrder:  '-' })
    };



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
        <DataTable
            value={data && data.results}
            lazy={true}
            showGridlines
            dataKey="uuid"
            paginator
            rows={lazyState.rows}
            filterDisplay="row"
            rowsPerPageOptions={[5, 10, 25, 50]}
            onPage={onPage}
            onSort={onSort}
            sortField={lazyState.sortField}
            sortOrder={lazyState.sortOrder}
            first={lazyState.first}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate={"total " + ":" + pageCount + " entries"}
            totalRecords={pageCount}
            header={header}
            loading={isLoading}
        >
            <Column
                field="uuid"
                header="Uuid"
                style={{ minWidth: "1rem", width: "10rem" }}
                sortable
            />
            <Column
                field="image_url"
                header="Image"
                style={{ minWidth: "1rem", width: "10rem" }}
                body={imageBodyTemplate}
            />
            <Column
                field="name"
                header="Name"
                style={{ minWidth: "12rem" }}
                sortable
            />
            <Column
                field="price"
                header="Price"
                body={amountBodyTemplate}
                style={{ minWidth: "1rem", width: "10rem" }}
                sortable
            />
            <Column
                field="stock_quantity"
                header="Status"
                body={statusBodyTemplate}
                style={{ minWidth: "1rem", width: "10rem" }}
                sortable
            />
            <Column field="created_at" header="Created at" body={dateBodyTemplate} style={{minWidth: '12rem'}} sortable />
            <Column
                body={actionBodyTemplate}
                header="Actions"
                align="center"
                style={{ minWidth: "12rem", width: "12rem" }}
            />
        </DataTable>
    </Card>
    )
}
