// Code from https://github.com/seankwarren/Django-React-jwt-authentication

import { Navigate } from 'react-router-dom';
import {useContext, useState} from 'react';
import AuthContext from "../AuthProvider";

const PrivateRoute = ({children, ...rest}) => {
   let {auth} = useContext(AuthContext);
    if(localStorage.getItem('access_token') != null) {
        auth = true;
    }
            console.log(localStorage.getItem('access_token'));

    return !auth ? <Navigate to='/login'/> : children;
}

export default PrivateRoute;