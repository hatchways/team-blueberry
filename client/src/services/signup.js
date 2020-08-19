import axios from "axios";

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
    dispatch({
      type: "SIGNUP",
      user: result.data.user,
    });
  } catch (e) {
    throw new Error(e.response.data);
  }
}
