import axios from "axios";

export const userGet = (body) => async (dispatch) => {
  dispatch({ type: "FETCH_USER" });
  await axios({
    method: "GET",
    withCredentials: true,
    url: "/api/user/me",
  })
    .then((res) => {
      dispatch({ type: "FETCH_USER_SUCCESS", user: res.data });
    })
    .catch((error) => {
      dispatch({ type: "FETCH_USER_ERROR", error: { ...error } });
    });
};
