import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "./contexts/AuthContext.tsx";

function PrivateRoute() {
    const { user } = useAuth();
    if(user) return <Outlet/>;
    return <Navigate to="/login" replace/>;
}

export default PrivateRoute;