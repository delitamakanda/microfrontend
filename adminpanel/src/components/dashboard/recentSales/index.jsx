import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { Button } from 'primereact/button';


export const RecentSales = () => {
    const [ pageCount, setPageCount ] = useState(1);
    const [ current, setCurrent ] = useState(1);
    const [ pageSize, setPageSize ] = useState(10);
    const [ search, setSearch ] = useState('');
    const [ sortField, setSortField ] = useState('');
    const [ sortOrder, setSortOrder ] = useState('');

    const orders = [];
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
        return formatCurrency(rowData.amount);
    }
    const statusBodyTemplate = (rowData) => {
        return (
            <Tag severity={getSeverity(rowData.status)} value={rowData.status} />           
        );
    };
    const dateBodyTemplate = (rowData) => {
        return formatDateTime(new Date(rowData.date));
    };
    const header = (
        <div className='flex justify-content-between'>
            <Button type='button' icon='pi pi-filter-slash' label='Clear' outlined onClick={() => { setCurrent(1); setSortField([], 'replace')}} />
        </div>
    )
    return (
        <Card className='shadow-l' title="Recent Sales">
            <DataTable
            value={orders}
            dataKey='id'
            paginator
            lazy
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            totalRecords={pageCount * pageSize}
            rows={pageSize}
            first={current * pageSize - pageSize}
            onPage={(event) => {
                setCurrent(event.page ?? 0) + 1;
                setPageSize(event.rows)
            }}
            header={header}
            >
                <Column field="id" header="id" sortable style={{minWidth: '2rem'}} />
                <Column field="amount" header="Amount" body={amountBodyTemplate} sortable />
                <Column field="user.fullName" header="Ordered By" style={{minWidth: '10rem'}} sortable />
                <Column field="user.gender" header="Gender" sortable />
                <Column field="user.phone" header="Phone number" style={{minWidth: '12rem'}} sortable />
                <Column field="user.address" header="Delivery Address" style={{minWidth: '16rem'}} sortable />
                <Column field="status" header="Delivery Status" align="center" body={statusBodyTemplate} style={{minWidth: '10rem'}} sortable />
                <Column field="date" header="Created at" body={dateBodyTemplate} style={{minWidth: '12rem'}} sortable />
            </DataTable>
        </Card>
    )
}