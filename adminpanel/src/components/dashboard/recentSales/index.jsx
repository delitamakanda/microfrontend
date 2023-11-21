import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useEffect, useState } from "react";
import axiosInstance from 'storefrontApp/api';


export const RecentSales = () => {
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
        sortField: null,
        sortOrder: null
    })

    let networkTimeout = null;

    useEffect(() => {
        fetchLazyData();
        const timeout = setTimeout(() => {
            setDebounceSearch(search);
        }, 500);
        return () => clearTimeout(timeout);
    }, [lazyState, search, 500]);

    const fetchLazyData = () => {
        setLoading(true);
        if (networkTimeout) {
            clearTimeout(networkTimeout);
        }

        networkTimeout = setTimeout(() => {
            axiosInstance.get(`store/order/?q=${search}&limit=${lazyState.rows}&offset=${lazyState.first}&ordering=${lazyState.sortOrder}${lazyState.sortField}`)
              .then(response => {
                    setPageCount(response.data.count)
                    setData(response.data)
                    setTimeout(() => {
                        setLoading(false)
                    }, 0)
                })
        }, 1000);
        
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };
    const formatDateTime = (value) => {
        return value.toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
    };
    const getSeverity = (status) => {
        switch (status) {
            case 'Pending':
                return 'warning';
            case 'Shipped':
                return'success';
            case 'Cancelled':
                return 'danger';
            default:
                return 'info';
        }
    }

    const amountBodyTemplate = (rowData) => {
        return formatCurrency(rowData.total_amount);
    }
    const statusBodyTemplate = (rowData) => {
        return (
            <Tag severity={getSeverity(rowData.status)} value={rowData.status} />           
        );
    };
    const dateBodyTemplate = (rowData) => {
        return formatDateTime(new Date(rowData.order_date));
    };
    const header = (
        <div className='flex justify-content-between'>
            <Button type='button' icon='pi pi-filter-slash' label='Clear' outlined onClick={() => {
                    setSearch('')
                    setLazyState({
                        first: 0,
                        rows: 10,
                        total: 0,
                        page: 1,
                    })
                }} />
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
    )
    const onPage = (event) => {
        setLazyState(event)
    };

    const onSort = (event) => {
        event.sortOrder === 1 ? setLazyState({...lazyState, sortField: event.sortField, sortOrder: '' }) : setLazyState({...lazyState, sortField: event.sortField, sortOrder:  '-' })
    };
    return (
        <Card className='shadow-l' title="Recent Sales">
            <DataTable
            value={data && data.results}
            dataKey='uuid'
            paginator
            lazy
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            onPage={onPage}
            onSort={onSort}
            sortField={lazyState.sortField}
            sortOrder={lazyState.sortOrder}
            first={lazyState.first}
            rows={lazyState.rows}
            filterDisplay="row"
            header={header}
            totalRecords={pageCount}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport" currentPageReportTemplate={"total " + ":" + pageCount + " entries"}
            loading={isLoading}
            >
                <Column field="uuid" header="uuid" sortable style={{minWidth: '2rem'}} />
                <Column field="total_amount" header="Amount" body={amountBodyTemplate} sortable />
                <Column field="user.email" header="Ordered By" style={{minWidth: '10rem'}} />
                <Column field="user.profile.gender" header="Gender" />
                <Column field="user.profile.phone_number" header="Phone number" style={{minWidth: '12rem'}} />
                <Column field="shipping_address" header="Delivery Address" style={{minWidth: '16rem'}} sortable />
                <Column field="status" header="Delivery Status" align="center" body={statusBodyTemplate} style={{minWidth: '10rem'}} sortable />
                <Column field="order_date" header="Created at" body={dateBodyTemplate} style={{minWidth: '12rem'}} sortable />
            </DataTable>
        </Card>
    )
}