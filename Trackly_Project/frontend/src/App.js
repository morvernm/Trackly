import'./styles.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Main } from './pages/main';
import {useContext, useEffect} from "react";
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
import { AuthProvider } from './AuthProvider';
import { Reviews } from "./pages/reviews"
import ScrollToTop from "./components/scrollToTop";


function App() {
    const {auth, setAuth, userId, setUserId} = useContext(AuthContext);
     useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        const storedUserId = localStorage.getItem('user_id');
        if (storedToken) {
            setAuth(true);
            // setUserId(storedUserId);
        }
        if(storedUserId) {
            setUserId(storedUserId);
        }
    }, [setAuth, setUserId]);
  return (
    <div className="App">
        {/*<AuthProvider>*/}
        <Router>
              <ScrollToTop />
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
            {/*</AuthProvider>*/}

    </div>

  );
}
export default App;
