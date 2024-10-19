import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "storefrontApp/useLocalStorage";
import axiosInstance from "storefrontApp/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage("token", null);
  const [refresh, setRefresh] = useLocalStorage("refresh", null);
  const navigate = useNavigate();

  const login = async (username, password) => {
    // login
    try {
      const response = await axiosInstance.post(`auth/login/`, {
        username,
        password,
      });
      const { access, refresh } = response.data;

      if (response.status === 200 && response.data.user.is_staff) {
        setToken(access);
        setRefresh(refresh);
        navigate("/", { replace: true });
      }
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  const logout = async () => {
    const response = await axiosInstance.post(`auth/logout/`);

    if (response.status === 200) {
      setToken(null);
      setRefresh(null);
      navigate("/login", { replace: true });
    }
  };
  const value = useMemo(
    () => ({
      token,
      refresh,
      login,
      logout,
    }),
    [token, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
