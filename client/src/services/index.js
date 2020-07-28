const parseFetch = async (uri, options) =>
  await fetch(uri, options)
    .then((res) => res.text())
    .then((res) => JSON.parse(res));

export const userService = (body) => async (dispatch) => {
  // set loading state
  dispatch({ type: "FETCH" });

  try {
    const result = await parseFetch(
      "/api/user/me"
      // if options are needed
    );
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
    const result = await parseFetch("/api/payment", {
      method: "POST",
      body: JSON.stringify({ cart }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(result);
    dispatch({ type: "CREATE_PAYMENT_INTENT" });
  } catch (e) {
    dispatch({ type: "CREATE_PAYMENT_INTENT_ERROR", error: { ...e } });
  }
};
