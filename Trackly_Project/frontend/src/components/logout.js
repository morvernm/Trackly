import { useNavigate }  from "react-router-dom";
import React, {useState, useEffect, useContext} from "react";
import axiosInstance from "../axios";
import AuthContext from "../AuthProvider";

export default function Logout(e) {
    const { logout, auth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() =>  {
        const res = axiosInstance.post('/logout/blacklist', {
            refresh_token: localStorage.getItem('refresh_token'),
        });
            logout();
            navigate('/');


        }, []);
}
