const init = {
  email: null,
  firstName: null,
  lastName: null,
  isLoggedIn: false,
};

const reducer = (state = init, action) => {
  switch (action.type) {
    case "LOGGEDIN":
      return {
        ...state,
        // email: action.payload,
        firstName: action.payload?.firstName,
        lastName: action.payload?.lastName,
        isLoggedIn: true,
      };
    case "LOGGEDOUT":
      return {
        ...state,
        email: null,
        isLoggedIn: false,
      };
  }

  return state;
};
export default reducer;
