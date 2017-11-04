/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

import React, { Component } from "react";
import { browserHistory } from "react-router";
import { connect } from "react-redux";

import {
  Button,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
} from "react-bootstrap";

import * as HeaderActions from "../actions/header";
import * as FooterActions from "../actions/footer";

import AppValidator from "../validator";
import AppStyles from "../styles";

import * as Client from "../middleware/client";

const styles = {
  successText: {
    fontSize: "140%",
    textAlign: "center"
  },
  loginText: {
    color: AppStyles.linkOnBackgroundColor,
    cursor: "pointer",
    fontSize: "110%",
    textAlign: "center",
    paddingTop: 10
  }
};

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resetPasswordMessage: "",
      currentEmail: "@", // initialize with "@"; it's part of all emails
      emailValidationError: "",
      resetSuccess: false
    };
  }

  componentDidMount = () => {
    this.props.hideHeader();
    this.props.hideFooter();
  };

  componentWillUnmount = () => {
    this.props.showHeader();
    this.props.showFooter();
  };

  _resetPassword = () => {
    let email = this.state.currentEmail;

    let emailValidationError = "";

    if (!AppValidator.isValidEmail(email)) {
      emailValidationError = "Email is not valid";
    }

    if (emailValidationError) {
      this.setState({
        resetPasswordMessage: "",
        emailValidationError: emailValidationError
      });

      return; // validation failed; cannot login
    }

    this.setState(
      {
        emailValidationError: "",
        resetPasswordMessage: "",
        resetSuccess: false // ensure reset is false before a reset attempt
      },
      () => {
        Client.requestPasswordReset(email)
          .then(response => {
            if (response.errorCode) {
              this.setState({
                resetPasswordMessage: response.errorMessage
              });
            } else {
              this.setState({
                resetSuccess: true
              });
            }
          })
          .catch(error => {
            this.setState({
              resetPasswordMessage: error.message
            });
          });
      }
    );
  };

  _constructMessageBanner = () => {
    if (this.state.resetPasswordMessage) {
      return (
        <div style={AppStyles.messageBanner}>
          {this.state.resetPasswordMessage}
        </div>
      );
    } else {
      return <div />;
    }
  };

  emailValidationState = () => {
    // no status, if no error
    return this.state.emailValidationError ? "error" : null;
  };

  _resetPwForm = () => {
    return (
      <FormGroup
        style={AppStyles.form}
        controlId="forgot-password-email-form"
        validationState={this.emailValidationState()}
      >
        <ControlLabel>Email</ControlLabel>
        <FormControl
          type="email"
          value={this.state.currentEmail}
          placeholder=""
          onChange={e => {
            this.setState({ currentEmail: e.target.value });
          }}
        />
        <FormControl.Feedback />
        <HelpBlock>{this.state.emailValidationError}</HelpBlock>
      </FormGroup>
    );
  };

  _renderContent = () => {
    if (this.state.resetSuccess) {
      return (
        <div style={AppStyles.centerBlockContent}>
          <div style={AppStyles.centerContent}>
            <div style={styles.successText}>
              If this email exists in our system, your password reset request
              was successful.
              <br />
              <br />
              Check your email for a reset link.
            </div>

            <br />

            <Button
              className="form_button"
              style={AppStyles.formButton}
              bsStyle="primary"
              bsSize="large"
              onClick={() => {
                browserHistory.push("/login");
              }}
            >
              Back to Log In
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div style={AppStyles.centerBlockContent}>
            <div style={AppStyles.centeredTitleText}>Forgot Password</div>
            <div style={AppStyles.centerContent}>
              {this._resetPwForm()}

              <Button
                className="form_button"
                style={AppStyles.formButton}
                bsStyle="primary"
                bsSize="large"
                onClick={() => {
                  this._resetPassword();
                }}
              >
                Request Reset
              </Button>

              <div
                className="underline_on_hover"
                style={styles.loginText}
                onClick={() => {
                  browserHistory.push("/login");
                }}
              >
                Know your password? Log in.
              </div>
            </div>
          </div>

          <div
            className="underline_on_hover"
            style={AppStyles.formFooterLink}
            onClick={() => {
              browserHistory.push("/signup");
            }}
          >
            Don't have an account? Sign up.
          </div>
        </div>
      );
    }
  };

  render() {
    return (
      <div
        style={AppStyles.centerBlockMain}
        onKeyPress={e => {
          if (e.key === "Enter") {
            this._resetPassword();
          }
        }}
      >
        {this._constructMessageBanner()}

        <div
          style={AppStyles.headerText}
          onClick={() => {
            browserHistory.push("/");
          }}
        >
          <img
            style={AppStyles.primaryIcon}
            src="../images/primary.png"
            alt="Algernon primary icon"
          />{" "}
          Algernon
        </div>

        {this._renderContent()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  /* TODO */
});

const mapDispatchToProps = {
  hideFooter: FooterActions.hide,
  showFooter: FooterActions.show,
  hideHeader: HeaderActions.hide,
  showHeader: HeaderActions.show
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
