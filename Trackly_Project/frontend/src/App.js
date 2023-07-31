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
import AuthContext from "./AuthProvider";
import {SearchProvider} from "./SearchProvider";
// import {Authentication} from "./auth";
// import 'bootstrap/dist/css/bootstrap.min.css';



// const[authenticated, setAuthenticated] = useState(false);
// if(localStorage.getItem('username') !== undefined) {
//         setAuthenticated(true);
// };
function App() {
    const {auth } = useContext(AuthContext);
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

  console.log("authenticated value is " + auth);
  return (
      // <AuthProvider>
          /*<SearchProvider>*/
    <div className="App">
        <Router>
            <MemberMenu />
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
              <Route path="/album/:albumName" element={<Album />} />
              <Route path="/apiexample" element={<ApiExample />} />
          </Routes>

            <Footer />
        </Router>

    </div>
              /*</SearchProvider>*/
          /*</AuthProvider>*/

  );
}
export default App;
