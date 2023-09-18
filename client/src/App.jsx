import { connect } from "react-redux";
import "./App.css";
import Navigation from "./Navigation/Navigation";
import { Spin } from "antd";

function App(props) {
  console.log("props", props);
  return (
    <>
      <Spin
        spinning={props?.loading == undefined ? false : props?.loading}
        size="large"
        tip="Faster than windows update!"
      >
        <Navigation />
      </Spin>
    </>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    isLoggedIn: () => dispatch({ type: "LOGGEDIN" }),
  };
};
const mapStateToProps = (state) => {
  return {
    loading: state.loadingReducer?.loading,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
