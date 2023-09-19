import { Button, Table } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getAxiosCall } from "../../Axios/UniversalAxiosCalls";
import PageWrapper from "../PageContainer/PageWrapper";
function Home(props) {
  const columns = [
    {
      title: "User Id",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email Id",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Role Id",
      dataIndex: "roleId",
      key: "roleId",
    },
  ];
  const [results, setResults] = useState("");
  const navigateTo = useNavigate();
  const fetchRes = async () => {
    const res = await getAxiosCall("/users");

    setResults(res.data);
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
          Click to Check Users
        </Button>
      </div>
      <PageWrapper>
        <Table
          columns={columns}
          dataSource={results}
          size="large"
          style={{
            width: "100rem",
          }}

          // scroll={{
          //   x: 1500,
          //   y: 1000,
          // }}
        />
      </PageWrapper>
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
