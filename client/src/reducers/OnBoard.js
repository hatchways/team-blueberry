export default (state, action) => {
  switch (action.type) {
    case "GET_LANGUAGES": {
      return { ...state, loading: true };
    }
    case "GET_LANGUAGES_ERROR": {
      return { ...state, error: action.error, loading: false };
    }
    case "GET_LANGUAGES_SUCCESS": {
      return { ...state, user: action.user, loading: false };
    }
    default: {
      return state;
    }
  }
};
