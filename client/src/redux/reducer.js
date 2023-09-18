const init = {
  email: null,
  firstName: null,
  lastName: null,
  isLoggedIn: false,
  loading: false,
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
    case "LOADING":
      return {
        ...state,
        loading: action.payload,
      };
  }

  return state;
};
export default reducer;
