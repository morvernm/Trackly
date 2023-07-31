import { createContext, useState } from 'react'

const AuthContext = createContext(false);

export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState(false);

   const [user, setUser] = useState(null);
    // let [authTokens, setAuthTokens] = useState(null);


    // let [user, setUser] = useState(null)
    // let [tokens, setTokens] = useState(null)

    const login = (accessToken) => {
       setAuth(true);
       setUser(accessToken);
       console.log("access token is " + accessToken);
       console.log("user value is " + user);
         console.log("authenticated value is " + auth);
    }

    const logout = (accessToken) => {
        console.log("access token is " + accessToken);
        setAuth(false);
        setUser(null);
        console.log("user value is " + user);
          console.log("authenticated value is " + auth);
    }

   const contextData = {
        // user: user,
        // authTokens: authTokens,
        auth,
        login,
        logout,
       user,
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