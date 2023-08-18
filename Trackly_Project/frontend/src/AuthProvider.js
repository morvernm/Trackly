import React, { createContext, useState } from 'react'
import axios from "axios";
import axiosInstance from "./axios";


const AuthContext = createContext(false);

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState(false);

   const [username, setUsername] = useState(null);

   const [userId, setUserId] = useState(null);

   const [profileId, setProfileId] = useState(null);

   const [accessToken, setAccessToken] = useState();

   const [refreshToken, setRefreshToken] = useState();

   const [spotifyAccessToken, setSpotifyAccessToken] = useState("");

   const [spotifyExpiry, setExpirty] = useState("");


    async function getProfileId(userId) {
        await axios.get(`http://127.0.0.1:8000/api/profile/user/${userId}`)
            .then((response) => {
                console.log("Got Profile Id");
                setProfileId(response.data.id);
            })
            .catch((error) => {
                console.log("Could not get profile ID");
            })
        }

    async function getUserId(username) {
        await axios.get(`http://127.0.0.1:8000/api/user/${username}`)
            .then((response) => {
                setUserId(response.data.id);
                localStorage.setItem('user_id', response.data.id);
                console.log("the user id is " + response.data.id);
                getProfileId(response.data.id);


            })
            .catch((error) => {
                console.log("could not set user ID");
            }
        )
    }




    const login = (username, token, refreshToken) => {
       setAuth(true);
        setUsername(username);
        setAccessToken(token);
        setRefreshToken(refreshToken);
        getUserId(username).then(r => console.log(userId));
         console.log("authenticated value is " + auth);
    }

    const logout = () => {
                localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('username');
            localStorage.removeItem('user_id');
            axiosInstance.defaults.headers['Authorization'] = null;
        setAuth(false);
        setUsername(null)
        setUserId(null);
        setAccessToken(null);
        setRefreshToken(null);
          console.log("authenticated value is " + auth);
    }

    const setSpotifyToken = (token) => {
        setSpotifyAccessToken(token);
        console.log("Spotify token is " + token);
    }

    const setExpiry = (expiry) => {
        setExpiry(expiry);
        console.log("expiry is " + expiry);
    }

    function setAuthValue(b) {
        setAuth(b);
    }

   const contextData = {
        auth,
        login,
        logout,
        userId,
        username,
        profileId,
        accessToken,
        setSpotifyToken,
        spotifyAccessToken,
        setExpiry,
       spotifyExpiry,
       refreshToken,
       setAuth,
       setAuthValue,
       setUserId,

    }

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;