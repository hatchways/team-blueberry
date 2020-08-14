import axios from "axios";

export async function userLogin(login, password) {
  return await axios({
    method: "POST",
    data: {
      email: login,
      password: password,
    },
    withCredentials: true,
    url: "/api/login",
  });
}

export async function userLogout() {
  return await axios({
    method: "POST",
    withCredentials: true,
    url: "/api/logout",
  });
}
