// import logo from './logo.svg';
// import './App.css';
import'./styles.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Main } from './pages/main';
import { Login } from './pages/login';
import { Register } from './components/register';
import { Inbox } from './pages/inbox.js';
import { Profile } from './pages/profile.js';
import { Search } from './pages/search';
import { Menu } from "./components/navbar";
import { Artist } from "./pages/artist.js";
import { Album } from"./pages/album.js";
import { Footer } from "./components/footer";
// import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <div className="App">
        <Router>
            {/*will be accessible by any page*/}
            <Menu />
             {/*<Footer />*/}

          {/*  the links for the application*/}
          <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/search" element={<Search />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />

              <Route path="/artist" element={<Artist />} />
              <Route path="/album" element={<Album />} />
          </Routes>

            {/*<Footer />*/}
            <Footer />
        </Router>
    </div>
  );
}

export default App;
