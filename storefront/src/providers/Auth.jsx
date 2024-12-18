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
      throw new Error("Failed to login");
    }
  };

  const register = async (username, password1, password2, email) => {
    try {
      const response = await axiosInstance.post("registration/", {
        username,
        password1,
        password2,
        email,
      });

      if (response.status === 201) {
        const { access, refresh, user } = response.data;

        if (response.status === 201) {
          setToken(access);
          setRefresh(refresh);
          setUser(user);
        }
      }
    } catch (error) {
      console.error(error);
      throw new Error("Failed to register");
    }
  }

  const logout = async () => {
    const response = await axiosInstance.post("/auth/logout/");

    if (response.status === 200) {
      setToken(null);
      setRefresh(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, refresh, login, logout, user, register }}>
      {children}
    </AuthContext.Provider>
  );
};
