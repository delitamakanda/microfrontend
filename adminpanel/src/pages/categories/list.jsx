import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { confirmDialog } from "primereact/confirmdialog";
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import axiosInstance from 'storefrontApp/api';
import { Helmet } from 'react-helmet-async';

export const CategoryList = () => {
    const navigate = useNavigate();

    const [ pageCount, setPageCount ] = useState(1);
    const [ current, setCurrent ] = useState(1);
    const [ pageSize, setPageSize ] = useState(5);
    const [ search, setSearch ] = useState('');
    const [categories, setCategories] = useState([]);
    const [isLoading, setLoading ] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const response = await axiosInstance.get(`store/category-list/`);
            setTimeout(() => {
                setLoading(false)
                setCategories(response.data)
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
                // todo delete category
                axiosInstance.delete(`store/category/${uuid}/delete/`)
                    .then(() => {
                        setCategories(categories.filter(category => category.uuid!== uuid))
                    })
            },
        });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    text
                    severity="secondary"
                    onClick={() => navigate(`/categories/edit/${rowData.uuid}`, { state: { category: rowData } })}
                />
                <Button
                    icon="pi pi-eye"
                    rounded
                    text
                    severity="secondary"
                    onClick={() => navigate(`/categories/show/${rowData.uuid}`, { state: { category: rowData } })}
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
                    <span className="p-card-title">Categories</span>
                    <Button
                        icon="pi pi-plus"
                        label="Create"
                        onClick={() => navigate("/categories/create")}
                    />
                </div>
            }
        >
            <Helmet>
                <title>Dearest. | Categories</title>
            </Helmet>
            <DataTable
                value={categories.filter(c => {
                    return c.name.toLowerCase().includes(search.toLowerCase())
                })}
                showGridlines
                dataKey="uuid"
                paginator
                rows={pageSize}
                rowsPerPageOptions={[5, 10, 25, 50]}
                first={current * pageSize - pageSize}
                totalRecords={pageCount * pageSize}
                onPage={(page) => {
                    setPageCount(Math.ceil(categories.length / page.rows))
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
                    field="name"
                    header="Name"
                    style={{ minWidth: "12rem" }}
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
