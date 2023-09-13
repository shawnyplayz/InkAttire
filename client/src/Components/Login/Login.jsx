import { Button, Input } from "antd";
import React from "react";

function Login() {
  return (
    <div className="bg-login-img bg-cover h-screen">
      <div className="flex flex-row justify-end align-middle items-center w-full h-screen px-80">
        <div className="card bg-cyan-400">
          <div className="flex flex-col justify-center items-center">
            <div className="text-3xl mb-4 font-semibold">Login</div>
            <div className="credentials card shadow-lg w-96 ">
              <div className="uName my-4">
                <div className="text-xl w-full my-2 font-medium">User Name</div>
                <Input placeholder="User Name" type="text" size="large" />
              </div>
              <div className="password my-4">
                <div className="text-xl my-2 font-medium">Password</div>
                <Input placeholder="Password" type="password" size="large" />
              </div>
              <div className="flex justify-around items-center flex-row">
                <Button type="primary" className="text-black" size="large">
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

export default Login;
