import axiosInstance from '../../lib/api';
import { useState, useMemo } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Link } from 'react-router-dom';
import { randomColors } from '../../constants'; 
import './categories.css';

export const CategoriesPage = () => {
    const [categories, setCat] = useState([]);
    const [loading, setLoading] = useState(false);


    useMemo(() => {
        setLoading(true)
        axiosInstance.get('store/category-list/')
        .then((response) => {
            const data = response.data.map((cat, i) => ({...cat, color: randomColors[i] }));
            setCat(data);
            setLoading(false)
        })
        .catch((err) => {
            setLoading(false);
            throw err;
        })
    }, []);
    return (
        <>
            {loading && <ProgressSpinner />}
            <div className='category'>
            {!loading && categories?.map((cat) => (
                <Link key={cat.uuid} to={'/products'}>
                    <div className="category--name" style={{ backgroundColor: cat.color }}>
                        <div className='category--box'>
                        <h1>{cat.name}</h1>
                        </div>
                    </div>
                </Link>
            ))}
            </div>
        </>
    )
}