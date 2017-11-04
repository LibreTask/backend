/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

import React, { Component } from "react";
import { browserHistory } from "react-router";

import { Button } from "react-bootstrap";

import AppStyles from "../styles";

class NotFound extends Component {
  render() {
    return (
      <div style={AppStyles.mainWindow}>
        <div style={AppStyles.centeredTitleText}>
          <h1>Page not found</h1>
          <div style={AppStyles.centerBlockContentNoBorder}>
            <div style={AppStyles.centerContent}>
              <Button
                className="form_button"
                style={AppStyles.formButton}
                bsStyle="primary"
                bsSize="large"
                onClick={() => {
                  browserHistory.push("/");
                }}
              >
                Back to Main
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NotFound;
