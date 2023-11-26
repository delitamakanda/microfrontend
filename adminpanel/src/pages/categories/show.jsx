import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Helmet } from 'react-helmet-async';

export const CategoryShow = () => {
    const navigate = useNavigate();
    const { state: { category } } = useLocation();

    const goBack = () => {
        navigate(-1)
    };

    return (
        <Card
            className="shadow-1"
            title={
                <div className="flex align-items-center">
                    <Button
                        onClick={goBack}
                        icon="pi pi-arrow-left"
                        className="mr-1"
                        text
                        severity="secondary"
                    />
                    <span>Category Details</span>
                </div>
            }
        >
            <Helmet>
                <title>Dearest. | {`${category?.name}`}</title>
            </Helmet>
            <h3>Id</h3>
            <span>{category?.uuid}</span>
            <h3>Name</h3>
            <span>{category?.name}</span>
        </Card>
    )
}
