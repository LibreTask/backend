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

describe("Request password reset", () => {
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

  describe("Request password reset", () => {
    it("Successfully request password reset with valid user", done => {
      chai
        .request(server)
        .post("/api/v1/user/request-password-reset")
        .send({
          email: testUser.email
        })
        .end((err, res) => {
          res.should.have.status(HttpStatus.OK);
          res.body.should.be.a("object");

          User.findOne({
            where: {
              id: testUser.id
            }
          }).then(user => {
            user.passwordResetToken.should.not.equal(true);

            // TODO - test reset date

            done();
          });
        });
    });

    it("Cannot request password reset with invalid email", done => {
      chai
        .request(server)
        .post("/api/v1/user/request-password-reset")
        .send({
          email: "no_user_has_this@email.com"
        })
        .end((err, res) => {
          res.should.have.status(HttpStatus.NOT_FOUND);
          res.body.should.be.a("object");

          res.body.should.have.property("errorCode");

          // TODO - test the specific error code

          done();
        });
    });
  });
});
