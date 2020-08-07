import axios from "axios";
import {
  ContentState,
  EditorState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";

export const sendMessage = async (reviewId, message) => {
  try {
    message = JSON.stringify(convertToRaw(message));
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
