/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import axiosInstance from '../../lib/api';
import { ROUTES } from '../../constants';
import { formatDateTime, formatPrice } from '../../helpers/formatters';
import { PAGE_SIZE, buildOrdersQuery, getPageCount, normalizeOrdersResponse } from './orderHelpers';

const linkClass = "text-indigo-700 underline focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-700";

// Dark text on light backgrounds (the default Tag colours fail AA); the label carries the status, not the colour.
const TAG_CLASSES = {
    success: '!bg-green-100 !text-green-900',
    info: '!bg-blue-100 !text-blue-900',
    warning: '!bg-amber-100 !text-amber-900',
    danger: '!bg-red-100 !text-red-900',
};

const StatusTag = ({ order }) => (
    <Tag value={order.status} className={`border border-current ${TAG_CLASSES[order.severity] ?? '!bg-gray-100 !text-gray-900'}`} />
);

const dateOf = (order) => (order.date ? formatDateTime(order.date) : '—');

export const OrderPage = () => {
    const [page, setPage] = useState(0);
    const [state, setState] = useState({ status: 'loading', data: null });
    const [attempt, setAttempt] = useState(0);

    const retry = useCallback(() => {
        setState({ status: 'loading', data: null });
        setAttempt((n) => n + 1);
    }, []);

    useEffect(() => {
        let cancelled = false;
        axiosInstance
            .get('store/customers-order/', { params: buildOrdersQuery({ page, pageSize: PAGE_SIZE }) })
            .then((response) => {
                if (cancelled) return;
                const data = normalizeOrdersResponse(response?.data);
                setState(data ? { status: 'ready', data } : { status: 'error', data: null });
            })
            .catch(() => {
                if (!cancelled) setState({ status: 'error', data: null });
            });
        return () => { cancelled = true; };
    }, [page, attempt]);

    const goTo = (next) => {
        setState((s) => ({ ...s, status: 'loading' }));
        setPage(next);
    };

    const { status, data } = state;
    const pageCount = data ? getPageCount(data.total, PAGE_SIZE) : 1;

    return (
        <div className="mx-auto max-w-4xl px-4 py-8" aria-busy={status === 'loading'}>
            <h1 className="text-3xl font-bold text-gray-900">My orders</h1>

            {status === 'loading' && !data && (
                <div className="flex justify-center py-12" role="status">
                    <ProgressSpinner aria-label="Loading your orders" style={{ width: '50px', height: '50px' }} />
                </div>
            )}

            {status === 'error' && (
                <div role="alert" className="mt-6 rounded border border-red-700 bg-red-50 p-4 text-red-900">
                    <p>Unable to load your orders.</p>
                    <Button type="button" label="Retry" icon="pi pi-refresh" className="mt-3 min-h-[44px]" onClick={retry} />
                </div>
            )}

            {data && status !== 'error' && data.orders.length === 0 && page === 0 && (
                <div className="py-12 text-center">
                    <p className="text-lg text-gray-900">You have no orders yet.</p>
                    <Link to={ROUTES.PRODUCTS} className={`mt-4 inline-block ${linkClass}`}>Browse products</Link>
                </div>
            )}

            {data && status !== 'error' && data.orders.length === 0 && page > 0 && (
                <div className="py-12 text-center">
                    <p className="text-lg text-gray-900">No orders on this page.</p>
                    <Button type="button" label="Back to first page" className="mt-4 min-h-[44px]" onClick={() => goTo(0)} />
                </div>
            )}

            {data && status !== 'error' && data.orders.length > 0 && (
                <div className={status === 'loading' ? 'opacity-60' : ''}>
                    <table className="mt-6 hidden w-full text-left sm:table">
                        <caption className="sr-only">Your orders, newest first</caption>
                        <thead>
                            <tr className="border-b border-gray-400 text-sm text-gray-900">
                                <th scope="col" className="py-2 pr-3">Order</th>
                                <th scope="col" className="py-2 pr-3">Date</th>
                                <th scope="col" className="py-2 pr-3">Status</th>
                                <th scope="col" className="py-2 pr-3 text-right">Total</th>
                                <th scope="col" className="py-2">Shipping address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.orders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-300 align-top">
                                    <th scope="row" className="py-3 pr-3 font-mono font-bold">#{order.reference}</th>
                                    <td className="py-3 pr-3">{dateOf(order)}</td>
                                    <td className="py-3 pr-3"><StatusTag order={order} /></td>
                                    <td className="py-3 pr-3 text-right">{formatPrice(order.total)}</td>
                                    <td className="break-words py-3">{order.address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <ul className="mt-6 flex flex-col gap-4 sm:hidden" aria-label="Your orders, newest first">
                        {data.orders.map((order) => (
                            <li key={order.id} className="rounded border border-gray-300 p-4">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-mono font-bold">Order #{order.reference}</span>
                                    <StatusTag order={order} />
                                </div>
                                <div className="mt-2 text-gray-800">{dateOf(order)}</div>
                                <div className="mt-1 font-bold text-gray-900">{formatPrice(order.total)}</div>
                                {order.address && <div className="mt-1 break-words text-gray-800">{order.address}</div>}
                            </li>
                        ))}
                    </ul>

                    <nav aria-label="Orders pagination" className="mt-6 flex flex-wrap items-center justify-between gap-3">
                        <Button
                            type="button"
                            label="Previous"
                            icon="pi pi-chevron-left"
                            outlined
                            className="min-h-[44px]"
                            disabled={!data.hasPrev || status === 'loading'}
                            onClick={() => goTo(page - 1)}
                        />
                        <span aria-live="polite">Page {page + 1} of {pageCount}</span>
                        <Button
                            type="button"
                            label="Next"
                            icon="pi pi-chevron-right"
                            iconPos="right"
                            outlined
                            className="min-h-[44px]"
                            disabled={!data.hasNext || status === 'loading'}
                            onClick={() => goTo(page + 1)}
                        />
                    </nav>
                </div>
            )}
        </div>
    );
};
