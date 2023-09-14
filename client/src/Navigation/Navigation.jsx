import React from "react";
import Login from "../Components/Login/Login";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Home from "../Components/Home/Home";
import { connect } from "react-redux";
function Navigation(props) {
  console.log("props.isLoggedIn", props.loggedIn);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        {props.loggedIn ? (
          <Route path="/home" element={<Home />}></Route>
        ) : null}
      </Routes>
    </Router>
  );
}
const mapStateToProps = (state) => {
  return {
    loggedIn: state?.universalReducer?.isLoggedIn,
  };
};
export default connect(mapStateToProps)(Navigation);
