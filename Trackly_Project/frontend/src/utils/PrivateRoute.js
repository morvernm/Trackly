// Code from https://github.com/seankwarren/Django-React-jwt-authentication

import { Navigate } from 'react-router-dom';
import {useContext, useState} from 'react';
import AuthContext from "../AuthProvider";

const PrivateRoute = ({children, ...rest}) => {
    const {auth} = useContext(AuthContext);
    // let [user, setUser] = useState(null)

    return !auth ? <Navigate to='/login'/> : children;
}

export default PrivateRoute;