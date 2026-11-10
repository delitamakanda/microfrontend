import { useLocalStorage } from "../hooks/useLocalStorage";
import axiosInstance from "../lib/api";
import { AuthContext } from "./AuthContext";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage("token", null);
  const [refresh, setRefresh] = useLocalStorage("refresh", null);
  const [user, setUser] = useLocalStorage("user", null);

  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post("/auth/login/", {
        username,
        password,
      });

      const { access, refresh, user } = response.data;

      if (response.status === 200) {
        setToken(access);
        setRefresh(refresh);
        setUser(user);
      }
    } catch (error) {
      console.error(error);
      // `cause` keeps the HTTP status for callers (e.g. the admin login page).
      throw new Error("Failed to login", { cause: error });
    }
  };

  // Errors are rethrown as is so the caller can read `error.response.data` (field errors).
  const register = async (username, password1, password2, email) => {
    const response = await axiosInstance.post("registration/", {
      username,
      password1,
      password2,
      email,
    });
    const { access, refresh, user } = response.data;
    setToken(access);
    setRefresh(refresh);
    setUser(user);
  };

  const logout = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout/");

      if (response.status === 200) {
        setToken(null);
        setRefresh(null);
        setUser(null);
      }
    } catch (error) {
      console.error(error);
      throw new Error("Failed to logout");
    }
  };

  return (
    <AuthContext.Provider value={{ token, refresh, login, logout, user, register }}>
      {children}
    </AuthContext.Provider>
  );
};
