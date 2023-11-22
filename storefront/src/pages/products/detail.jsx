import { useParams } from "react-router-dom";
import axiosInstance  from '../../lib/api';
import { useState, useEffect } from "react";
import { ProductCart } from "../../components/ProductCart";

export const ProductDetail = () => {
    const { id } = useParams();
    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    
    useEffect(() => {
        setLoading(true);

        axiosInstance.get(`store/product/${id}/detail/`).then(res => {
            setData(res.data);
            setLoading(false);
        });
    },[]);

    return (
        <>
        Product Detail {id}
        {loading && <div>Loading...</div>}
        { data && <ProductCart product={data} /> }
        </>
    )
}