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

describe("Update user", () => {
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

  describe("Update user", () => {
    it("Successfully update user", done => {
      let updatedEmail = "an-updated-email@email.com";

      chai
        .request(server)
        .post("/api/v1/user/update")
        .auth(testUser.id, password)
        .send({
          profile: {
            email: updatedEmail
          }
        })
        .end((err, res) => {
          res.should.have.status(HttpStatus.OK);
          res.body.should.be.a("object");
          res.body.should.have.property("profile");

          res.body.profile.should.have.property("email");
          res.body.profile.email.should.equal(updatedEmail);

          User.findOne({
            where: {
              id: testUser.id
            }
          }).then(user => {
            user.email.should.equal(updatedEmail);

            done();
          });
        });
    });

    it("Cannot update user with invalid password", done => {
      chai
        .request(server)
        .post("/api/v1/user/update")
        .auth(testUser.id, "an-invalid-password")
        .send({
          profile: {
            email: "another-email@email.com"
          }
        })
        .end((err, res) => {
          res.should.have.status(HttpStatus.UNAUTHORIZED);
          res.body.should.be.a("object");

          // TODO - test the specific response

          done();
        });
    });
  });
});
