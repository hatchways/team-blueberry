// need utils/requestHandlers for GET request
const request = require("../utils/requestHandlers");

const config = {
  method: "post",
  url: "http://localhost:3001/api/logout",
};

const logout = async () => {
  try {
    await request.getFromAPI(config);
  } catch (err) {
    console.log(err);
  }
};

module.exports = logout;
