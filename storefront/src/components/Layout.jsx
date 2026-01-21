import { useOutlet, Navigate, useLocation } from "react-router-dom";

import { Footer } from "./core/Footer";
import { Navbar } from "./core/Navbar";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants";

export const Layout = ({ canAuth }) => {
  const { token } = useAuth();
  const outlet = useOutlet();
  const location = useLocation();

  if (!token && canAuth) {
    return <Navigate to="/login" />;
  }
  if (
    token &&
    (location.pathname === ROUTES.SIGNUP ||
      location.pathname === ROUTES.LOGIN ||
      location.pathname === ROUTES.FORGOT_PASSWORD)
  ) {
    return <Navigate to={ROUTES.ORDER} />;
  }

  return (
    <div className="p-5">
      <Navbar />
      <div className="my-5" />
      {outlet}
      <div className="my-5" />
      <Footer />
    </div>
  );
};
