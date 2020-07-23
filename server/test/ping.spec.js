const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app.js");

chai.should();
chai.use(chaiHttp);

describe("/GET ping", () => {
  it("it should return 200", (done) => {
    chai
      .request(app)
      .get(`/ping/`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
