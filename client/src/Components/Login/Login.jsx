import { Button, Input } from "antd";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { setAuthenticationHeader } from "../../utils/Authenticate";
import { connect } from "react-redux";
import { postAxiosCall } from "../../Axios/UniversalAxiosCalls";

function Login(props) {
  const navigateTo = useNavigate();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const onLogin = async () => {
    try {
      const answer = await postAxiosCall("/login", {
        email: email,
        password: password,
      });

      console.log(answer);
      if (answer) {
        localStorage.setItem("access_token", answer?.token);
        props.isLoggedIn(answer?.sendUserInfo[0]);
        navigateTo("/home");
      } else {
        console.log("error");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        confirmButtonText: "Alright!",
      });
    }
  };
  return (
    <div
      className="bg-cover h-screen"
      style={{ backgroundImage: "url(../../../public/Images/Loginbkg.webp)" }}
    >
      <div className="flex flex-row justify-end align-middle items-center w-full h-screen px-80">
        <div className="card bg-cyan-400">
          <div className="flex flex-col justify-center items-center">
            <div className="text-3xl mb-4 font-semibold">Login</div>
            <div className="credentials card shadow-lg w-96 ">
              <div className="uName my-4">
                <div className="text-xl w-full my-2 font-medium">Email</div>
                <Input
                  placeholder="User Name"
                  type="text"
                  size="large"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="password my-4">
                <div className="text-xl my-2 font-medium">Password</div>
                <Input
                  placeholder="Password"
                  type="password"
                  size="large"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div className="flex justify-around items-center flex-row">
                <Button
                  type="primary"
                  className="text-black"
                  size="large"
                  onClick={onLogin}
                >
                  Login
                </Button>
                <Button type="dashed" size="large">
                  Register
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    isLoggedIn: (sendUserInfo) =>
      dispatch({ type: "LOGGEDIN", payload: sendUserInfo }),
  };
};
export default connect(null, mapDispatchToProps)(Login);
