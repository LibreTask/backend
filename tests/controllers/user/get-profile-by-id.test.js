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

describe("Get User", () => {
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

  describe("Get User", () => {
    it("Successfully get user with valid credentials", done => {
      chai
        .request(server)
        .get(`/api/v1/user/get-profile-by-id`)
        .auth(testUser.id, password)
        .end((err, res) => {
          res.should.have.status(HttpStatus.OK);
          res.body.should.be.a("object");
          res.body.should.have.property("profile");

          res.body.profile.should.have.property("email");
          res.body.profile.email.should.equal(testUser.email);

          done();
        });
    });

    it("Cannot fetch user when invalid credentials are provided", done => {
      chai
        .request(server)
        .get(`/api/v1/user/get-profile-by-id`)
        .auth(testUser.id, "an-invalid-password")
        .end((err, res) => {
          res.should.have.status(HttpStatus.UNAUTHORIZED);
          res.body.should.be.a("object");

          // TODO - test the specific response

          done();
        });
    });
  });
});
