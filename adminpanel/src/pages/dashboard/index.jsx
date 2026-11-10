import { KpiCard, ChartView, RecentSales } from '../../components/dashboard';
import axiosInstance from 'storefrontApp/api';
import { Button } from "primereact/button";
import { useState, useEffect, useCallback } from "react";
import { normalizeStats } from "./stats";

export const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        setError(false);
        return Promise.all([
            axiosInstance.get('store/dailyRevenue/'),
            axiosInstance.get('store/dailyOrders/'),
            axiosInstance.get('store/newCustomers/'),
        ]).then((responses) => {
            // An older remote resolves to undefined on HTTP errors.
            const result = normalizeStats(responses);
            if (result.status === 'ok') {
                setStats(result);
            } else {
                setError(true);
            }
        }).catch(() => {
            setError(true);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const { revenue, orders, customers } = stats ?? {};

    return (
        <div className='grid'>
            {error && (
                <div className='col-12'>
                    <div className="flex flex-wrap align-items-center gap-3 p-3 border-round surface-card">
                        <p role="alert" className="m-0 text-red-700">
                            The dashboard statistics could not be loaded.
                        </p>
                        <Button type="button" label="Retry" icon="pi pi-refresh" size="small" onClick={load} />
                    </div>
                </div>
            )}
            <div className='col-12 lg:col-6 xl:col-4'>
                <KpiCard title="Weekly Revenue" color="blue-300" loading={loading} total={revenue?.total ?? 0} trend={revenue?.trend ?? 0} formatTotal={(value) => `$ ${value}`} icon="pi-dollar" />
            </div>
            <div className='col-12 lg:col-6 xl:col-4'>
                <KpiCard title="Weekly Orders" color="orange-300" loading={loading} total={orders?.total ?? 0} trend={orders?.trend ?? 0} icon="pi-shopping-cart" />
            </div>
            <div className='col-12 lg:col-6 xl:col-4'>
                <KpiCard title="New Customers" color="green-300" loading={loading} total={customers?.total ?? 0} trend={customers?.trend ?? 0} icon="pi-users" />
            </div>
            <div className='col-12'>
                <ChartView revenue={revenue?.data ?? []} orders={orders?.data ?? []} customers={customers?.data ?? []} />
            </div>
            <div className='col-12'>
                <RecentSales />
            </div>
        </div>
    )
}
