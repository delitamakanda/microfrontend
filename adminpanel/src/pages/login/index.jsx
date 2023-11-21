import { useState, useRef } from "react"
import { Controller, useForm } from "react-hook-form";
import {Navigate} from 'react-router-dom'
import { Loading} from '../../components/core'
import { useAuth } from '../../hooks/auth/useAuth'
import { InputText} from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { classNames } from "primereact/utils";
import { Toast } from 'primereact/toast';

export const Login = () => {
    const [loading, setLoading] = useState(false);
    const {token, login} = useAuth();
    const toast = useRef(null);

    if (token) {
        return <Navigate to="/" replace />
     }

     const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: '',
            password: ''
        }
    });

     const onSubmit = async({username, password}) => {
        setLoading(true);

        const { data } = await login(username, password);
        if (data && data.user && !data.user.is_staff) {
            toast.current.show({ severity: 'info', summary: 'Info', detail: 'You are not admin' });
        } else if (data && data.user && data.user.is_staff) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'You are connected' });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Invalid username or password' });
        }
        setLoading(false);
    }

    const getFormErrorMessage = (name) => {
        return errors[name]?.message? (
            <small className="p-error">{errors[name]?.message}</small>
        ) : (
            <small className="p-error">&nbsp;</small>
        );
    }
    return (
        <div className="bg-primary-reverse bg-primary-50">
            <div className="flex justify-content-center">
                <div className="w-full lg:w-5 h-screen text-center flex justify-content-center align-items-start">
                    <div className="z-5 w-full lg:w-8 px-6 text-center mt-8" style={{maxWidth: '400px'}}>
                        <h1 className="text-4xl font-light mt-4 text-primary-500">Sign in</h1>
                        <h2 className="text-3xl text-primary-500">Admin Panel</h2>
                        <p>Welcome, please use the form to sign-in to Admin Panel</p>
                        <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mt-5 text-left">
                        <Controller
                        name="username"
                        control={control}
                        rules={{ required: "Username is required." }}
                        render={({ field, fieldState }) => (
                            <div className="mb-1">
                                <label htmlFor={field.name}>Username</label>
                                <InputText
                                    id={field.name}
                                    value={field.value}
                                    className={classNames("mb-1 mt-1 w-full", {
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
                        name="password"
                        control={control}
                        rules={{ required: "Password is required." }}
                        render={({ field, fieldState }) => (
                            <div className="mb-1">
                                <label htmlFor={field.name}>Password</label>
                                <InputText
                                    id={field.name}
                                    value={field.value}
                                    type="password"
                                    className={classNames("mb-1 mt-1 w-full", {
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
                            <div className="flex align-items-center justify-content-between mt-4 gap-3 mb-4">
                                <Button type="submit" label="Sign In" className="w-full" disabled={loading} loading={loading} />
                            </div>
                        </div>
                        </form>
                        {loading && <Loading />}
                        <Toast ref={toast} />
                    </div>
                </div>
            </div>

    
        </div>
    )
}