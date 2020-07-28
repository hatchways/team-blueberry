// Import Axios
const axios = require("axios");

module.exports = {
  async postToAPI(config) {
    try {
      await axios(config);
    } catch (error) {
      console.error(error.message, error.response.status);
      return false;
    }
  },
};
