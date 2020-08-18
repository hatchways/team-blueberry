import axios from "axios";
import socket from "./sockets";

export default async function userSignUp(
  email,
  username,
  password,
  confirmPassword,
  dispatch
) {
  try {
    const result = await axios({
      method: "POST",
      data: {
        email: email,
        name: username,
        password: password,
        confirmPassword: confirmPassword,
      },
      withCredentials: true,
      url: "/api/register",
    });
    socket.login(result.data.user.id);
    dispatch({
      type: "SIGNUP",
      user: result.data.user,
    });
  } catch (e) {
    throw new Error(e.response.data);
  }
}
