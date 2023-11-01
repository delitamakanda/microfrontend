import { useState } from "react"
import {Navigate} from 'react-router-dom'
import { useAuth } from '../../hooks/auth/useAuth'

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {token, login} = useAuth();
    if (token) {
        return <Navigate to="/" replace />
     }

    const handleSubmit = (e) => {
        login(password)
        e.preventDefault();
    }
    return (
        <div className="">
            <h1>Sign in</h1>

            <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                <input type="text" name="username" onChange={(e) => setUsername(e.target.value) } />
                <input type="text" name="password" onChange={(e) => setPassword(e.target.value) } />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}