import React from "react";
import { AuthContext } from "../providers/AuthContext";

export const useAuth = () => React.useContext(AuthContext);
