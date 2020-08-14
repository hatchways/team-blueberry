import axios from "axios";

export default async function userLogout() {
  return await axios({
    method: "POST",
    withCredentials: true,
    url: "/api/logout",
  });
}
