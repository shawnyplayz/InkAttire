const init = {
  loading: false,
};

const reducer = (state = init, action) => {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading: action.payload,
      };
  }

  return state;
};
export default reducer;
