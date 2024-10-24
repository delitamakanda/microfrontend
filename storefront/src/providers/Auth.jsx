import { useLocalStorage } from "../hooks/useLocalStorage";
import axiosInstance from "../lib/api";
import { AuthContext } from "./AuthContext";

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage("token", null);
  const [refresh, setRefresh] = useLocalStorage("refresh", null);

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post("/auth/login/", {
        username,
        password,
      });
      const { access, refresh } = response.data;

      if (response.status === 200) {
        setToken(access);
        setRefresh(refresh);
      }
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  const logout = async () => {
    const response = await axiosInstance.post("/auth/logout/");

    if (response.status === 200) {
      setToken(null);
      setRefresh(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, refresh, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
