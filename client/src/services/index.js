export const userService = (body) => async (dispatch) => {
  // set loading state
  dispatch({ type: "FETCH" });

  try {
    const result = await fetch(
      "/api/user/me"
      // if options are needed
    )
      .then((res) => res.text())
      .then((res) => JSON.parse(res));
    // throw if server returns an error message
    if (result.error) throw result.error;

    dispatch({ type: "FETCH_USER_SUCCESS", user: result.user });
  } catch (e) {
    dispatch({ type: "FETCH_USER_ERROR", error: { ...e } });
  }
  // on exception
};

export const createPaymentIntent = ({ cart }) => async (dispatch) => {
  dispatch({ type: "FETCH" });

  try {
    // fetch to post payment internet
    console.log(cart);
    dispatch({ type: "CREATE_PAYMENT_INTENT" });
  } catch (e) {
    dispatch({ type: "CREATE_PAYMENT_INTENT_ERROR", error: { ...e } });
  }
};
