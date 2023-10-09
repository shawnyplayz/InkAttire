import axios from "axios";

export const setAuthenticationHeader = () => {
  const gettoken = localStorage.getItem("access_token");
  if (gettoken) {
    "gettoken", gettoken;
    axios.defaults.headers.common["Authorization"] = `Bearer ${gettoken}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};
