import { KpiCard, ChartView, RecentSales } from '../../components/dashboard';
import daysjs from 'dayjs';
import axiosInstance from 'storefrontApp/api';
import { useState, useEffect } from "react";

const query = {
    start: daysjs().subtract(7, 'days').startOf('day'),
    end: daysjs().endOf('day')

}

export const Dashboard = () => {
    const [dailyRevenues, setDailyRevenues] = useState(null);
    const [dailyOrders, setDailyOrders] = useState(null);
    const [newCustomers, setNewCustomers] = useState(null);
    const [, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(false);
        Promise.all([
            axiosInstance.get('store/dailyRevenue/'),
            axiosInstance.get('store/dailyOrders/'),
            axiosInstance.get('store/newCustomers/'),
        ]).then(([dailyRevenues, dailyOrders, newCustomers]) => {
            // An older remote resolves to undefined on HTTP errors.
            if (dailyRevenues && dailyOrders && newCustomers) {
                setDailyRevenues(dailyRevenues?.data);
                setDailyOrders(dailyOrders?.data);
                setNewCustomers(newCustomers?.data);
            } else {
                setError(true);
            }
        }).catch(() => {
            setError(true);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    return (
        <div className='grid'>
            {error && (
                <div className='col-12'>
                    <p role="alert" className="p-3 m-0 border-round surface-card text-red-700">
                        The dashboard statistics could not be loaded.
                    </p>
                </div>
            )}
            <div className='col-12 lg:col-6 xl:col-4'>
                <KpiCard title="Weekly Revenue" color="blue-300" total={dailyRevenues?.total ?? 0} trend={dailyRevenues?.trend ?? 0} formatTotal={(value) => `$ ${value}`} icon="pi-dollar" />
            </div>
            <div className='col-12 lg:col-6 xl:col-4'>
                <KpiCard title="Weekly Orders" color="orange-300" total={dailyOrders?.total ?? 0} trend={dailyOrders?.trend ?? 0} icon="pi-shopping-cart" />
            </div>
            <div className='col-12 lg:col-6 xl:col-4'>
                <KpiCard title="New Customers" color="green-300" total={newCustomers?.total ?? 0} trend={newCustomers?.trend ?? 0} icon="pi-users" />
            </div>
            <div className='col-12'>
                <ChartView revenue={dailyRevenues?.data ?? []} orders={dailyOrders?.data ?? []} customers={newCustomers?.data ?? []} />
            </div>
            <div className='col-12'>
                <RecentSales />
            </div>
        </div>
    )
}
