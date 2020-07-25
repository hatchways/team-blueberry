// need utils/requestHandlers for GET request
const request = require("../utils/requestHandlers");

const config = {
  method: "get",
  url: "/api/logout",
};

const logout = async () => {
  try {
    return await request.getFromAPI(config);
  } catch (err) {
    return console.log(err);
  }
};

module.exports = logout;
