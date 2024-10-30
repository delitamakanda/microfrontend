import { createContext } from "react";

export const AuthContext = createContext({
  token: null,
  refresh: null,
  login: () => {},
  logout: () => {},
  register: () => {},
  user: null,
});
