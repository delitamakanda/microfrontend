import { Menu } from '../../menu';
import { Breadcrumb } from '../../breadcrumb';
import { useOutlet, Navigate } from "react-router-dom";
import { useAuth } from '../../../hooks/auth/useAuth';
import { Button } from 'primereact/button';

export const Layout = () => {
    const {token , logout } = useAuth();
    const outlet = useOutlet();
    if (!token) {
        return <Navigate to="/login" />;
     }
    return (
        <div className="min-h-screen surface-ground">
            <Menu /><Button onClick={() => logout()}>Logout</Button>
            <div className="p-3">
                <Breadcrumb />
               {outlet}
            </div>
        </div>
    )
}