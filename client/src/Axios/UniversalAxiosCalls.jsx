import axios, { Axios } from "axios";
import Swal from "sweetalert2";
export let postAxiosCall = async (endpoint, data) => {
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
      .post(`${process.env.URL}${endpoint}`, data, request)
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
