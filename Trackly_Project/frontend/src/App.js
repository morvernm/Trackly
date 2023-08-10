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
import { MemberMenu } from "./components/navbar";
import { Artist } from "./pages/artist.js";
import { Album } from"./pages/album.js";
import { Footer } from "./components/footer";
import PrivateRoute from './utils/PrivateRoute';
import AuthContext from "./AuthProvider";
import { Reviews } from "./pages/reviews"
import {SearchProvider} from "./SearchProvider";




// const[authenticated, setAuthenticated] = useState(false);
// if(localStorage.getItem('username') !== undefined) {
//         setAuthenticated(true);
// };
function App() {
    const {auth, userId } = useContext(AuthContext);
  console.log("authenticated value is " + auth);
  return (
      // <AuthProvider>
      // <SearchProvider>
    <div className="App">
        <Router>
            <MemberMenu />
          {/*  the links for the application*/}
          <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/search" element={<Search />} />
              <Route path="/inbox" element={<PrivateRoute><Inbox /> </PrivateRoute>} />
              <Route path="/profile/user/:userId/" element={<PrivateRoute><Profile /> </PrivateRoute>} />
              <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />

              <Route path="/artist" element={<Artist />} />
              <Route path="/album/:albumName" element={<Album />} />
              <Route path="user/:id/reviews/" element={<Reviews />} />
          </Routes>

            <Footer />
        </Router>

    </div>
              // </SearchProvider>
          /*</AuthProvider>*/

  );
}
export default App;
