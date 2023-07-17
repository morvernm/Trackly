import { useNavigate }  from "react-router-dom";
import React, {useState, useEffect, useContext} from "react";
import axiosInstance from "../axios";
import AuthContext from "../AuthProvider";

export default function Logout() {
    const { logout, auth } = useContext(AuthContext);
    const navigate = useNavigate();
 localStorage.removeItem('username');
    useEffect(() =>  {
        const res = axiosInstance.post('/logout/blacklist', {
            refresh_token: localStorage.getItem('refresh_token'),});
            logout(localStorage.getItem('access_token'));
            console.log("authentication value is " + auth);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('username');
            axiosInstance.defaults.headers['Authorization'] = null;

            navigate('/login');

        });
    return <div>Logout</div>;
}
