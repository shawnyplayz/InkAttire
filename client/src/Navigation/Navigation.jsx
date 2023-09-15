import React from "react";
import Login from "../Components/Login/Login";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "../Components/Home/Home";
import { connect } from "react-redux";
import PrivateRoute from "./PrivateRoute";
import SideDrawer from "../Components/Drawer/SideDrawer";
import { matchRoutes, useLocation } from "react-router-dom";

const routes = [{ path: "/login" }];

function Navigation(props) {
  const location = useLocation();
  // const currentPath = useCurrentPath();
  console.log(location);

  return (
    <>
      <div className={location.pathname !== "/" ? "h-full" : ""}>
        {location.pathname !== "/" ? (
          <div className="">
            <SideDrawer />
          </div>
        ) : (
          ""
        )}

        <div
          className={
            location.pathname !== "/"
              ? "md:col-span-5 bg-blue-100 p-4 h-screen"
              : ""
          }
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    loggedIn: state?.universalReducer?.isLoggedIn,
  };
};
export default connect(mapStateToProps)(Navigation);
