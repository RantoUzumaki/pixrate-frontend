import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Homepage from './pages/Homepage';
import Logout from './pages/Logout';
import Profile from './pages/Profile';
import Admin from './pages/admin/Admin';

function App() {
  const [validate, setValidate] = useState(false);

  useEffect(() => {
    let userDetails = localStorage.getItem('userLoggedInDetails');
    if (userDetails) {
      setValidate(true);
    } else {
      setValidate(false);
    }
  }, [validate]);

  return (
    <Router>
      <Header logval={validate} />
      {validate ? (
        <Routes>
          <Route path="/" exact element={<Homepage />} />
          <Route path="/logout" element={<Logout logval={setValidate} />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" exact element={<Landing />} />
          <Route path="/login" element={<Login logval={setValidate} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      )}
      <Routes>
        <Route path="/admin/dashboard" exact element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
