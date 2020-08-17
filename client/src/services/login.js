import axios from "axios";

export default async function userLogin(login, password, dispatch) {
  try {
    const result = await axios({
      method: "POST",
      data: {
        email: login,
        password: password,
      },
      withCredentials: true,
      url: "/api/login",
    });
    dispatch({
      type: "LOGIN",
      user: result.data.user,
    });
  } catch (e) {
    throw new Error(e.response.data);
  }
}
