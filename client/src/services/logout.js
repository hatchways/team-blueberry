const request = require("../utils/requestHandlers");

const config = {
  method: "post",
  url: "http://localhost:3001/api/logout",
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
