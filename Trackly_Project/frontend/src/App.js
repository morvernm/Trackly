// import logo from './logo.svg';
// import './App.css';
import'./styles.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Main } from './pages/main';
import { Login } from './pages/login';
import { Inbox } from './pages/inbox.js';
import { Profile } from './pages/profile.js';
import { Search } from './pages/search';
import { Menu } from "./components/navbar";
// import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <div className="App">
        <Router>
            {/*will be accessible by any page*/}
            <Menu />
          {/*  the links for the application*/}
          <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/search" element={<Search />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      {/*<header className="App-header">*/}
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        {/*<p>*/}
        {/* Welcome to trackly - share your reviews and connect with music lovers*/}
        {/*</p>*/}
      {/*// </header>*/}
    </div>
  );
}

export default App;
