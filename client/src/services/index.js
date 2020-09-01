const axios = require("axios");

export const userService = (body) => async (dispatch) => {
  // set loading state
  dispatch({ type: "FETCH" });

  try {
    const result = await axios({
      method: "GET",
      url: "/api/user/me",
    });
    // throw if server returns an error message
    if (result.error) throw result.error;

    dispatch({ type: "FETCH_USER_SUCCESS", user: result });
  } catch (e) {
    dispatch({ type: "FETCH_USER_ERROR", error: { ...e } });
  }
  // on exception
};

// probably deprecated
export const getKey = (_) => async (dispatch) => {
  dispatch({ type: "FETCH" });
  try {
    const { data } = await axios({
      url: "/api/payment/key",
      method: "GET",
    });
    dispatch({
      type: "FETCH_KEY_SUCCESS",
      secret: {
        STRIPE_API_KEY: data.STRIPE_API_KEY,
      },
    });
  } catch (e) {
    dispatch({ type: "FETCH_KEY_ERROR", error: { ...e } });
  }
};

export const createPaymentIntent = ({ cart }) => async (dispatch) => {
  dispatch({ type: "FETCH" });

  try {
    // fetch to post payment internet
    const { data } = await axios({
      url: "/api/payment",
      method: "POST",
      data: JSON.stringify({ cart }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch({
      type: "CREATE_PAYMENT_INTENT_SUCCESS",
      secret: {
        clientSecret: data.clientSecret,
      },
    });
  } catch (e) {
    dispatch({ type: "CREATE_PAYMENT_INTENT_ERROR", error: { ...e } });
  }
};

export const confirmPaymentIntent = (id) => async (dispatch) => {
  dispatch({ type: "FETCH" });
  try {
    // fetch to put payment intent intent in confirmed state
    const { data } = await axios({
      url: `/api/payment/${id}`,
      method: "PUT",
      data: JSON.stringify({ id }), // TODO include some sort of validation here
      headers: { "Content-Type": "application/json" },
    });
    dispatch({ type: "CONFIRM_PAYMENT_INTENT_SUCCESS", data });
  } catch (e) {
    dispatch({ type: "CONFIRM_PAYMENT_INTENT_ERROR", error: { ...e } });
  }
};

export const createUserAvatar = (body) => async (dispatch) => {
  dispatch({ type: "FETCH" });
  try {
    const { data } = await axios({
      url: `/api/user/me/avatar`,
      method: "POST",
      data: body,
      headers: { "Content-Type": "image/jpg" },
    });
    dispatch({ type: "CREATE_USER_AVATAR_SUCCESS", user: data });
  } catch (e) {
    dispatch({ type: "CREATE_USER_AVATAR_ERROR", error: { ...e } });
  }
};

export const editUser = (body) => async (dispatch) => {
  dispatch({ type: "FETCH" });
  try {
    const { data } = await axios({
      url: `/api/user/me`,
      method: "PUT",
      data: body,
      headers: { "Content-Type": "application/json" },
    });
    dispatch({ type: "EDIT_USER_SUCCESS", user: data });
  } catch (e) {
    dispatch({ type: "EDIT_USER_ERROR", error: { ...e } });
  }
};

export const createCode = (body) => async (dispatch) => {
  dispatch({ type: "FETCH" });
  try {
    const { data } = await axios({
      url: `/api/user/review`,
      method: "POST",
      data: body,
      headers: { "Content-Type": "application/json" },
    });
    dispatch({ type: "CREATE_CODE_SUCCESS", data });
  } catch (e) {
    dispatch({ type: "CREATE_CODE_ERROR", error: { ...e } });
  }
};

export const fetchProfile = async (userId) => {
  // TODO clean up here, might be better to use GET, might need dispatch
  try {
    const result = await axios({
      method: "POST",
      url: "/api/user/profile",
      data: { userId },
    });
    // throw if server returns an error message
    if (result.error) throw result.error;
    return result.data;
  } catch (e) {
    console.error(e.message);
  }
};

export const fetchReviewsCount = async (userId) => {
  try {
    const { data } = await axios({
      method: "POST",
      url: "/api/user/profile/reviews",
      data: { userId },
    });
    return data.reviewsCount;
  } catch (e) {
    console.error(e.message);
  }
};

export const fetchProfileComments = async (userId) => {
  try {
    const { data } = await axios({
      method: "POST",
      url: `/api/user/profile/comments`,
      data: { userId },
    });
    return data;
  } catch (e) {
    console.error(e.message);
  }
};
