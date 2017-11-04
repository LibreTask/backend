/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

const passportConfig = require("../auth/passport");
const passport = passportConfig.passport;
const path = require("path");
const premium = require("../auth/premium");

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

  let premiumAuth = [
    // basic auth must come before premium, to prevent redundant checks.
    // the premium auth is to be seen as an extension to basic auth.
    passport.authenticate("basic", { session: false }),
    premium
  ];

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
  /*
  NOTE - Disable upgrade/downgrade during beta
  apiRouter.post(
    "/api/v1/user/upgrade-account",
    basicAuth,
    userController.upgradeProfile
  );
  apiRouter.post(
    "/api/v1/user/downgrade-account",
    premiumAuth, // downgrade requires premium account
    userController.downgradeProfile
  );
  apiRouter.post(
    "/api/v1/user/update-payment-info",
    premiumAuth, // we do not store any payment info when on basic plan
    userController.updatePaymentInfo
  );
  */
  apiRouter.post("/api/v1/task/create", premiumAuth, taskController.createTask);
  apiRouter.post("/api/v1/task/update", premiumAuth, taskController.updateTask);
  apiRouter.post("/api/v1/task/delete", premiumAuth, taskController.deleteTask);
  apiRouter.get(
    "/api/v1/task/get-task-by-id/:query",
    premiumAuth,
    taskController.getTaskById
  );
  apiRouter.get(
    "/api/v1/task/sync-tasks-after-timestamp/:query",
    premiumAuth,
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