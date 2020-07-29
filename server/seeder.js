const seeder = require("mongoose-seed");
require("dotenv").config();
const dbString = process.env.DB_URL || "mongodb://localhost:27017/blueberry";
const env = process.env.NODE_ENV || "development";
const { devSeeds, prodSeeds } = require("./seed");

const data =
  env === "production"
    ? // production seeds
      prodSeeds
    : // test/development seeds
      devSeeds;

module.exports = (mongoUri) =>
  seeder.connect(mongoUri || dbString, () => {
    console.log(`seeding to ${mongoUri || dbString}`);
    seeder.loadModels([
      "./models/user.js",
      "./models/payment.js",
      "./models/review-request.js",
      // ? can this be done programmatically?
    ]);
    seeder.clearModels(["User", "Payment", "Request", "Review"], () => {
      seeder.populateModels(data, () => {
        seeder.disconnect();
      });
    });
  });
