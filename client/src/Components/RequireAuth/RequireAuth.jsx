import React, { PropTypes } from "react";
import { connect } from "react-redux";

export default function (ComposedComponent) {
  class Authenticate extends React.Component {
    constructor(props) {
      super(props);

      if (!props.isAuthenticated) {
        this.props.history.push("/");
      }
    }

    render() {
      return (
        <div className="">
          <ComposedComponent {...this.props} />
        </div>
      );
    }
  }

  const mapStateToProps = (state) => {
    return {
      isAuthenticated: state.universalReducer.isLoggedIn,
    };
  };
  return connect(mapStateToProps)(Authenticate);
}
