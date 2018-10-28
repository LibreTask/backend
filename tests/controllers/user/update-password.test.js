/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

process.env.NODE_ENV = "test";

// TODO - ensure a test database instance is setup
let User = require("../../../models/User");

let DateUtils = require("../../../common/date-utils");
let ErrorCodes = require("../../../errors/error-codes");

let HttpStatus = require("http-status-codes");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../../server");
let should = chai.should();

chai.use(chaiHttp);

describe("Update password", () => {
  let testUser = undefined;
  let password = "hunter2";

  before(done => {
    // create users before running tests
    User.create({
      email: "test-premium@email.com",
      password: password,
      planExpirationDateTimeUtc: DateUtils.tomorrow(),
      passwordResetToken: "a_password_reset_token",

      // must be in the future
      passwordResetExpirationDateTimeUtc: DateUtils.tomorrow()
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

  describe("Update password", () => {
    it("Successfully update user password", done => {
      let updatedPassword = "an_updated_password";

      chai
        .request(server)
        .post("/api/v1/user/reset-password")
        .send({
          token: testUser.passwordResetToken,
          password: updatedPassword
        })
        .end((err, res) => {
          res.should.have.status(HttpStatus.OK);
          res.body.should.be.a("object");

          User.findOne({
            where: {
              id: testUser.id
            }
          }).then(user => {
            // TODO - test password hash is as expected
            // user.password.should.equal(User.hashPassword(updatedPassword));

            done();
          });
        });
    });

    it("Cannot update user password with expired token", done => {
      let updatedPassword = "an_updated_password";

      User.findOne({
        where: {
          id: testUser.id
        }
      }).then(user => {
        user.passwordResetToken = "a_password_reset_token";
        user.passwordResetExpirationDateTimeUtc = DateUtils.yesterday();
        user.save().then(resp => {
          chai
            .request(server)
            .post("/api/v1/user/reset-password")
            .send({
              token: testUser.passwordResetToken,
              password: updatedPassword
            })
            .end((err, res) => {
              res.should.have.status(HttpStatus.FORBIDDEN);
              res.body.should.be.a("object");
              res.body.should.have.property("errorCode");

              res.body.errorCode.should.equal(
                ErrorCodes.INVALID_PASSWORD_RESET_TOKEN
              );

              User.findOne({
                where: {
                  id: testUser.id
                }
              }).then(user => {
                // TODO - test password hash

                done();
              });
            });
        });
      });
    });

    it("Cannot update password with invalid token", done => {
      let updatedPassword = "another_updated_password";

      chai
        .request(server)
        .post("/api/v1/user/reset-password")
        .send({
          token: "an-invalid-password",
          password: updatedPassword
        })
        .end((err, res) => {
          res.should.have.status(HttpStatus.FORBIDDEN);
          res.body.should.be.a("object");

          // TODO - test the specific response

          User.findOne({
            where: {
              id: testUser.id
            }
          }).then(user => {
            // TODO - test password hash

            done();
          });
        });
    });
  });
});
