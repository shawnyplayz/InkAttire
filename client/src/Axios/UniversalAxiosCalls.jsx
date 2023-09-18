import axios from "axios";
import { connect } from "react-redux";
import { store } from "../redux/store";
import Swal from "sweetalert2";
export let postAxiosCall = async (endpoint, data) => {
  try {
    store.dispatch({ type: "LOADING", payload: true });
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
    store.dispatch({ type: "LOADING", payload: false });
    return response.data;
  } catch (error) {
    store.dispatch({ type: "LOADING", payload: false });
    Swal.fire({
      title: "Error",
      text: error?.response?.data?.message,
      icon: "error",
      confirmButtonText: "Alright!",
    });
    return;
  }
};
export let getAxiosCall = async (endpoint, data) => {
  try {
    store.dispatch({ type: "LOADING", payload: true });
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
    store.dispatch({ type: "LOADING", payload: false });

    return res;
  } catch (error) {
    store.dispatch({ type: "LOADING", payload: false });
    Swal.fire({
      title: "Error",
      text: error,
      icon: "error",
      confirmButtonText: "Alright!",
    });
  }
};
export let deleteAxiosCall = async (endpoint, data) => {
  try {
    store.dispatch({ type: "LOADING", payload: true });
    let res = null;
    const _headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    };
    const request = {
      headers: _headers,
    };

    console.log(`${process.env.URL}${endpoint}/${data}`);

    await axios
      .delete(`${process.env.URL}${endpoint}/${data}`, request)
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
    store.dispatch({ type: "LOADING", payload: false });

    return res;
  } catch (error) {
    store.dispatch({ type: "LOADING", payload: false });
    Swal.fire({
      title: "Error",
      text: error,
      icon: "error",
      confirmButtonText: "Alright!",
    });
  }
};
