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
      secret: data.clientSecret,
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
