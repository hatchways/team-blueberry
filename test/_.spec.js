const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const seeder = require("../seeder");
let mongoServer;
const options = { useNewUrlParser: true };

before(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, options);
  await seeder(mongoUri);
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// included to make output of seed readable
describe("init tests", () => {
  it("seeds should run successfully", (done) => {
    done();
  });
});
