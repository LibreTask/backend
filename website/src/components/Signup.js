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
import * as UserActions from "../actions/user";
import * as ProfileController from "../controllers/profile";

import AppValidator from "../validator";
import AppStyles from "../styles";

import * as Client from "../middleware/client";

const styles = {
  legal: {
    fontSize: "95%",
    margin: "auto"
  },
  agreement: {
    cursor: "pointer",
    textDecoration: "underline"
  }
};

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signupError: "",
      isSigningUp: false,
      currentEmail: "@", // initialize with "@"; it's part of all emails
      currentPassword: "",
      currentConfirmPassword: "",
      emailValidationError: "",
      passwordValidationError: "",
      confirmPasswordValidationError: ""
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

  _signup = () => {
    let email = this.state.currentEmail;
    let password = this.state.currentPassword;
    let confirmPassword = this.state.currentConfirmPassword;

    let emailValidationError = "";
    let passwordValidationError = "";
    let confirmPasswordValidationError: "";

    if (!AppValidator.isValidEmail(email)) {
      emailValidationError = "Email is not valid";
    }

    if (!AppValidator.isValidPassword(password)) {
      passwordValidationError = "Password must be between 6 and 100 characters";
    }

    // only check whether password equals confirm password, if password is valid
    if (!passwordValidationError && password !== confirmPassword) {
      confirmPasswordValidationError = "Passwords do not match";
    }

    if (
      passwordValidationError ||
      emailValidationError ||
      confirmPasswordValidationError
    ) {
      this.setState({
        signupError: "",
        emailValidationError: emailValidationError,
        passwordValidationError: passwordValidationError,
        confirmPasswordValidationError: confirmPasswordValidationError
      });

      return; // validation failed; cannot signup
    }

    this.setState(
      {
        isSigningUp: true,
        emailValidationError: "",
        passwordValidationError: "",
        confirmPasswordValidationError: ""
      },
      () => {
        Client.signup(email, password)
          .then(response => {
            if (response.errorCode) {
              this.setState({
                signupError: response.errorMessage,
                isSigningUp: false
              });
            } else {
              // TODO - fix this hack; do not assign PW in this way
              response.profile.password = password;

              ProfileController.createOrUpdateProfile(response.profile);
              this.props.login(response.profile);
              browserHistory.push("/");
            }
          })
          .catch(error => {
            this.setState({
              signupError: error.message,
              isSigningUp: false
            });
          });
      }
    );
  };

  _constructMessageBanner = () => {
    if (this.state.signupError) {
      return (
        <div style={AppStyles.messageBanner}>{this.state.signupError}</div>
      );
    } else {
      return <div />;
    }
  };

  emailValidationState = () => {
    // no status, if no error
    return this.state.emailValidationError ? "error" : null;
  };

  passwordValidationState = () => {
    // no status, if no error
    return this.state.passwordValidationError ? "error" : null;
  };

  confirmPasswordValidationState = () => {
    // no status, if no error
    return this.state.confirmPasswordValidationError ? "error" : null;
  };

  _signupForm = () => {
    return (
      <form style={AppStyles.form}>
        <FormGroup
          controlId="confirm-password-email-form"
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
        <FormGroup
          controlId="confirm-password-newpassword-form"
          validationState={this.passwordValidationState()}
        >
          <ControlLabel>Password</ControlLabel>
          <FormControl
            type="password"
            value={this.state.currentPassword}
            placeholder=""
            onChange={e => {
              this.setState({ currentPassword: e.target.value });
            }}
          />
          <FormControl.Feedback />
          <HelpBlock>{this.state.passwordValidationError}</HelpBlock>
        </FormGroup>
        <FormGroup
          controlId="confirm-password-confirmpassword-form"
          validationState={this.confirmPasswordValidationState()}
        >
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            type="password"
            value={this.state.currentConfirmPassword}
            placeholder=""
            onChange={e => {
              this.setState({ currentConfirmPassword: e.target.value });
            }}
          />
          <FormControl.Feedback />
          <HelpBlock>{this.state.confirmPasswordValidationError}</HelpBlock>
        </FormGroup>
      </form>
    );
  };

  render() {
    return (
      <div
        style={AppStyles.centerBlockMain}
        onKeyPress={e => {
          if (e.key === "Enter") {
            this._signup();
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

        <div style={AppStyles.centerBlockContent}>
          <div style={AppStyles.centeredTitleText}>Create Account</div>
          <div style={AppStyles.centerContent}>
            {this._signupForm()}

            <Button
              className="form_button"
              style={AppStyles.formButton}
              bsStyle="primary"
              bsSize="large"
              onClick={() => {
                this._signup();
              }}
            >
              Create Account
            </Button>
            <br />
            <br />
            <div style={styles.legal}>
              By signing up, you are agreeing to the{" "}
              <span
                className="underline_on_hover"
                style={styles.agreement}
                onClick={() => {
                  browserHistory.push("/terms");
                }}
              >
                Terms of Service
              </span>{" "}
              and the{" "}
              <span
                className="underline_on_hover"
                style={styles.agreement}
                onClick={() => {
                  browserHistory.push("/privacy");
                }}
              >
                Privacy Policy
              </span>
              .
            </div>
          </div>
        </div>
        <div
          className="underline_on_hover"
          style={AppStyles.formFooterLink}
          onClick={() => {
            browserHistory.push("/login");
          }}
        >
          Already have an account? Log in.
        </div>
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
  showHeader: HeaderActions.show,
  login: UserActions.login
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
