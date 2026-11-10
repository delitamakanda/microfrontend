import { useParams } from "react-router-dom";
import axiosInstance  from '../../lib/api';
import { useState, useEffect } from "react";
import { ProductCart } from "../../components/ProductCart";

export const ProductDetail = () => {
    const { id } = useParams();
    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(false);

        axiosInstance.get(`store/product/${id}/detail/`).then(res => {
            if (res?.data) setData(res.data);
            else setError(true);
        }).catch(() => {
            setError(true);
        }).finally(() => {
            setLoading(false);
        });
    },[]);

    return (
        <>
        Product Detail {id}
        {loading && <div>Loading...</div>}
        {!loading && error && <p role="alert">This product could not be loaded.</p>}
        { data && <ProductCart product={data} /> }
        </>
    )
}