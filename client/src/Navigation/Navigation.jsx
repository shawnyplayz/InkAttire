import React from "react";
import Login from "../Components/Login/Login";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
function Navigation() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
      </Routes>
    </Router>
  );
}

export default Navigation;
