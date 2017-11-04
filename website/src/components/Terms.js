/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

import React, { Component } from "react";
import AppStyles from "../styles";

class Terms extends Component {
  render() {
    return (
      <div style={AppStyles.mainWindow}>
        <div style={AppStyles.titleText}>Terms of Service</div>
        <div style={AppStyles.content}>
          <h3>Overview</h3>
          <p>
            Welcome to Algernon! Before you create an account, you must read and
            agree to the <a href="/terms">Terms of Service</a> and the{" "}
            <a href="/privacy">Privacy Policy</a>. These two documents are
            collectively referred to as the "Agreement".
          </p>
          <p>
            Although we may attempt to notify you via email of any major changes
            to the Agreement, you should periodically visit this page to review
            the most up-to-date version. Algernon, at its sole discretion,
            reserves the right to modify the Agreement at any time, and you
            agree to be bound by such modifications. If you do not accept and
            abide by the Agreement, you may not use Algernon.
          </p>

          <h3>Description of Service</h3>
          <p>
            Algernon is a task management application (the "Service"). You
            understand and agree that the Service is provided on an AS IS and AS
            AVAILABLE basis. We disclaim all responsibility and liability for
            the availability, timeliness, security or reliability of the
            Service. We also reserve the right to modify, suspend or discontinue
            the Service with or without notice at any time and without any
            liability to you.
          </p>
        </div>
      </div>
    );
  }
}

export default Terms;
