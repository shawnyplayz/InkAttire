const init = {
  email: null,
  isLoggedIn: false,
};

const reducer = (state = init, action) => {
  switch (action.type) {
    case "LOGGEDIN":
      return {
        ...state,
        isLoggedIn: true,
      };
  }
  return state;
};
export default reducer;
