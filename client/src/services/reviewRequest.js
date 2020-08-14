import axios from "axios";

export const sendRequest = async (isAccepted, requestId) => {
  try {
    await axios({
      method: "POST",
      data: {
        isAccepted,
        requestId,
      },
      withCredentials: true,
      url: "/api/user/request",
    });
  } catch (error) {
    // TODO - need better error handling
    return console.error("Fail to post request");
  }
};
