import axios from "axios";

export default async function userLogout(dispatch) {
  dispatch({ type: "LOGOUT" });
  try {
    await axios({
      method: "POST",
      withCredentials: true,
      url: "/api/logout",
    });
    dispatch({ type: "LOGOUT_USER_SUCCESS" });
  } catch (e) {
    dispatch({ type: "LOGOUT_USER_ERROR", error: { ...e } });
  }
}
