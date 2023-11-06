import { useState } from "react"
import {Navigate} from 'react-router-dom'
import { Loading} from '../../components/core'
import { useAuth } from '../../hooks/auth/useAuth'
import { InputText} from 'primereact/inputtext'
import { Button } from 'primereact/button'

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {token, login} = useAuth();
    if (token) {
        return <Navigate to="/" replace />
     }

     const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(async() => {
            setLoading(false);
            const data = await login(username, password);
            if (data && data.user && !data.user.is_staff) {
                setError('You are not admin')
            } else {
                setError(JSON.stringify(data))
            }
        }, 500);
    }
    return (
        <div className="bg-primary-reverse bg-primary-50">
            <div className="flex justify-content-center">
                <div className="w-full lg:w-5 h-screen text-center flex justify-content-center align-items-start">
                    <div className="z-5 w-full lg:w-8 px-6 text-center mt-8" style={{maxWidth: '400px'}}>
                        <h1 className="text-4xl font-light mt-4 text-primary-500">Sign in to Admin Panel</h1>
                        <p>Welcome, please use the form to sign-in Admin Panel</p>
                        <form onSubmit={handleSubmit}>
                        <div className="mt-5 text-left">
                            <label htmlFor="username" className="block mb-2">Username</label>
                            <span className="p-input-icon-right block">
                                <i className="pi pi-user"></i>
                                <InputText type="text" className="w-full" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </span>
                            <label htmlFor="password" className="block mb-2 mt-3">Password</label>
                            <span className="p-input-icon-right block">
                                <i className="pi pi-lock"></i>
                                <InputText type="password" className="w-full" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </span>
                            <div className="flex align-items-center justify-content-between mt-4 gap-3">
                                <Button type="submit" label="Sign In" className="w-full" disabled={loading} loading={loading} />
                            </div>
                        </div>
                        </form>
                        {loading && <Loading />}
                        {error && <div>{error}</div>}
                    </div>
                </div>
            </div>

    
        </div>
    )
}