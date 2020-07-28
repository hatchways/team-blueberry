const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app.js");

chai.should();
chai.use(chaiHttp);

describe("index controller", () => {
  describe("register endpoint errors", () => {
    // runs seeds
    require("../seeder");
    const response = [
      ["All fields need to be filled!", 400],
      ["Email already exist!", 409],
      ["Password needs to be at least 6 characters long", 401],
      ["Password and confirm Password do not match", 401],
    ];
    const tests = [
      {
        name: `blank email returns "${response[0].join("--")}"`,
        form: {
          email: "",
          name: "name",
          password: "password",
          confirmPassword: "password",
        },
        response: response[0],
      },
      {
        name: `blank name returns "${response[0].join("--")}"`,
        form: {
          email: "test@example.com",
          name: "",
          password: "password",
          confirmPassword: "password",
        },
        response: response[0],
      },
      {
        name: `blank password returns "${response[0].join("--")}"`,
        form: {
          email: "test@example.com",
          name: "name",
          password: "",
          confirmPassword: "password",
        },
        response: response[0],
      },
      {
        name: `blank confirmPassword returns "${response[0].join("--")}"`,
        form: {
          email: "test@example.com",
          name: "name",
          password: "password",
          confirmPassword: "",
        },
        response: response[0],
      },
      {
        name: `missing name returns "${response[0].join("--")}"`,
        form: {
          email: "test@example.com",
          password: "password",
          confirmPassword: "password",
        },
        response: response[0],
      },
      {
        name: `missing email returns "${response[0].join("--")}"`,
        form: {
          name: "name",
          password: "password",
          confirmPassword: "password",
        },
        response: response[0],
      },
      {
        name: `missing password returns "${response[0].join("--")}"`,
        form: {
          email: "test@example.com",
          name: "name",
          confirmPassword: "password",
        },
        response: response[0],
      },
      {
        name: `missing confirmPassword returns "${response[0].join("--")}"`,
        form: {
          email: "test@example.com",
          name: "name",
          password: "password",
        },
        response: response[0],
      },
      {
        name: `short password returns "${response[2].join("--")}"`,
        form: {
          email: "test@example.com",
          name: "name",
          password: "pass",
          confirmPassword: "pass",
        },
        response: response[2],
      },
      {
        name: `password mismatch returns "${response[3].join("--")}"`,
        form: {
          email: "test@example.com",
          name: "name",
          password: "password",
          confirmPassword: "passwords",
        },
        response: response[3],
      },
      {
        name: `existing email returns "${response[1].join("--")}"`,
        form: {
          email: "user@example.com",
          name: "Not User One",
          password: "password",
          confirmPassword: "password",
        },
        response: response[1],
      },
    ];
    tests.forEach(({ name, form, response: [message, status] }) => {
      it(name, (done) => {
        chai
          .request(app)
          .post(`/api/register`)
          .type("form")
          .send(form)
          .end((err, res) => {
            res.text.should.eql(message);
            res.should.have.status(status);
          });
        done();
      });
    });
  });
});
