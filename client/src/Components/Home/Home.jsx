import { Button } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
function Home(props) {
  const [results, setResults] = useState("");
  const navigateTo = useNavigate();
  const fetchRes = async () => {
    const _headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };
    const request = {
      headers: _headers,
    };
    await axios
      .get("http://localhost:5000/users", request)
      .then((result) => {
        if (result?.status) {
          setResults(JSON.stringify(result.data));
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "Error",
          text: err,
          icon: "error",
          confirmButtonText: "Alright!",
        });
      });
  };
  const logOut = async () => {
    window.localStorage.clear();
    localStorage.removeItem("access_token");
    navigateTo("/");
    props.loggedOut();
  };
  return (
    <div className="flex flex-col">
      <div className="flex justify-center my-8">
        <h1 className="text-2xl font-medium">
          Hi, {props.userDetails?.firstName}
          {"  "}
          {props.userDetails?.lastName}
        </h1>
      </div>

      <div className="flex justify-center items-center">
        <Button type="primary" onClick={logOut} className="text-black">
          Log out
        </Button>
      </div>
      <div className="flex justify-center items-center">
        <Button type="primary" onClick={fetchRes} className="text-black">
          Press to fetch products
        </Button>
      </div>
      <div className="">
        <p>{JSON.stringify(results)}</p>
      </div>
    </div>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    loggedOut: () => dispatch({ type: "LOGGEDOUT" }),
  };
};
const mapStateToProps = (state) => {
  return {
    userDetails: state.universalReducer,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
