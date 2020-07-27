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
    case "ADD_ITEM_TO_CART": {
      return { ...state, loading: true, cart: [...state.cart, action.item] };
    }
    case "FINISH_LOAD": {
      return { ...state, loading: false };
    }
    default: {
      return state;
    }
  }
};
