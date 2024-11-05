import { DataTable } from  "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "storefrontApp/api";

export const UserList = () => {
    const navigate = useNavigate();

    const [pageCount, setPageCount] = useState(1);
    const [search, setSearch] = useState("");
    const [debounceSearch, setDebounceSearch] = useState('');
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 10,
        total: 0,
        page: 1,
    });

    let networkTimeout;
    useEffect(() => {
        fetchData();
        const timeout = setTimeout(() => {
            setDebounceSearch(search);
        }, 500);
        return () => clearTimeout(timeout);
    }, [lazyState, search]);

    const fetchData = () => {
        setLoading(true);
        if (networkTimeout) {
            clearTimeout(networkTimeout);
        }

        networkTimeout = setTimeout(() => {
            axiosInstance
               .get(`store/user/?q=${search}&limit=${lazyState.rows}&offset=${lazyState.first}`, {
                })
               .then((response) => {
                   setPageCount(response.data.count);
                   setData(response.data);

                    setTimeout(() => {
                        setLoading(false);
                    }, 0)
                })
               .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        }, 1000);
    }
    const header = (
        <div className="p-grid p-justify-content-between">
            <div className="p-col-12 p-md-12">
                <InputText
                    placeholder="Search Users"
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
                />
            </div>
        </div>
    );

    const onPageChange = (event) => {
        setLazyState(event);
    }

    const onSort = (event) => {
        setLazyState(event);
    }

    const displayRole = (rowData) => {
        console.log(rowData);
        if (rowData.is_staff) {
            return <Tag value="Staff" className="p-tag p-tag-success" />;
        } else {
            return <Tag value="User" className="p-tag p-tag-info" />;
        }
    }

    const displayActive = (rowData) => {
        if (rowData.is_active) {
            return <Tag value="Active" className="p-tag p-tag-success" />;
        } else {
            return <Tag value="Inactive" className="p-tag p-tag-danger" />;
        }
    }

    const formatDate = (rowData) => {
        const date = new Date(rowData.date_joined);
        return date.toLocaleDateString('en-US');
    }

    return (
        <Card className="shadow-1" title={
            <div className="p-grid p-justify-content-between">
                <h4>Users</h4>
            </div>
        }>
            <DataTable
                header={header}
                value={data && data.results}
                lazy={true}
                showGridlines
                dataKey="email"
                filterDisplay="row"
                rowsPerPageOptions={[5, 10, 20, 50]}
                paginator={true}
                rows={lazyState.rows}
                first={lazyState.first}
                totalRecords={pageCount}
                onPage={onPageChange}
                onSort={onSort}
                sortField={lazyState.sortField}
                loading={isLoading}
            >
                <Column field="first_name" header="First Name" sortable={true}  />
                <Column field="username" header="User" sortable={true} />
                <Column field="email" header="Email" sortable={true} />
                <Column field="is_staff" header="Role" sortable={true} body={displayRole} />
                <Column field="date_joined" header="Date Joined" sortable={true} body={formatDate} />
                <Column field="is_active" header="Active" sortable={true} body={displayActive} />
            </DataTable>
        </Card>
    );
}