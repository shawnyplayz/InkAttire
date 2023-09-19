import React, { useEffect } from "react";
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
import Navbar from "../Components/NavigationBar/Navbar";
import CreateProduct from "../Components/createProd/CreateProduct";
import DeleteInner from "../Components/deleteProd/DeleteInner";
import ProductTable from "../Components/ProductTable/ProductTable";
import ViewInner from "../Components/viewProd/ViewInner";
import UpdateInner from "../Components/updateProd/UpdateInner";

function Navigation(props) {
  const location = useLocation();
  const navigateTo = useNavigate();
  useEffect(() => {
    if (location.pathname === "/") {
      window.localStorage.clear();
      localStorage.removeItem("access_token");
      navigateTo("/");
      props.loggedOut();
    }
  }, [location.pathname]);

  return (
    <>
      <div>
        {location.pathname !== "/" ? (
          <div className="">
            <Navbar />
            <SideDrawer />
          </div>
        ) : (
          ""
        )}

        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/createproduct" element={<CreateProduct />} />
              <Route
                path="/deleteproduct"
                element={<ProductTable pageMode="Delete" />}
              />
              <Route path="/deleteinner" element={<DeleteInner />} />
              <Route
                path="/viewproducts"
                element={<ProductTable pageMode="View" />}
              />
              <Route path="/viewinner" element={<ViewInner />} />
              <Route
                path="/updateproduct"
                element={<ProductTable pageMode="Update" />}
              />
              <Route path="/updateinner" element={<UpdateInner />} />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    loggedOut: () => dispatch({ type: "LOGGEDOUT" }),
  };
};
const mapStateToProps = (state) => {
  return {
    loggedIn: state?.universalReducer?.isLoggedIn,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
