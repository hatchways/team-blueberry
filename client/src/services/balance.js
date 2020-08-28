//Request handler import
const request = require("../utils/requestHandlers");

const updateBalance = async (userId, credits, dispatch) => {
  dispatch({ type: "UPDATE_USER_BALANCE" });
  try {
    const config = {
      method: "put",
      url: "/api/user/balance",
      data: {
        userId,
        credits,
      },
    };

    const response = await request.putToAPI(config);
    dispatch({
      type: "UPDATE_USER_BALANCE_SUCCESS",
      user: response.data,
    });
  } catch (e) {
    dispatch({ type: "UPDATE_USER_BALANCE_ERROR", error: { ...e } });
  }
};

export { updateBalance };
