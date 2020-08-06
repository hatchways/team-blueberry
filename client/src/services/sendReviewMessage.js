import axios from "axios";

export const sendMessage = async (reviewId, message, codeSnippet) => {
  try {
    const res = await axios({
      method: "POST",
      data: {
        reviewId,
        message,
        codeSnippet,
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
