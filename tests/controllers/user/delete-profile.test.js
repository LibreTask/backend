/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
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

describe("Delete User", () => {
  let testUser = undefined;
  let password = "hunter2";

  before(done => {
    // create users before running tests
    User.create({
      email: "test-premium@email.com",
      password: password,
      currentPlan: "premium",
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

  describe("Delete User", () => {
    it("Fail to delete user when invalid credentials are provided", done => {
      chai
        .request(server)
        .delete("/api/v1/user/delete/")
        .auth(testUser.id, "an-invalid-password")
        .end((err, res) => {
          res.should.have.status(HttpStatus.UNAUTHORIZED);
          res.body.should.be.a("object");

          // TODO - test the specific response

          done();
        });
    });

    it("Successfully delete user", done => {
      chai
        .request(server)
        .delete("/api/v1/user/delete")
        .auth(testUser.id, password)
        .end((err, res) => {
          res.should.have.status(HttpStatus.OK);
          res.body.should.be.a("object");

          User.findOne({
            where: {
              id: testUser.id
            }
          }).then(user => {
            // after user deletion api invoked, user should no longer
            // exist in the database
            should.equal(user, null);

            done();
          });
        });
    });
  });
});
