import axios from "axios";

export const sendMessage = async (reviewId, message) => {
  try {
    const res = await axios({
      method: "POST",
      data: {
        reviewId,
        message,
      },
      withCredentials: true,
      url: "/api/user/request/message",
    });
    return res.data;
  } catch (error) {
    // TODO - need better error handling
    return console.error(error.message, "Fail to post request");
  }
};
