import { createContext, useState } from 'react'
import axios from "axios";

const AuthContext = createContext(false);

export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState(false);

   const [username, setUsername] = useState(null);

   const [userId, setUserId] = useState(null);

   const [profileId, setProfileId] = useState(null);

   const [accessToken, setAccessToken] = useState();

    // let [authTokens, setAuthTokens] = useState(null);


    // let [user, setUser] = useState(null)
    // let [tokens, setTokens] = useState(null)

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
                console.log("the user id is " + response.data.id);
                getProfileId(response.data.id);

            })
            .catch((error) => {
                console.log("could not set user ID");
            }
        )
    }




    const login = (username, token) => {
       setAuth(true);
        setUsername(username);
        setAccessToken(token);
        getUserId(username);

       // console.log("access token is " + accessToken);
       // console.log("user value is " + user);
         console.log("authenticated value is " + auth);
    }

    const logout = (username) => {
        // console.log("access token is " + accessToken);
        setAuth(false);
        setUsername(null)
        setUserId(null);
        setAccessToken(null);
        // console.log("user value is " + user);
          console.log("authenticated value is " + auth);
    }

   const contextData = {
        // user: user,
        // authTokens: authTokens,
        auth,
        login,
        logout,
       userId,
       username,
       profileId,
       accessToken,
        // login: login,
        // logout: logout,
    }

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;