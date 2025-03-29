// src/App.tsx

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <>
              <h1>Welcome to Our App</h1>
              <a href="/login">Login</a> | <a href="/register">Register</a>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
