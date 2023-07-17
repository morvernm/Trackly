// import logo from './logo.svg';
// import './App.css';
import'./styles.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Main } from './pages/main';
import {useContext, useEffect, useState} from "react";
import Login  from './pages/login';
import Register from './pages/register';
import Logout from './components/logout';
import { Inbox } from './pages/inbox.js';
import { Profile } from './pages/profile.js';
import { Search } from './pages/search';
import { Menu } from "./components/navbarUnregistered";
import { MemberMenu } from "./components/navbar";
import { Artist } from "./pages/artist.js";
import { Album } from"./pages/album.js";
import { Footer } from "./components/footer";
// import { ApiExample } from "./pages/apiExample";
import ApiExample from "./pages/apiExample";
import PrivateRoute from './utils/PrivateRoute';
import axiosInstance from "./axios";
import AuthContext, {AuthProvider} from "./AuthProvider";
// import {Authentication} from "./auth";
// import 'bootstrap/dist/css/bootstrap.min.css';



// const[authenticated, setAuthenticated] = useState(false);
// if(localStorage.getItem('username') !== undefined) {
//         setAuthenticated(true);
// };
function App() {
    // const {auth } = useContext(AuthContext);
  //   console.log("access_token is of type " + typeof localStorage.getItem('access_token'));
  //   const[authenticated, setAuthenticated] = useState(false);
  //
  //     useEffect(() => {
  //           if (localStorage.getItem('access_token') !== null) {
  //     setAuthenticated(true);
  //   }
  // }, []);
    // useEffect()
// if(localStorage.getItem('username') !== undefined) {
//     useEffect(()=>{
//         setAuthenticated(true);
//     })
// }

    // const [au setAuthenticated] = useState(false);
      // console.log(typeof axiosInstance.defaults.headers['Authorization']);
      //   console.log(axiosInstance.defaults.headers['Authorization']);
    // const isAuthenticated = () => {
    //     // const [authenticated, setAuthenticated] = useState('False');
    //     if(axiosInstance.defaults.headers['Authorization'] != null) {
    //          console.log(axiosInstance.defaults.headers['Authorization']);
    //         return true;
    //     }else {
    //         return false;
    //     }
    // // };
    // if(AuthContext.data != null) {
    //     setAuthenticated(true);
    // }else {
    //     setAuthenticated(false)
    // }
    //     let menu = MemberMenu;
    // }else {
    //     menu = Menu;
    // }

  return (
      <AuthProvider>
    <div className="App">
        <Router>
            {/*{auth ? <MemberMenu /> : <Menu />}*/}
            {/*<Authentication>*/}
            <MemberMenu />
            {/*will be accessible by any page*/}
            {/*   {console.log("access token is of value " + localStorage.getItem('access_token'))};*/}
            {/*      /!*{console.log("username is of value " + localStorage.getItem('username').valueOf())};*!/*/}
            {/*{console.log("Authenticated is of value " + authenticated.valueOf())};*/}
            {/*{authenticated ? <MemberMenu /> : <Menu />}*/}
            {/*<Menu />*/}
             {/*<Footer />*/}

          {/*  the links for the application*/}
          <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/search" element={<Search />} />
              <Route path="/inbox" element={<PrivateRoute><Inbox /> </PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /> </PrivateRoute>} />
              <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />

              <Route path="/artist" element={<Artist />} />
              <Route path="/album" element={<Album />} />
              <Route path="/apiexample" element={<ApiExample />} />
          </Routes>

            {/*<Footer />*/}
            <Footer />
            {/*</Authentication>*/}
        </Router>

    </div>
          </AuthProvider>
  );
}
export default App;
