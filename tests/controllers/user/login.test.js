/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

process.env.NODE_ENV = "test";

// TODO - ensure a test database instance is setup
let User = require("../../../models/User");

let DateUtils = require("../../../common/date-utils");

let HttpStatus = require("http-status-codes");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../../server");
let should = chai.should();

chai.use(chaiHttp);

describe("Login", () => {
  let testUser = undefined;
  let password = "hunter2";

  before(done => {
    // create users before running tests
    User.create({
      email: "test-premium@email.com",
      password: password,
      planExpirationDateTimeUtc: DateUtils.tomorrow()
    }).then(user => {
      testUser = user;
      done();
    });
  });

  after(done => {
    // delete user after running tests
    // will cascade and delete tasks as well
    testUser.destroy().then(() => {
      done();
    });
  });

  describe("Login", () => {
    it("Successfully login with valid user", done => {
      chai
        .request(server)
        .post("/api/v1/user/login")
        .send({
          email: testUser.email,
          password: password
        })
        .end((err, res) => {
          res.should.have.status(HttpStatus.OK);
          res.body.should.be.a("object");
          res.body.should.have.property("profile");

          res.body.profile.should.have.property("email");
          res.body.profile.email.should.equal(testUser.email);

          done();
        });
    });

    it("Valid user cannot login with invalid password", done => {
      chai
        .request(server)
        .post("/api/v1/user/login")
        .send({
          email: testUser.email,
          password: "an-invalid-password"
        })
        .end((err, res) => {
          res.should.have.status(HttpStatus.FORBIDDEN);
          res.body.should.be.a("object");

          res.body.should.have.property("errorCode");

          // TODO - test the specific error code

          done();
        });
    });
  });
});
