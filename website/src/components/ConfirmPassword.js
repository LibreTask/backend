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
  }
};

class ConfirmPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bannerMessage: "",
      currentEmail: "",
      currentPassword: "",
      currentConfirmPassword: "",
      emailValidationError: "",
      successfullyUpdatedPassword: false
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

  _confirmPassword = () => {
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
        bannerMessage: "",
        emailValidationError: emailValidationError,
        passwordValidationError: passwordValidationError,
        confirmPasswordValidationError: confirmPasswordValidationError
      });

      return; // validation failed; cannot signup
    }

    this.setState(
      {
        bannerMessage: "",
        emailValidationError: "",
        passwordValidationError: "",
        confirmPasswordValidationError: "",
        successfullyUpdatedPassword: false
      },
      () => {
        let token = this.props.router.params.token;

        Client.confirmNewPassword(email, password, token)
          .then(response => {
            if (response.errorCode) {
              this.setState({
                bannerMessage: response.errorMessage,
                successfullyUpdatedPassword: false
              });
            } else {
              this.setState({ successfullyUpdatedPassword: true });
            }
          })
          .catch(error => {
            this.setState({
              bannerMessage: error.message,
              successfullyUpdatedPassword: false
            });
          });
      }
    );
  };

  _constructMessageBanner = () => {
    if (this.state.bannerMessage) {
      return (
        <div style={AppStyles.messageBanner}>{this.state.bannerMessage}</div>
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

  _confirmPasswordForm = () => {
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
            placeholder="Email"
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
            placeholder="Password"
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
            placeholder="Confirm Password"
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

  _renderContent = () => {
    if (this.state.successfullyUpdatedPassword) {
      return (
        <div>
          <div style={styles.successText}>
            Your password has successfully been updated!
          </div>

          <br />

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
      );
    } else {
      return (
        <div>
          <div style={AppStyles.centeredTitleText}>Change Password</div>
          <div style={AppStyles.centerContent}>
            {this._confirmPasswordForm()}

            <Button
              className="form_button"
              style={AppStyles.formButton}
              bsStyle="primary"
              bsSize="large"
              onClick={() => {
                this._confirmPassword();
              }}
            >
              Reset Password
            </Button>
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
            this._confirmPassword();
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

        <div style={AppStyles.centerBlockContent}>{this._renderContent()}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPassword);
