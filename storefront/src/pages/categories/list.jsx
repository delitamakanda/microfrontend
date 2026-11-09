import axiosInstance from '../../lib/api';
import { useState, useEffect } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { randomColors } from '../../constants';
import { buildCategoryLink } from './categoryFilter';
import './categories.css';

export const CategoriesPage = () => {
    const [categories, setCat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(false);
        axiosInstance.get('store/category-list/')
        .then((response) => {
            if (cancelled) return;
            if (!Array.isArray(response?.data)) {
                setError(true);
                return;
            }
            setCat(response.data.map((cat, i) => ({...cat, color: randomColors[i % randomColors.length] })));
        })
        .catch(() => {
            if (!cancelled) setError(true);
        })
        .finally(() => {
            if (!cancelled) setLoading(false);
        });
        return () => { cancelled = true; };
    }, [attempt]);

    return (
        <>
            <h1 className="sr-only">Categories</h1>
            {loading && <ProgressSpinner aria-label="Loading categories" />}
            {!loading && error && (
                <div role="alert" className="text-center my-5">
                    <p className="mb-3">Categories could not be loaded.</p>
                    <Button label="Retry" onClick={() => setAttempt((n) => n + 1)} />
                </div>
            )}
            {!loading && !error && categories.length === 0 && (
                <p className="text-center my-5">No categories yet</p>
            )}
            <div className='category'>
            {!loading && !error && categories.map((cat) => (
                <Link key={cat.uuid} to={buildCategoryLink(cat.name)} className="category--link">
                    <div className="category--name" style={{ backgroundColor: cat.color, color: '#111' }}>
                        <div className='category--box'>
                        <h2>{cat.name}</h2>
                        </div>
                    </div>
                </Link>
            ))}
            </div>
        </>
    )
}
