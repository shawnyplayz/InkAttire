import React from "react";
import { connect } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute(props) {
  let auth = props.isAuthenticated;
  return <>{auth ? <Outlet /> : <Navigate to="/" />}</>;
}
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.universalReducer.isLoggedIn,
  };
};
export default connect(mapStateToProps)(PrivateRoute);
