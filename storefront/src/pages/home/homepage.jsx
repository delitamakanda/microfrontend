import { Image } from 'primereact/image';
import { Carousel } from 'primereact/carousel';
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import axiosInstance from "../../lib/api";
import './homepage.css';

export const HomePage = () => {
    const [lastProducts, setLastProducts] = useState([]);
    const responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    useEffect(() => {
        axiosInstance.get('store/hot-products/')
           .then((response) => {
                if (response.data) {
                    setLastProducts(response.data.results)
                }
            })
           .catch((error) => {
                console.log(error);
            })
    }, []);

    const productTemplate = (product) => {
        return (
            <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
                <div className="mb-3">
                    <Link to={`${ROUTES.PRODUCTS}/${product.uuid}`}>
                        <Image src={product.image_url} width='100%' height='100%' alt={product.name} />
                    </Link>
                </div>
            </div>
        )
    };
    return (
        <div className="card">
            <Carousel value={lastProducts} responsiveOptions={responsiveOptions} numScroll={3} numVisible={3} itemTemplate={productTemplate} className='custom-carousel' />
        </div>
    )
};