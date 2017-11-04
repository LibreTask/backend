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

describe("Update Task", () => {
  let testUser1 = undefined;
  let testUser2 = undefined;
  let password = "hunter2";

  before(done => {
    // create users before running tests
    User.create({
      email: "test-user1@email.com",
      password: password,
      currentPlan: "premium",
      planExpirationDateTimeUtc: DateUtils.tomorrow()
    }).then(user1 => {
      testUser1 = user1;

      User.create({
        email: "test-user2@email.com",
        password: password,
        currentPlan: "premium",
        planExpirationDateTimeUtc: DateUtils.tomorrow()
      }).then(user2 => {
        testUser2 = user2;

        done();
      });
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

  describe("Task update", () => {
    it("Successfully update a task", done => {
      let taskName = "test name";
      let taskNotes = "test notes";

      let updatedTaskName = "updated name";
      let updatedTaskNotes = "updated notes";

      Task.create({
        name: taskName,
        ownerId: testUser1.id,
        notes: taskNotes
      }).then(testTask => {
        chai
          .request(server)
          .post("/api/v1/task/update")
          .auth(testUser1.id, password)
          .send({
            task: {
              id: testTask.id,
              name: updatedTaskName,
              notes: updatedTaskNotes
            }
          })
          .end((err, res) => {
            res.should.have.status(HttpStatus.OK);
            res.body.should.be.a("object");
            res.body.should.have.property("task");

            res.body.task.should.have.property("notes");
            res.body.task.notes.should.equal(updatedTaskNotes);

            res.body.task.should.have.property("name");
            res.body.task.name.should.equal(updatedTaskName);

            let taskId = res.body.task.id;

            Task.findOne({
              where: {
                id: taskId
              }
            }).then(task => {
              task.name.should.equal(updatedTaskName);
              task.notes.should.equal(updatedTaskNotes);
              done();
            });
          });
      });
    });

    it("Cannot update another user's task", done => {
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
          .post("/api/v1/task/update")
          .auth(testUser2.id, password)
          .send({
            task: {
              id: testTask.id,
              name: taskName,
              notes: taskNotes
            }
          })
          .end((err, res) => {
            res.should.have.status(HttpStatus.NOT_FOUND);
            res.body.should.be.a("object");
            done();
          });
      });
    });
  });
});
