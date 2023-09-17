import axios from "axios";

import Swal from "sweetalert2";
export let postAxiosCall = async (endpoint, data) => {
  try {
    const _headers = {
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };
    // Create an Axios instance with default configuration
    const instance = axios.create({
      baseURL: process.env.URL, // Your API's base URL
      headers: {
        "Content-Type": "application/json", // Default content type (you can customize this)
        ..._headers, // Merge custom headers with default headers
      },
      // ...config, // Additional Axios request configuration
    });

    // Make the request using the provided body and endpoint
    const response = await instance.post(endpoint, data);
    // Return the response
    return response.data;
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error?.response?.data?.message,
      icon: "error",
      confirmButtonText: "Alright!",
    });
    return;
  }
};
// let res = null;
// const _headers = {
//   "Content-Type": "application/x-www-form-urlencoded",
//   Accept: "*/*",
//   Authorization: `Bearer ${localStorage.getItem("access_token")}`,
// };
// const request = {
//   headers: _headers,
// };

// // console.log(`${process.env.URL}${endpoint}`);
// console.log("body==>", data);
//
// await axios
//   // .post("http://localhost:5000/product", data, request)
//   .post(`${process.env.URL}${endpoint}`, data, request)
//   .then((response) => {
//
//     if (response?.status) {
//       res = response;
//     }
//   })
//   .catch(function (error) {
//
//     Swal.fire({
//       title: "Error",
//       text: error?.response?.data?.message,
//       icon: "error",
//       confirmButtonText: "Alright!",
//     });
//   });
// return res;
// };
export let getAxiosCall = async (endpoint, data) => {
  try {
    let res = null;
    const _headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };
    const request = {
      headers: _headers,
    };

    console.log(`${process.env.URL}${endpoint}`);
    await axios
      .get(`${process.env.URL}${endpoint}`, request)
      .then((response) => {
        if (response.status) {
          res = response;
        }
      })
      .catch(function (error) {
        Swal.fire({
          title: "Error",
          text: error?.response?.data?.message,
          icon: "error",
          confirmButtonText: "Alright!",
        });
      });
    return res;
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: error,
      icon: "error",
      confirmButtonText: "Alright!",
    });
  }
};
