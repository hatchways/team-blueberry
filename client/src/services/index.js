export const userService = (body) => async (dispatch) => {
  // set loading state
  dispatch({ type: "FETCH_USER" });

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
