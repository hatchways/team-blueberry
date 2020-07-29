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
    case "GET_LANGUAGES": {
      return { ...state, loading: true };
    }
    case "GET_LANGUAGES_ERROR": {
      return { ...state, error: action.error, loading: false };
    }
    case "GET_LANGUAGES_SUCCESS": {
      return { ...state, user: action.user, loading: false };
    }
    case "UPDATE_USER_LANGUAGES": {
      return { ...state, loading: true };
    }
    case "UPDATE_USER_LANGUAGES_ERROR": {
      return { ...state, error: action.error, loading: false };
    }
    case "UPDATE_USER_LANGUAGES_SUCCESS": {
      return { ...state, user: action.user, loading: false };
    }
    default: {
      return state;
    }
  }
};
