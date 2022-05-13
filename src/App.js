import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Homepage from './pages/Homepage';

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
      <Routes>
        <Route path="/" element={validate ? <Homepage /> : <Landing />}></Route>
        <Route path="/login" element={<Login logval={setValidate} />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
