export default (state, action) => {
  switch (action.type) {
    case "FETCH": {
      return { ...state, loading: true };
    }
    case "FETCH_USER_ERROR": {
      return { ...state, error: action.error, loading: false };
    }
    case "FETCH_USER_SUCCESS": {
      return { ...state, user: action.user, loading: false, error: null };
    }
    case "LOGOUT": {
      return { ...state, loading: true };
    }
    case "LOGOUT_USER_ERROR": {
      return { ...state, error: action.error, loading: false };
    }
    case "LOGOUT_USER_SUCCESS": {
      return { ...state, user: {}, loading: false, error: null };
    }
    case "LOGIN": {
      return { ...state, user: action.user, loading: false, error: null };
    }
    case "SIGNUP": {
      return { ...state, user: action.user, loading: false, error: null };
    }
    case "ADD_ITEM_TO_CART": {
      // TODO handle duplicates?
      return { ...state, cart: [action.item] };
    }
    case "CREATE_PAYMENT_INTENT_SUCCESS": {
      console.log(action);
      return {
        ...state,
        loading: true,
        secret: { ...state.secret, ...action.secret },
        error: null,
      };
    }
    case "CREATE_PAYMENT_INTENT_ERROR": {
      return { ...state, loading: false, error: action.error };
    }
    case "CONFIRM_PAYMENT_INTENT_SUCCESS": {
      delete state.secret;
      return { ...state, loading: false, user: action.data, error: null };
    }
    case "CONFIRM_PAYMENT_INTENT_ERROR": {
      delete state.secret;
      return { ...state, loading: false, error: action.error };
    }
    case "FINISH_LOAD": {
      return { ...state, loading: false };
    }
    case "GET_LANGUAGES": {
      return { ...state, loading: true };
    }
    case "GET_LANGUAGES_ERROR": {
      return { ...state, error: action.error, loading: false };
    }
    case "GET_LANGUAGES_SUCCESS": {
      return { ...state, user: action.user, loading: false, error: null };
    }
    case "UPDATE_USER_LANGUAGES": {
      return { ...state, loading: true };
    }
    case "UPDATE_USER_LANGUAGES_ERROR": {
      return { ...state, error: action.error, loading: false };
    }
    case "UPDATE_USER_LANGUAGES_SUCCESS": {
      return { ...state, user: action.user, loading: false, error: null };
    }
    case "UPDATE_USER_PROJECTS": {
      return { ...state, loading: true };
    }
    case "UPDATE_USER_PROJECTS_ERROR": {
      return { ...state, error: action.error, loading: false };
    }
    case "UPDATE_USER_PROJECTS_SUCCESS": {
      return { ...state, user: action.user, loading: false, error: null };
    }
    case "UPDATE_USER_BALANCE": {
      return { ...state, loading: true };
    }
    case "UPDATE_USER_BALANCE_ERROR": {
      return { ...state, error: action.error, loading: false };
    }
    case "UPDATE_USER_BALANCE_SUCCESS": {
      return { ...state, user: action.user, loading: false, error: null };
    }
    case "CREATE_USER_AVATAR_SUCCESS": {
      return { ...state, loading: false, user: action.user };
    }
    case "CREATE_USER_AVATAR_ERROR": {
      return { ...state, error: action.error, loading: false };
    }
    case "EDIT_USER_SUCCESS": {
      return { ...state, loading: false, user: action.user };
    }
    case "EDIT_USER_ERROR": {
      return { ...state, loading: false, error: action.error };
    }
    case "CREATE_CODE_SUCCESS": {
      return { ...state, loading: false, error: null };
    }
    case "CREATE_CODE_ERROR": {
      return { ...state, loading: false, error: action.error };
    }
    case "REMOVE_USER": {
      return { ...state, loading: true };
    }
    case "REMOVE_USER_SUCCESS": {
      return { ...state, user: action.user, loading: false, error: null };
    }
    case "GET_USER_REVIEWS_SUCCESS": {
      return { ...state, reviews: action.reviews, loading: false };
    }
    case "GET_USER_REVIEWS_ERROR": {
      return { ...state, error: action.error, loading: false };
    }
    case "REMOVE_USER_ERROR": {
      return { ...state, error: action.user, loading: false };
    }
    default: {
      return state;
    }
  }
};
