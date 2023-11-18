import { useState } from "react"
import { Controller, useForm } from "react-hook-form";
import {Navigate} from 'react-router-dom'
import { Loading} from '../../components/core'
import { useAuth } from '../../hooks/auth/useAuth'
import { InputText} from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { classNames } from "primereact/utils";
import bg from '../../assets/bg.jpg'

export const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {token, login} = useAuth();
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

        setTimeout(async() => {
            setLoading(false);
            const { data } = await login(username, password);
            if (data && data.user && !data.user.is_staff) {
                setError('You are not admin')
            } else if (data && data.user && data.user.is_staff) {
                setError(null)
            } else {
                setError('Invalid username or password')
            }
        }, 500);
    }

    const getFormErrorMessage = (name) => {
        return errors[name]?.message? (
            <small className="p-error">{errors[name]?.message}</small>
        ) : (
            <small className="p-error">&nbsp;</small>
        );
    }
    return (
        <div className="bg-primary-reverse bg-primary-50" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
            <div className="flex justify-content-center">
                <div className="w-full lg:w-5 h-screen text-center flex justify-content-center align-items-start">
                    <div className="z-5 w-full lg:w-8 px-6 text-center mt-8" style={{maxWidth: '400px', backgroundColor: 'rgba(255,255,255,0.75)'}}>
                        <h1 className="text-4xl font-light mt-4 text-primary-500">Sign in to Admin Panel</h1>
                        <p>Welcome, please use the form to sign-in Admin Panel</p>
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
                        { error && <p className="text-danger">{error}</p> }
                    </div>
                </div>
            </div>

    
        </div>
    )
}