/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

process.env.NODE_ENV = "test";

// TODO - ensure a test database instance is setup
let Task = require("../../../models/Task");
let User = require("../../../models/User");

let DateUtils = require("../../../common/date-utils");

let HttpStatus = require("http-status-codes");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../../../server");
let should = chai.should();

chai.use(chaiHttp);

describe("Create Task", () => {
  let basicTestUser = undefined;
  let password = "hunter2";

  before(done => {
    // create users before running tests
    User.create({
        email: "test-basic@email.com",
        password: password,
        planExpirationDateTimeUtc: DateUtils.tomorrow()
      }).then(basicUser => {
        basicTestUser = basicUser;

        done();
      });
    });
  });

  after(done => {
    // delete user after running tests
    // will cascade and delete tasks as well
    basicTestUser.destroy().then(() => {
      done();
    });
  });

  beforeEach(done => {
    // delete all tasks before each test
    Task.destroy({ where: {} }).then(() => {
      done();
    });
  });

  describe("Task creation", () => {
    it("Successfully creates a task", done => {
      let taskName = "test name";
      let taskNotes = "test notes";

      let task = {
        name: taskName,
        notes: taskNotes,
        dueDateTimeUtc: new Date()
      };

      chai
        .request(server)
        .post("/api/v1/task/create")
        .auth(premiumTestUser.id, password)
        .send(task)
        .end((err, res) => {
          res.should.have.status(HttpStatus.OK);
          res.body.should.be.a("object");
          res.body.should.have.property("task");

          res.body.task.should.have.property("notes");
          res.body.task.notes.should.equal(taskNotes);

          res.body.task.should.have.property("name");
          res.body.task.name.should.equal(taskName);

          let taskId = res.body.task.id;

          Task.findOne({
            where: {
              id: taskId
            }
          }).then(task => {
            task.name.should.equal(taskName);
            task.notes.should.equal(taskNotes);
            done();
          });
        });
    });

    it("Task creation fails validation with undefined name", done => {
      let taskName = undefined; // name is required
      let taskNotes = "test notes";

      let task = {
        name: taskName,
        notes: taskNotes,
        dueDateTimeUtc: new Date()
      };

      chai
        .request(server)
        .post("/api/v1/task/create")
        .auth(premiumTestUser.id, password)
        .send(task)
        .end((err, res) => {
          res.should.have.status(HttpStatus.BAD_REQUEST);
          res.body.errorCode.should.be.a("string");
          done();
        });
    });

    it("Task creation fails validation with invalid credentials", done => {
      let taskName = "test notes";
      let taskNotes = "test notes";

      let task = {
        name: taskName,
        notes: taskNotes,
        dueDateTimeUtc: new Date()
      };

      chai
        .request(server)
        .post("/api/v1/task/create")
        .auth(premiumTestUser.id, "an-invalid-password")
        .send(task)
        .end((err, res) => {
          res.should.have.status(HttpStatus.UNAUTHORIZED);
          done();
        });
    });

    it("Task creation fails when user is on basic plan", done => {
      let taskName = "test notes";
      let taskNotes = "test notes";

      let task = {
        name: taskName,
        notes: taskNotes,
        dueDateTimeUtc: new Date()
      };

      chai
        .request(server)
        .post("/api/v1/task/create")
        .auth(basicTestUser.id, basicTestUser.password)
        .send(task)
        .end((err, res) => {
          res.should.have.status(HttpStatus.UNAUTHORIZED);
          done();
        });
    });
  });
});
