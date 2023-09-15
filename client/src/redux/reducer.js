const init = {
  email: null,
  isLoggedIn: false,
};

const reducer = (state = init, action) => {
  switch (action.type) {
    case "LOGGEDIN":
      debugger;
      return {
        ...state,
        isLoggedIn: true,
      };
    case "LOGGEDOUT":
      debugger;
      return {
        ...state,
        isLoggedIn: false,
      };
  }

  return state;
};
export default reducer;
