import { connect } from "react-redux";
import "./App.css";
import Navigation from "./Navigation/Navigation";

function App(props) {
  // const token = localStorage.getItem("access_token");
  // if (token) {
  //   props.isLoggedIn();
  // }
  return (
    <>
      <Navigation />
    </>
  );
}
export const mapDispatchToProps = (dispatch) => {
  return {
    isLoggedIn: () => dispatch({ type: "LOGGEDIN" }),
  };
};
export default connect(null, mapDispatchToProps)(App);
