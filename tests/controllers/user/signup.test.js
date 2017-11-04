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

describe("Signup", () => {
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
    // delete all users at end
    User.destroy({ where: {} }).then(() => {
      done();
    });
  });

  describe("Signup", () => {
    it("Successfully signup with unused email", done => {
      let newUserEmail = "an-untaken-email@email.com";

      chai
        .request(server)
        .post("/api/v1/user/signup")
        .send({
          email: newUserEmail,
          password: password
        })
        .end((err, res) => {
          res.should.have.status(HttpStatus.OK);
          res.body.should.be.a("object");
          res.body.should.have.property("profile");

          res.body.profile.should.have.property("email");
          res.body.profile.email.should.equal(newUserEmail);

          res.body.profile.should.have.property("id");

          let userId = res.body.profile.id;

          User.findOne({
            where: {
              id: userId
            }
          }).then(user => {
            user.email.should.equal(newUserEmail);

            done();
          });
        });
    });

    it("Cannot signup if email is already taken", done => {
      chai
        .request(server)
        .post("/api/v1/user/signup")
        .send({
          email: testUser.email,
          password: password
        })
        .end((err, res) => {
          res.should.have.status(HttpStatus.CONFLICT);
          res.body.should.be.a("object");

          res.body.should.have.property("errorCode");

          // TODO - test the specific error code

          done();
        });
    });
  });
});
