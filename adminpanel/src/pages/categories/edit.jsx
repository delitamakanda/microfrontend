import { Controller, useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from 'storefrontApp/api';

export const CategoryEdit = () => {
    const navigate = useNavigate();
    const { state: { category: { uuid , name }} } = useLocation();
    const [loading, setLoading] = useState(false);
    
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: ''
        }
    });

    useEffect(() => {
        let defaultValues = {};
        defaultValues.name = name;
        reset(defaultValues);
    }, [])
    

    const onSubmit = async (data) => {
        setLoading(true)

        const response = await axiosInstance.put(`store/category/${uuid}/`, data);

        if (response.status === 200) {
            setLoading(false)
        }
    };

    const goBack = () => {
        navigate(-1)
    };

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
                        <span>Edit Category</span>
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid">
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: "Name is required.", min: 3, maxLength: 80 }}
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
                </div>
                <div className="flex justify-content-end">
                    <Button label="Save" type="submit" loading={loading} />
                </div>
            </form>
        </Card>
    )
}
