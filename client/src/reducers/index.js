export default (state, action) => {
  switch (action.type) {
    case "FETCH": {
      return { ...state, loading: true };
    }
    case "FETCH_USER_ERROR": {
      return { ...state, error: action.error, loading: false };
    }
    case "FETCH_USER_SUCCESS": {
      return { ...state, user: action.user, loading: false };
    }
    case "ADD_ITEM_TO_CART": {
      // TODO handle duplicates?
      return { ...state, loading: true, cart: [action.item] };
    }
    case "CREATE_PAYMENT_INTENT": {
      return { ...state, loading: false };
    }
    case "CREATE_PAYMENT_INTENT_ERROR": {
      return { ...state, loading: false };
    }
    case "FINISH_LOAD": {
      return { ...state, loading: false };
    }
    case "REMOVE_USER": {
      return { ...state, loading: true };
    }
    case "REMOVE_USER_SUCCESS": {
      return { ...state, user: action.user, loading: false };
    }
    case "REMOVE_USER_ERROR": {
      return { ...state, error: action.user, loading: false };
    }
    default: {
      return state;
    }
  }
};
