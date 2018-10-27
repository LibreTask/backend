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

describe("Sync Tasks", () => {
  let testUser1 = undefined;
  let testUser2 = undefined;
  let password = "hunter2";

  let testTask1Id = "task_one_id";
  let testTask1Name = "task_one_name";
  let task1UpdateTime = DateUtils.now();

  let testTask2Id = "task_two_id";
  let testTask2Name = "task_two_name";
  let task2UpdateTime = DateUtils.tomorrow();

  let testTask3Id = "task_three_id";
  let testTask3Name = "task_three_name";
  let task3UpdateTime = DateUtils.tomorrow();

  before(done => {
    // create users before running tests
      User.create({
        email: "test-user2@email.com",
        password: password,
        planExpirationDateTimeUtc: DateUtils.tomorrow()
      }).then(user2 => {
        testUser2 = user2;

        /*
          Insert Tasks into test database using raw SQL so that
          we can circumvent the pre-create hook that would
          override our "updatedAtDateTimeUtc" values.
        */

        // task created by user1
        Task.sequelize
          .query(
            `
            INSERT INTO tasks
            (id, owner_id, name, updated_at_date_time_utc)
            VALUES
            ('${testTask1Id}', '${testUser1.id}', '${testTask1Name}',
              '${task1UpdateTime.toISOString()}')
          `
          )
          .then(() => {
            // another task created by user1
            Task.sequelize
              .query(
                `
              INSERT INTO tasks
              (id, owner_id, name, updated_at_date_time_utc)
              VALUES
              ('${testTask2Id}', '${testUser1.id}', '${testTask2Name}',
                '${task2UpdateTime.toISOString()}')
            `
              )
              .then(() => {
                // task created by user2
                Task.sequelize
                  .query(
                    `
                INSERT INTO tasks
                (id, owner_id, name, updated_at_date_time_utc)
                VALUES
                ('${testTask3Id}', '${testUser2.id}', '${testTask3Name}',
                  '${task3UpdateTime.toISOString()}')
              `
                  )
                  .then(() => {
                    done();
                  });
              });
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

  describe("Sync tasks", () => {
    it("Successfully sync both tasks when querying in past", done => {
      // both test tasks were modified since yesterday, so we should
      // get both of them back
      let yesterday = DateUtils.yesterday().toISOString();

      chai
        .request(server)
        .get(`/api/v1/task/sync-tasks-after-timestamp/timestamp=${yesterday}`)
        .auth(testUser1.id, password)
        .end((err, res) => {
          res.should.have.status(HttpStatus.OK);
          res.body.should.be.a("object");

          res.body.should.have.property("tasks");
          res.body.tasks.length.should.equal(2);

          let nameMatches = 0;

          for (let i = 0; i < res.body.tasks.length; i++) {
            let syncedTask = res.body.tasks[i];

            if (
              syncedTask.name === testTask1Name ||
              syncedTask.name === testTask2Name
            ) {
              nameMatches += 1;
            }
          }

          // ensure we get both tasks that we expect
          nameMatches.should.equal(2);
          done();
        });
    });

    it("Only get tasks that were updated after timestamp", done => {
      // set query timestamp to after task1 was updated
      // and verify that task1 consequently is not returned
      let afterTask1Updated = task1UpdateTime;
      afterTask1Updated.setHours(afterTask1Updated.getHours() + 1);
      afterTask1Updated = afterTask1Updated.toISOString();

      chai
        .request(server)
        .get(
          `/api/v1/task/sync-tasks-after-timestamp/timestamp=${afterTask1Updated}`
        )
        .auth(testUser1.id, password)
        .end((err, res) => {
          res.should.have.status(HttpStatus.OK);
          res.body.should.be.a("object");

          res.body.should.have.property("tasks");
          res.body.tasks.length.should.equal(1);

          res.body.tasks[0].name.should.equal(testTask2Name);
          done();
        });
    });
  });
});
