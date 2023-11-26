import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Image } from "primereact/image";
import { classNames } from "primereact/utils";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from 'storefrontApp/api';
import { Helmet } from 'react-helmet-async';

export const ProductEdit = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            stock_quantity: 0,
            image_url: '',
            category: null
        }
    });

    useEffect(() => {
        Promise.all([
            axiosInstance.get(`store/category-list/`),
            axiosInstance.get(`store/product/${id}/detail/`)
        ]).then(([categoryList, productDetail]) => {
            setCategoryOptions(categoryList.data.map((category) => (`(${category.uuid}) - ${category.name}`)));
            let defaultValues = {};
            defaultValues.name = productDetail?.data?.name;
            defaultValues.description = productDetail?.data?.description;
            defaultValues.price = productDetail?.data?.price;
            defaultValues.stock_quantity = productDetail?.data?.stock_quantity;
            defaultValues.image_url = productDetail?.data?.image_url;
            const selectedCategory = categoryList.data.find((category) => category?.uuid === productDetail?.data?.category);
            defaultValues.category = `(${selectedCategory?.uuid}) - ${selectedCategory?.name}`?? null;
            reset(defaultValues);
        });
    }, []);

    const onSubmit = async (data) => {
        setLoading(true)

        const response = await axiosInstance.put(`store/product/${id}/detail/`, JSON.stringify({
            name: data.name,
            description: data.description,
            price: data.price,
            stock_quantity: data.stock_quantity,
            image_url: data.image_url,
            category: data.category.replace(/^[^(]*\(/, "").replace(/\)[^(]*$/, "").split(/\)[^(]*\(/).join(/\)/)
        }));

        if (response.status === 200) {
            setLoading(false)
        }
    }

    const goBack = () => {
        navigate(-1);
    }

    const getFormErrorMessage = (name) => {
        return errors[name]? (
            <small className="p-error">{errors[name]?.message}</small>
        ) : (
            <small className="p-error">&nbsp;</small>
        );
    };

    return (
        <Card
            className="shadow-1"
            title={
                <div className="flex justify-content-between align-items-center">
                    <div className="flex align-items-center">
                        <Button
                            onClick={goBack}
                            icon="pi pi-arrow-left"
                            className="mr-1"
                            text
                            severity="secondary"
                        />
                        <span>Edit Product</span>
                    </div>
                    <Button
                        label="Refresh"
                        icon="pi pi-refresh"
                        outlined
                        onClick={() => void(0)}
                    />
                </div>
            }
        >
            <Helmet>
                <title>{`Dearest | Product no. ${id}`}</title>
            </Helmet>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid">
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: "Name is required." }}
                        render={({ field, fieldState }) => (
                            <div className="mb-1">
                                <label htmlFor={field.name}>Name</label>
                                <InputText
                                    id={field.name}
                                    value={field.value}
                                    className={classNames("mb-1 mt-1", {
                                        "p-invalid": fieldState.error,
                                    })}
                                    onChange={(e) =>
                                        field.onChange(e.target.value)
                                    }
                                />
                                {getFormErrorMessage(field.name)}
                            </div>
                        )}
                    />
                    <Controller
                        name="image_url"
                        control={control}
                        rules={{ required: "Image URL is required." }}
                        render={({ field, fieldState }) => (
                            <div className="mb-1">
                                <Image src={field.value} alt={field.value} width="88px" />
                                <label htmlFor={field.name}>Image Url</label>
                                <InputText
                                    id={field.name}
                                    value={field.value}
                                    className={classNames("mb-1 mt-1", {
                                        "p-invalid": fieldState.error,
                                    })}
                                    onChange={(e) =>
                                        field.onChange(e.target.value)
                                    }
                                />
                                {getFormErrorMessage(field.name)}
                            </div>
                        )}
                    />
                    <Controller
                        name="stock_quantity"
                        control={control}
                        rules={{
                            required: "Quantity is required.",
                        }}
                        render={({ field, fieldState }) => (
                            <div className="mb-1">
                                <label htmlFor={field.name}>Quantity</label>
                                <InputNumber
                                    id={field.name}
                                    inputRef={field.ref}
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChange={(e) =>
                                        field.onChange(e.value ?? 0)
                                    }
                                    inputClassName={classNames({
                                        "p-invalid": fieldState.error,
                                    })}
                                    className="mb-1 mt-1"
                                />
                                {getFormErrorMessage(field.name)}
                            </div>
                        )}
                    />
                    <Controller
                        name="price"
                        control={control}
                        rules={{
                            required: "Price is required.",
                        }}
                        render={({ field, fieldState }) => (
                            <div className="mb-1">
                                <label htmlFor={field.name}>Price</label>
                                <InputNumber
                                    id={field.name}
                                    inputRef={field.ref}
                                    value={field.value}
                                    onBlur={field.onBlur}
                                    onChange={(e) =>
                                        field.onChange(e.value ?? 0)
                                    }
                                    useGrouping={false}
                                    mode="currency"
                                    currency="USD"
                                    locale="en-US"
                                    inputClassName={classNames({
                                        "p-invalid": fieldState.error,
                                    })}
                                    className="mb-1 mt-1"
                                />
                                {getFormErrorMessage(field.name)}
                            </div>
                        )}
                    />
                    <Controller
                        name="category"
                        control={control}
                        rules={{ required: "Category is required." }}
                        render={({ field, fieldState }) => (
                            <div className="mb-1">
                                <label htmlFor={field.name}>Category</label>
                                <Dropdown
                                    id={field.name}
                                    value={field.value}
                                    placeholder="Select a Category"
                                    options={categoryOptions}
                                    focusInputRef={field.ref}
                                    onChange={(e) => field.onChange(e.value)}
                                    className={classNames("mb-1 mt-1", {
                                        "p-invalid": fieldState.error,
                                    })}
                                />
                                <small className="p-error">&nbsp;</small>
                                <small className="p-error">
                                    {errors.category?.message}
                                </small>
                            </div>
                        )}
                    />
                    <Controller
                        name="description"
                        control={control}
                        rules={{ required: "Description is required." }}
                        render={({ field, fieldState }) => (
                            <div className="mb-1">
                                <label htmlFor={field.name}>Description</label>
                                <InputTextarea
                                    id={field.name}
                                    {...field}
                                    rows={4}
                                    cols={30}
                                    className={classNames("mb-1 mt-1", {
                                        "p-invalid": fieldState.error,
                                    })}
                                />
                                {getFormErrorMessage(field.name)}
                            </div>
                        )}
                    />
                </div>
                <div className="flex justify-content-end">
                    <Button label="Save" type="submit" loading={loading} />
                </div>
            </form>
        </Card>
    )
}

