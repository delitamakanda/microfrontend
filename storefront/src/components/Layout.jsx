import "primeicons/primeicons.css";

import { useOutlet, Navigate, useLocation } from "react-router-dom";

import { Footer } from "./core/Footer";
import { Navbar } from "./core/Navbar";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants";
import { getRedirectTarget } from "../pages/auth/loginHelpers";

export const Layout = ({ canAuth }) => {
  const { token } = useAuth();
  const outlet = useOutlet();
  const location = useLocation();

  if (!token && canAuth) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  if (
    token &&
    (location.pathname === ROUTES.SIGNUP ||
      location.pathname === ROUTES.LOGIN ||
      location.pathname === ROUTES.FORGOT_PASSWORD)
  ) {
    return <Navigate to={getRedirectTarget(location.state, ROUTES.ORDER)} replace />;
  }

  return (
    <div className="p-5">
      <Navbar />
      <div className="my-5" />
      <main>{outlet}</main>
      <div className="my-5" />
      <Footer />
    </div>
  );
};
