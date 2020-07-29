import axios from "axios";

export async function userSignUp(email, username, password, confirmPassword) {
  return await axios({
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
}
