/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

const passportConfig = require("../auth/passport");
const passport = passportConfig.passport;
const path = require("path");

const userController = require("./user");
const taskController = require("./task");
const metaController = require("./meta");
const express = require("express");

const robotsFileContent = `
User-agent: *
Disallow: /confirm-email
Disallow: /confirm-password
Disallow: /profile
Disallow: /api/*

Crawl-delay: 30

User-agent: Yandex
User-agent: YandexBot
User-agent: Baiduspider
User-agent: baiduspider
User-agent: Baiduspider+
User-agent: Baiduspider-video
User-agent: Baiduspider-image
Disallow: /
`;

function apiRoutes() {
  let apiRouter = express.Router();

  /*
    The routes that have been subjected to Basic Authentication, will have the
    authenticated user available for reference via "req.user". Any usage of
    userId should be achieved through "req.user", otherwise authentication is
    pointless - because one user could be authenticated and another user have
    an action performed on their behalf.
  */

  let basicAuth = [passport.authenticate("basic", { session: false })];

  apiRouter.get(
    "/api/v1/meta/get-latest-version/:query",
    metaController.getLatestVersion
  );
  apiRouter.post("/api/v1/user/login", userController.login);
  apiRouter.post("/api/v1/user/signup", userController.signup);
  apiRouter.post("/api/v1/user/confirm/email", userController.confirmEmail);
  apiRouter.post("/api/v1/user/reset-password", userController.updatePassword);
  apiRouter.post(
    "/api/v1/user/request-password-reset",
    userController.requestPasswordReset
  );
  apiRouter.get(
    "/api/v1/user/get-profile-by-id",
    basicAuth,
    userController.getProfileById
  );
  apiRouter.post(
    "/api/v1/user/update",
    basicAuth,
    userController.updateProfile
  );
  apiRouter.delete(
    "/api/v1/user/delete",
    basicAuth,
    userController.deleteProfile
  );
  apiRouter.post("/api/v1/task/create", basicAuth, taskController.createTask);
  apiRouter.post("/api/v1/task/update", basicAuth, taskController.updateTask);
  apiRouter.post("/api/v1/task/delete", basicAuth, taskController.deleteTask);
  apiRouter.get(
    "/api/v1/task/get-task-by-id/:query",
    basicAuth,
    taskController.getTaskById
  );
  apiRouter.get(
    "/api/v1/task/sync-tasks-after-timestamp/:query",
    basicAuth,
    taskController.syncTasksAfterTimestamp
  );

  /**
   * https://en.wikipedia.org/wiki/Robots_exclusion_standard
   */
  apiRouter.get("/robots.txt", function(req, res) {
    res.type("text/plain");
    res.send(robotsFileContent);
  });

  // handle every other route with index.html, which will contain
  // a script tag to your application's JavaScript file(s).
  apiRouter.get("*", function(request, response) {
    response.sendFile(path.resolve(__dirname, "../public", "index.html"));
  });

  return apiRouter;
}

module.exports = apiRoutes;
