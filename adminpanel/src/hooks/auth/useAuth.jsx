import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from 'storefrontApp/useLocalStorage';
import { BASE_URL } from 'storefrontApp/constants'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useLocalStorage("token", null);
    const navigate = useNavigate();
    
    
    const login = async (username, password) => {
        const response = await fetch(`${BASE_URL}auth/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            includeCredentials: true,
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const data = await response.json()

        if (response.status === 200 && data.user.is_staff) {
            setToken(data.access)
            navigate("/", { replace: true });
        }
        return data;
    };

    const logout = async () => {
        const response = await fetch(`${BASE_URL}auth/logout/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            includeCredentials: true,
        });
        
        await response.json()

        if (response.status === 200) {
            setToken(null)
            navigate("/login", { replace: true });
        }
    };
    const value = useMemo(
        () => ({
            token,
            login,
            logout
        }),
        [token]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};