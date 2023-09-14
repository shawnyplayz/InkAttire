import { Button } from "antd";
import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
function Home() {
  const [results, setResults] = useState(null);

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
        if (result.status) {
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
  return (
    <div className="flex flex-col">
      <h1>this is the home page</h1>
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

export default Home;
