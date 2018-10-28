/*
 * @link https://libretask.org/
 * @license https://github.com/LibreTask/backend/blob/master/LICENSE.md
 */

const express = require("express");
const compression = require("compression");
const session = require("express-session");
const bodyParser = require("body-parser");
const lusca = require("lusca");
const errorHandler = require("errorhandler");
const dotenv = require("dotenv");
const path = require("path");
const expressStatusMonitor = require("express-status-monitor");
const RateLimit = require("express-rate-limit");
const constants = require("./common/constants");

/**
 * Load environment variables from .env file, where API keys and passwords
 * are configured.
 *
 * This should happen before anything else, to ensure that subsequent
 * operations are supplied with the proper environment variables.
 */

if (process.env.NODE_ENV === "production") {
  dotenv.load({ path: ".env.production.real" });
} else {
  dotenv.load({ path: ".env.development.real" });
}

const limiter = new RateLimit({
  windowMs: 60 * 1000, // 1 minute
  message: `Too many requests.\nPlease try again later or contact ${constants.SUPPORT_EMAIL}.`,
  max: 45, // no concievable reason why >45 requests are made per minute
  delayMs: 0 // do not delay requests; full speed until rate-limited
});

const passportConfig = require("./auth/passport");
const passport = passportConfig.passport;

const app = express();
app.set("port", 3001); // TODO process.env.PORT || 3000)
app.use(expressStatusMonitor());
app.use(compression());
app.use(limiter); // apply rate limit to all requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  })
);
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(passport.initialize());
app.use(passport.session());
app.use(errorHandler());

/**
 * --- VERY IMPORTANT ---
 * Only allow public directory to be accessed. Otherwise, sensitive
 * documents, such as credentials, could be viewed by anyone.
 */
app.use(
  express.static(path.join(__dirname, "./public"), {
    maxAge: 1000 * 60 * 60 * 24
  }) // cache for one day
);

app.use(require("./controllers/routes")());

app.listen(app.get("port"), () => {
  console.log("Server listening on port %d", app.get("port"));
});

module.exports = app;
