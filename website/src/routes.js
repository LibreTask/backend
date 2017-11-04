/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

import React from "react";
import { Route, IndexRoute } from "react-router";

import App from "./components/App";
import Home from "./components/Home";
//import About from "./components/About";
import Login from "./components/Login";
import Privacy from "./components/Privacy";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import Terms from "./components/Terms";
import NotFound from "./components/NotFound";
import ConfirmPassword from "./components/ConfirmPassword";
import ConfirmEmail from "./components/ConfirmEmail";
import ForgotPassword from "./components/ForgotPassword";
//import UpgradeAccount from "./components/UpgradeAccount";

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    {/*<Route path="/about" component={About} /> */}
    <Route path="/login" component={Login} />
    <Route path="/privacy" component={Privacy} />
    <Route path="/profile" component={Profile} />
    {/*  <Route path="/profile/upgrade" component={UpgradeAccount} /> */}
    <Route path="/signup" component={Signup} />
    <Route path="/terms" component={Terms} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/confirm-password/:token" component={ConfirmPassword} />
    <Route path="/confirm-email/:token" component={ConfirmEmail} />
    <Route path="*" component={NotFound} />
  </Route>
);
