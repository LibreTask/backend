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
  HelpBlock,
  Modal
} from "react-bootstrap";

import moment from "moment";

//import StripeCheckout from "react-stripe-checkout";

import * as UserActions from "../actions/user";
import * as ProfileController from "../controllers/profile";

import AppValidator from "../validator";
import AppStyles from "../styles";

import * as Client from "../middleware/client";

const styles = {
  titleText: {
    fontSize: "170%",
    textAlign: "center"
  },
  downgradeText: {
    color: AppStyles.linkOnBackgroundColor,
    cursor: "pointer",
    fontSize: "100%",
    textAlign: "center",
    paddingTop: 10,
    paddingBottom: 10
  },
  accountDeletionDialog: {
    overflow: "visible",
    height: 120 // TODO - fix this hack, so that buttons are visible
  },
  profileModal: {
    zIndex: AppStyles.modalZIndex
  },
  controlLabel: {
    fontSize: "120%"
  }
};

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      updatedProfile: this.props.profile || {},
      emailValidationError: "",
      successMessage: "",
      errorMessage: "",
      isUpdatingProfile: false,
      deleteAccountDialogIsOpen: false,
      downgradeAccountDialogIsOpen: false
    };
  }

  componentDidMount = () => {
    if (!this.props.isLoggedIn) {
      browserHistory.push("/login"); // redirect to main page if not logged in
    } else {
      this._fetchProfile(); // update profile on load/reload
    }
  };

  _fetchProfile = () => {
    let id = this.state.updatedProfile.id;
    let password = this.state.updatedProfile.password;

    this.setState(
      {
        successMessage: "",
        errorMessage: "",
        emailValidationError: ""
      },
      () => {
        Client.fetchProfile(id, password)
          .then(response => {
            if (response.errorCode) {
              this.setState({
                errorMessage: response.errorMessage,
                isUpdatingProfile: false
              });
            } else {
              // TODO - fix this hack; do not assign PW in this way
              response.profile.password = this.state.updatedProfile.password;
              this.setState({ updatedProfile: response.profile });
              this.props.updateProfile(response.profile);

              ProfileController.createOrUpdateProfile(response.profile);
            }
          })
          .catch(error => {
            this.setState({
              errorMessage: error.message,
              isUpdatingProfile: false
            });
          });
      }
    );
  };

  // TODO - move to utils-or-similar
  _hasPremiumSubscription = () => {
    let today = new Date();

    return (
      this.props.profile &&
      this.props.profile.currentPlan &&
      this.props.profile.currentPlan === "premium" &&
      new Date(this.props.profile.planExpirationDateTimeUtc) > today
    );
  };

  _updateProfile = () => {
    let email = this.state.updatedProfile.email;

    let emailValidationError = "";

    if (!AppValidator.isValidEmail(email)) {
      emailValidationError = "Email is not valid";
    }

    if (emailValidationError) {
      this.setState({
        successMessage: "",
        errorMessage: "",
        emailValidationError: emailValidationError
      });

      return; // validation failed; cannot update profile
    }

    this.setState(
      {
        isUpdatingProfile: true,
        successMessage: "",
        errorMessage: "",
        emailValidationError: ""
      },
      () => {
        Client.updateProfile(this.state.updatedProfile)
          .then(response => {
            if (response.errorCode) {
              this.setState({
                errorMessage: response.errorMessage,
                isUpdatingProfile: false
              });
            } else {
              this.setState(
                {
                  successMessage: "Profile successfully updated",
                  isUpdatingProfile: false
                },
                () => {
                  setTimeout(() => {
                    this.setState({ successMessage: "" });
                  }, 1000 * 3); // only display success message for three seconds
                }
              );

              // TODO - fix this hack; do not assign PW in this way
              response.profile.password = this.state.updatedProfile.password;

              ProfileController.createOrUpdateProfile(response.profile);
              this.props.updateProfile(response.profile);
            }
          })
          .catch(error => {
            this.setState({
              errorMessage: error.message,
              isUpdatingProfile: false
            });
          });
      }
    );
  };

  _deleteAccount = () => {
    this.setState(
      {
        successMessage: "",
        errorMessage: "",
        emailValidationError: ""
      },
      () => {
        Client.deleteProfile(this.state.updatedProfile)
          .then(response => {
            if (response.errorCode) {
              this.setState({
                errorMessage: response.errorMessage
              });
            } else {
              this.props.logout();
              ProfileController.logout();
              browserHistory.push("/");
            }
          })
          .catch(error => {
            this.setState({
              errorMessage: error.message
            });
          });
      }
    );
  };

  _downgradeAccount = () => {
    this.setState(
      {
        successMessage: "",
        errorMessage: "",
        emailValidationError: ""
      },
      () => {
        Client.downgradeAccount(this.props.profile)
          .then(response => {
            if (response.errorCode) {
              this.setState({
                errorMessage: response.errorMessage
              });
            } else {
              let updatedProfile = this.props.profile;
              updatedProfile.currentPlan = "basic";
              this.props.updateProfile(updatedProfile);
              ProfileController.createOrUpdateProfile(updatedProfile);

              this.setState(
                {
                  successMessage: "Your account has been downgraded"
                },
                () => {
                  setTimeout(() => {
                    this.setState({ successMessage: "" });
                  }, 1000 * 3); // only display success message for three seconds
                }
              );
            }
          })
          .catch(error => {
            this.setState({
              errorMessage: error.message
            });
          });
      }
    );
  };

  _onPaymentInfoUpdate = token => {
    let stripeToken = token.id;
    let paymentMethodId = token.card.id; // auto-generated credit card identifier

    this.setState(
      {
        successMessage: "",
        errorMessage: ""
      },
      () => {
        Client.updatePaymentInfo(
          this.props.profile,
          stripeToken,
          paymentMethodId
        )
          .then(response => {
            if (response.errorCode) {
              this.setState(
                {
                  errorMessage: response.errorMessage
                },
                () => {
                  setTimeout(() => {
                    this.setState({ errorMessage: "" });
                  }, 1000 * 3); // only display error message for three seconds
                }
              );
            } else {
              this.setState(
                {
                  successMessage: "Your payment info has been updated"
                },
                () => {
                  setTimeout(() => {
                    this.setState({ successMessage: "" });
                    browserHistory.push("/profile"); // login required
                  }, 1000 * 3); // only display success message for three seconds
                }
              );
            }
          })
          .catch(error => {
            this.setState(
              {
                errorMessage: error.message
              },
              () => {
                setTimeout(() => {
                  this.setState({ errorMessage: "" });
                }, 1000 * 3); // only display error message for three seconds
              }
            );
          });
      }
    );
  };

  _constructAccountUpgradeDowngradeButton = () => {
    if (this._hasPremiumSubscription()) {
      return (
        <span>
          {/*
            Remember me just saves info locally. We do not find that
            useful, so do not do it.
          */}
          {/*
          <StripeCheckout
            token={this._onPaymentInfoUpdate}
            email={
              this.props.profile && this.props.profile.email
                ? this.props.profile.email
                : ""
            }
            name="Algernon"
            allowRememberMe={false}
            panelLabel="Update Payment Info"
            description="Upgrade Payment Info"
            image={
              "https://stripe.com/img/documentation/checkout/marketplace.png"
            }
            locale="auto"
            zipCode={true}
            stripeKey="pk_test_yv9mjFfNwC5ac7RHCbCg3jgf"
          >
            <Button
              className="form_button"
              style={AppStyles.formButton}
              bsStyle="primary"
              bsSize="large"
            >
              Update Payment Info
            </Button>
          </StripeCheckout>
          */}
          <form
            id="checkout-form"
            action="/api/v1/user/update-payment-info"
            method="POST"
          />
          <div
            className="underline_on_hover"
            style={styles.downgradeText}
            onClick={() => {
              this.setState({ downgradeAccountDialogIsOpen: true });
            }}
          >
            Downgrade Account
          </div>
        </span>
      );
    } else {
      return (
        <Button
          className="form_button"
          style={AppStyles.formButton}
          bsStyle="primary"
          bsSize="large"
          onClick={() => {
            browserHistory.push("/profile/upgrade");
          }}
        >
          Learn about Premium
        </Button>
      );
    }
  };

  /*
    This function assumes that an errorMessage and
    successMessage cannot exist simultaneously.
  */
  _constructMessageBanner = () => {
    if (this.state.errorMessage) {
      return <div style={AppStyles.errorBanner}>{this.state.errorMessage}</div>;
    }
    if (this.state.successMessage) {
      return (
        <div style={AppStyles.successBanner}>{this.state.successMessage}</div>
      );
    } else {
      return <div />;
    }
  };

  _constructProfileDeletionDialog = () => {
    return (
      <div style={styles.profileModal}>
        <Modal
          show={this.state.deleteAccountDialogIsOpen}
          onHide={() => {
            this.setState({ deleteAccountDialogIsOpen: false });
          }}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Delete Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete your account?</Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                this.setState({ deleteAccountDialogIsOpen: false });
              }}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                this.setState({ deleteAccountDialogIsOpen: false });
                this._deleteAccount();
              }}
            >
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };

  _constructProfileDowngradeDialog = () => {
    // TODO - improve wording

    let planExpirationDateTimeUtc = this.state.updatedProfile
      .planExpirationDateTimeUtc;

    let formattedExpirationDate = planExpirationDateTimeUtc
      ? moment(planExpirationDateTimeUtc).format("LLLL")
      : "An error has occurred, please check back later";

    return (
      <div style={styles.profileModal}>
        <Modal
          show={this.state.downgradeAccountDialogIsOpen}
          onHide={() => {
            this.setState({ downgradeAccountDialogIsOpen: false });
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              Downgrade Account
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to downgrade your account? This will stop the
            recurring subscription. Your subscription will expire on&nbsp;
            <b> {formattedExpirationDate} </b>.
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                this.setState({ downgradeAccountDialogIsOpen: false });
              }}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                this.setState({ downgradeAccountDialogIsOpen: false });
                this._downgradeAccount();
              }}
            >
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };

  emailValidationState = () => {
    // no status, if no error
    return this.state.emailValidationError ? "error" : null;
  };

  _expirationDateDisplay = () => {
    if (this._hasPremiumSubscription()) {
      let planExpirationDateTimeUtc = this.state.updatedProfile
        .planExpirationDateTimeUtc;

      let formattedExpirationDate = planExpirationDateTimeUtc
        ? moment(planExpirationDateTimeUtc).format("LLLL")
        : "An error has occurred, please check back later";

      return (
        <FormGroup>
          <ControlLabel style={styles.controlLabel}>
            Premium Plan Expiration
          </ControlLabel>
          <FormControl.Static>{formattedExpirationDate}</FormControl.Static>
        </FormGroup>
      );
    } else {
      return <span />; // no premium subscription; nothing to display
    }
  };

  _profileUpdateForm = () => {
    return (
      <form style={AppStyles.form}>
        <FormGroup
          controlId="login-password-form"
          validationState={this.emailValidationState()}
        >
          <ControlLabel style={styles.controlLabel}>Email</ControlLabel>
          <FormControl
            type="email"
            value={this.state.updatedProfile.email || ""}
            placeholder="Email"
            onChange={e => {
              let updatedProfile = this.state.updatedProfile;
              updatedProfile.email = e.target.value;
              this.setState({ updatedProfile: updatedProfile });
            }}
          />
          <FormControl.Feedback />
          <HelpBlock>{this.state.emailValidationError}</HelpBlock>
        </FormGroup>
        {/* NOTE - disable expiration display during beta
        {this._expirationDateDisplay()}
        */}
      </form>
    );
  };

  render() {
    return (
      <div style={AppStyles.mainWindow}>
        <div style={AppStyles.centerBlockContentNoBorder}>
          {this._constructMessageBanner()}

          {this._constructProfileDeletionDialog()}

          {this._constructProfileDowngradeDialog()}

          <div>
            <div style={styles.titleText}>Profile</div>
            <div style={AppStyles.centerContent}>
              {this._profileUpdateForm()}

              <Button
                className="form_button"
                style={AppStyles.formButton}
                bsStyle="primary"
                bsSize="large"
                onClick={() => {
                  this._updateProfile();
                }}
              >
                Update Account
              </Button>

              {/*
                NOTE - disable upgrade/downgrade logic during beta

              {this._constructAccountUpgradeDowngradeButton()}
              */}
              <div
                className="underline_on_hover"
                style={styles.downgradeText}
                onClick={() => {
                  this.setState({ deleteAccountDialogIsOpen: true });
                }}
              >
                Delete Account
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.user.profile,
  isLoggedIn: state.user.isLoggedIn
});

const mapDispatchToProps = {
  updateProfile: UserActions.updateProfile,
  logout: UserActions.logout
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
