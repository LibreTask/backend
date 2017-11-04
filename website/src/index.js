/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router, browserHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

import * as ProfileController from "./controllers/profile";

import configureStore from "./store/configureStore";
import routes from "./routes";

ProfileController.getMyProfile()
  .then(profile => JSON.parse(profile))
  .then(parsedProfile => {
    const store = configureStore({
      user: {
        profile: parsedProfile,
        isLoggedIn: parsedProfile !== null
      }
    });

    const history = syncHistoryWithStore(browserHistory, store);

    ReactDOM.render(
      <Provider store={store}>
        <Router
          history={history}
          routes={routes}
          onUpdate={() => window.scrollTo(0, 0)}
        />
      </Provider>,
      document.getElementById("root")
    );
  });
