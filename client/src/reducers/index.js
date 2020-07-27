export default (state, action) => {
  switch (action.type) {
    case "FETCH_USER": {
      return { ...state, loading: true };
    }
    case "FETCH_USER_ERROR": {
      return { ...state, error: action.error, loading: false };
    }
    case "FETCH_USER_SUCCESS": {
      return { ...state, user: action.user, loading: false };
    }
    default: {
      return state;
    }
  }
};
