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
  forgotPassword: {
    color: AppStyles.linkOnBackgroundColor,
    cursor: "pointer",
    fontSize: "110%",
    paddingTop: 15,
    textAlign: "center"
  }
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginError: "",
      isLoggingIn: false,
      currentEmail: "@", // initialize with "@"; it's part of all emails
      currentPassword: "",
      emailValidationError: "",
      passwordValidationError: ""
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

  _login = () => {
    let email = this.state.currentEmail;
    let password = this.state.currentPassword;

    let emailValidationError = "";
    let passwordValidationError = "";

    if (!AppValidator.isValidEmail(email)) {
      emailValidationError = "Email is not valid";
    }

    if (!AppValidator.isValidPassword(password)) {
      passwordValidationError = "Password must be between 6 and 100 characters";
    }

    if (passwordValidationError || emailValidationError) {
      this.setState({
        loginError: "",
        emailValidationError: emailValidationError,
        passwordValidationError: passwordValidationError
      });

      return; // validation failed; cannot login
    }

    this.setState(
      {
        isLoggingIn: true,
        emailValidationError: "",
        passwordValidationError: ""
      },
      () => {
        Client.login(email, password)
          .then(response => {
            if (response.errorCode) {
              this.setState({
                loginError: response.errorMessage,
                isLoggingIn: false
              });
            } else {
              // TODO - fix this hack; do not assign PW in this way
              response.profile.password = password;

              ProfileController.createOrUpdateProfile(response.profile);

              this.props.login(response.profile);

              let redirectToUpgrade = this.props.location.query.upgrade;

              if (redirectToUpgrade) {
                browserHistory.push("/profile/upgrade");
              } else {
                browserHistory.push("/");
              }
            }
          })
          .catch(error => {
            this.setState({
              loginError: error.message,
              isLoggingIn: false
            });
          });
      }
    );
  };

  _constructMessageBanner = () => {
    if (this.state.loginError) {
      return <div style={AppStyles.messageBanner}>{this.state.loginError}</div>;
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

  _loginForm = () => {
    return (
      <form style={AppStyles.form}>
        <FormGroup
          controlId="login-email-form"
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
          controlId="login-password-form"
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
      </form>
    );
  };

  render() {
    return (
      <div
        style={AppStyles.centerBlockMain}
        onKeyPress={e => {
          if (e.key === "Enter") {
            this._login();
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
          <div style={AppStyles.centeredTitleText}>Log In</div>
          <div style={AppStyles.centerContent}>
            {this._loginForm()}

            <Button
              className="form_button"
              style={AppStyles.formButton}
              bsStyle="primary"
              bsSize="large"
              onClick={() => {
                this._login();
              }}
            >
              Log In
            </Button>

            <div
              className="underline_on_hover"
              style={styles.forgotPassword}
              onClick={() => {
                browserHistory.push("/forgot-password");
              }}
            >
              Forgot your password?
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
