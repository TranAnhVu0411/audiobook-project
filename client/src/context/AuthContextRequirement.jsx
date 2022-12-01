import {useContext} from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from "./AuthContextProvider";

export const AuthContextRequirement = ({ role }) => {
    const { currentUser } = useContext(AuthContext);
    const location = useLocation();
    if (!currentUser || !role.includes(currentUser.info.role)) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};
export default AuthContextRequirement;
