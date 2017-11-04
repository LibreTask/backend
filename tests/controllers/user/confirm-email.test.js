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

describe("Confirm Email", () => {
  let testUser = undefined;
  let password = "hunter2";

  before(done => {
    // create users before running tests
    User.create({
      email: "test-premium@email.com",
      password: password,
      currentPlan: "premium",
      planExpirationDateTimeUtc: DateUtils.tomorrow(),
      confirmEmailToken: "confirm_email_test_token"
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

  describe("Confirm account", () => {
    it("Successfully confirm account with valid token", done => {
      chai
        .request(server)
        .post("/api/v1/user/confirm/email")
        .send({
          token: testUser.confirmEmailToken
        })
        .end((err, res) => {
          res.should.have.status(HttpStatus.OK);
          res.body.should.be.a("object");

          User.findOne({
            where: {
              id: testUser.id
            }
          }).then(user => {
            user.emailIsConfirmed.should.equal(true);

            done();
          });
        });
    });

    it("Cannot confirm account with invalid token", done => {
      chai
        .request(server)
        .post("/api/v1/user/confirm/email")
        .send({
          token: "an_invalid_token"
        })
        .end((err, res) => {
          res.should.have.status(HttpStatus.FORBIDDEN);
          res.body.should.be.a("object");

          // TODO - test exact response

          done();
        });
    });
  });
});
