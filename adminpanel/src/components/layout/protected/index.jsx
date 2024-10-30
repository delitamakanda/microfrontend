import { Menu } from "../../menu";
import { Breadcrumb } from "../../breadcrumb";
import { useOutlet, Navigate } from "react-router-dom";
import { useAuth } from "storefrontApp/useAuth";

export const Layout = () => {
  const { token, logout, user } = useAuth();
  const outlet = useOutlet();
  if (!token) {
    return <Navigate to="/login" />;
  }
  if (token && (user && !user.is_staff)) {
      return (
          <div className="flex items-center justify-between px-4 py-3 bg-white shadow">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">
              Logout
            </button>
          </div>
      )
  } else {
      return (
          <div className="min-h-screen surface-ground">
              <Menu />
              <div className="p-3">
                  <Breadcrumb />
                  {outlet}
              </div>
          </div>
      );

  }
};
