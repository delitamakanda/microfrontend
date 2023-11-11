import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { confirmDialog } from "primereact/confirmdialog";
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

export const ProductList = () => {
    const navigate = useNavigate();

    const [ pageCount, setPageCount ] = useState(1);
    const [ current, setCurrent ] = useState(1);
    const [ pageSize, setPageSize ] = useState(10);
    const [ search, setSearch ] = useState('');
    const [products, setProductList] = useState([]);
    const [isLoading, setLoading ] = useState(false)
    const [nextUrl, setNextUrl] = useState('store/product/?ordering=-created_at')

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const response = await axiosInstance.get(nextUrl);
            // setNextUrl(response.next)
            setProductList(response.data.results)
            setTimeout(() => {
                setLoading(false)
            }, 0)
        }
        fetchData()
    }, [])

    const confirmDeleteProduct = (uuid) => {
        confirmDialog({
            message: "Do you want to delete this record?",
            header: "Delete Confirmation",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            accept: () => {
                // todo delete product
            },
        })
    };

    const amountBodyTemplate = (rowData) => {
        return formatCurrency(+rowData.price);
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
                <Button
                    icon="pi pi-trash"
                    rounded
                    text
                    severity="danger"
                    onClick={() => confirmDeleteProduct(rowData.uuid)}
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
                    setCurrent(1)
                    setSearch('')
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
            value={products.filter(p => {
                return p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
            })}
            showGridlines
            dataKey="uuid"
            paginator
            rows={pageSize}
            rowsPerPageOptions={[5, 10, 25, 50]}
            first={current * pageSize - pageSize}
            totalRecords={pageCount * pageSize}
            onPage={(page) => {
                setPageCount(Math.ceil(products.length / page.rows))
                setPageSize(page.rows)
                setCurrent((page.page ?? 0) + 1);
            }}
            header={header}
            loading={isLoading}
        >
            <Column
                field="uuid"
                header="Uuid"
                sortable
                style={{ minWidth: "1rem", width: "10rem" }}
            />
            <Column
                field="image_url"
                header="Image"
                style={{ minWidth: "1rem", width: "10rem" }}
                body={imageBodyTemplate}
                sortable
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
                field="status"
                header="Status"
                body={statusBodyTemplate}
                style={{ minWidth: "1rem", width: "10rem" }}
                sortable
            />
            <Column
                body={actionBodyTemplate}
                header="Actions"
                align="center"
                style={{ minWidth: "15rem", width: "15rem" }}
            />
        </DataTable>
    </Card>
    )
}
