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

describe("Delete Task", () => {
  let testUser = undefined;
  let password = "hunter2";

  before(done => {
    // create users before running tests
    User.create({
      email: "test-user2@email.com",
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
    testUser1.destroy().then(() => {
      testUser2.destroy().then(() => {
        done();
      });
    });
  });

  beforeEach(done => {
    // delete all tasks before each test
    Task.destroy({ where: {} }).then(() => {
      done();
    });
  });

  describe("Task deletion", () => {
    it("Successfully delete a task", done => {
      let taskName = "test name";
      let taskNotes = "test notes";

      Task.create({
        name: taskName,
        ownerId: testUser1.id,
        notes: taskNotes
      }).then(testTask => {
        chai
          .request(server)
          .post("/api/v1/task/delete")
          .auth(testUser1.id, password)
          .send({
            taskId: testTask.id
          })
          .end((err, res) => {
            res.should.have.status(HttpStatus.OK);
            res.body.should.be.a("object");

            Task.findOne({
              where: {
                id: testTask.id
              }
            }).then(task => {
              // ensure task still exists in DB and is marked as deleted
              task.isDeleted.should.equal(true);
              done();
            });
          });
      });
    });

    it("Cannot delete another user's task", done => {
      /*
        Create a task with User1, then try and fail to delete
        the same task with User2.
      */

      let taskName = "test name";
      let taskNotes = "test notes";

      Task.create({
        name: taskName,
        ownerId: testUser1.id,
        notes: taskNotes
      }).then(testTask => {
        chai
          .request(server)
          .post("/api/v1/task/delete")
          .auth(testUser2.id, password)
          .send({
            taskId: testTask.id
          })
          .end((err, res) => {
            res.should.have.status(HttpStatus.NOT_FOUND);
            res.body.should.be.a("object");

            Task.findOne({
              where: {
                id: testTask.id
              }
            }).then(task => {
              // ensure task still exists in DB and is NOT marked as deleted
              task.isDeleted.should.equal(false);
              done();
            });
          });
      });
    });
  });
});
