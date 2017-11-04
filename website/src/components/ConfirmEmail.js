/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

import React, { Component } from "react";
import { browserHistory } from "react-router";
import { connect } from "react-redux";

import { Button } from "react-bootstrap";

import * as HeaderActions from "../actions/header";
import * as FooterActions from "../actions/footer";

import AppStyles from "../styles";

import * as Client from "../middleware/client";

/*
  This page should be rendered after a user clicks on a email registeration
  link AND the server has deemed it a valid click on a valid link.

  This particular page should be static and make no requests.
*/
class ConfirmEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      successfullyConfirmedEmail: false,
      bannerMessage: ""
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

  _confirmEmail = () => {
    let token = this.props.router.params.token;

    this.setState(
      {
        successfullyConfirmedEmail: false
      },
      () => {
        Client.confirmNewEmail(token)
          .then(response => {
            if (response.errorCode) {
              this.setState({
                bannerMessage: response.errorMessage,
                successfullyConfirmedEmail: false
              });
            } else {
              this.setState({
                successfullyConfirmedEmail: true,
                bannerMessage: ""
              });
            }
          })
          .catch(error => {
            this.setState({
              bannerMessage: error.message,
              successfullyConfirmedEmail: false
            });
          });
      }
    );
  };

  _renderContent = () => {
    if (this.state.successfullyConfirmedEmail) {
      return (
        <div>
          <div style={AppStyles.centeredTitleText}>
            Your email has been successfully confirmed!
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
        <div style={AppStyles.centerContent}>
          <div style={AppStyles.centeredTitleText}>Confirm Email</div>

          <br />

          <Button
            className="form_button"
            style={AppStyles.formButton}
            bsStyle="primary"
            bsSize="large"
            onClick={() => {
              this._confirmEmail();
            }}
          >
            Confirm
          </Button>
        </div>
      );
    }
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

  render() {
    return (
      <div style={AppStyles.centerBlockMain}>
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmEmail);
