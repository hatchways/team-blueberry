const request = require("../utils/requestHandlers");

const config = {
  method: "POST",
  data: {},
  withCredentials: true,
  url: "/api/logout",
};

const logout = async (dispatch) => {
  dispatch({ type: "REMOVE_USER" });
  try {
    await request.postFromAPI(config);
    dispatch({ type: "REMOVE_USER_SUCCESS", user: { id: null } });
  } catch (err) {
    dispatch({ type: "REMOVE_USER_ERROR", error: { ...err } });
  }
};

module.exports = logout;
