/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { browserHistory } from "react-router";
import { connect } from "react-redux";

import { Navbar, Nav, NavItem } from "react-bootstrap";

import * as UserActions from "../actions/user";
import * as ProfileController from "../controllers/profile";

import AppConstants from "../constants";
import AppStyles from "../styles";

const styles = {
  mainContent: {
    minHeight: "100%",
    backgroundColor: AppStyles.backgroundColor
  },
  titleText: {
    color: AppStyles.textOnMainColor,
    fontSize: "190%",
    cursor: "pointer"
  },
  titleTextMainPage: {
    color: AppStyles.textOnBackgroundColor,
    fontSize: "190%",
    cursor: "pointer"
  },
  navButton: {
    fontSize: "130%",
    display: "inline-flex",
    cursor: "pointer",
    overflow: "visible",
    color: AppStyles.textOnMainColor
  },
  navButtonMainPage: {
    fontSize: "130%",
    display: "inline-flex",
    cursor: "pointer",
    overflow: "visible",
    color: AppStyles.textOnBackgroundColor
  },
  // TODO - fix hidden scrollbar, caused by 'fixed' position navbar

  navbar: {
    // TODO - consider shadow; boxShadow: "0px 2px 4px #939393",
    backgroundColor: AppStyles.mainColor,
    borderRadius: 0,
    borderWidth: 0,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottom: "1px solid black",
    left: 0,
    right: 0,
    top: 0,
    position: "fixed",
    zIndex: AppStyles.navbarZIndex
  },
  navbarMainPage: {
    // TODO - consider shadow; boxShadow: "0px 2px 4px #939393",
    backgroundColor: AppStyles.backgroundColor,
    borderRadius: 0,
    borderWidth: 0,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottom: "2px solid black",
    left: 0,
    right: 0,
    top: 0,
    position: "fixed",
    zIndex: AppStyles.navbarZIndex
  },
  outerFooter: {
    margin: "auto",
    position: "relative",
    paddingTop: 20,
    paddingBottom: 10,
    marginTop: -1 * AppConstants.FOOTER_HEIGHT,
    bottom: 0,
    backgroundColor: AppStyles.backgroundColor
  },
  innerFooter: {
    width: "70%",
    textAlign: "right",
    margin: "auto",
    minWidth: 300,
    backgroundColor: AppStyles.backgroundColor
  },
  footerButton: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: "100%",
    display: "-ms-inline-flexbox",
    display: "inline-flex",
    cursor: "pointer",
    color: AppStyles.linkOnBackgroundColor,
    textDecoration: "none"
  },
  footerText: {
    maxWidth: "15%",
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: "100%",
    display: "inline-flex",
    textDecoration: "none",
    color: AppStyles.linkOnBackgroundColor
  },
  linkText: {
    color: AppStyles.linkOnBackgroundColor,
    textDecoration: "none",
    display: "inline-flex"
  },
  betaText: {
    color: "green",
    fontSize: "65%"
  }
};

class App extends Component {
  _displayMinimalHeader = () => {
    return true;

    /*
    Originally the plan was the only display the minimal header on the main
    page, but I liked it enough to display it everywhere.

      window.location.pathname === "/";
    */
  };

  _constructRightNavGroup = () => {
    let rightNavGroup;

    let navButtonStyle = this._displayMinimalHeader()
      ? styles.navButtonMainPage
      : styles.navButton;

    if (this.props.isLoggedIn) {
      rightNavGroup = (
        <Nav bsStyle="pills" pullRight>
          <NavItem
            eventKey={1}
            onClick={() => {
              browserHistory.push("/profile");
            }}
          >
            <div style={navButtonStyle}>Profile</div>
          </NavItem>
          <NavItem
            eventKey={2}
            onClick={() => {
              this.props.logout();
              ProfileController.logout();
              browserHistory.push("/");
            }}
          >
            <div style={navButtonStyle}>Logout</div>
          </NavItem>
        </Nav>
      );
    } else {
      rightNavGroup = (
        <Nav bsStyle="pills" pullRight>
          <NavItem
            eventKey={1}
            onClick={() => {
              browserHistory.push("/login");
            }}
          >
            <div style={navButtonStyle}>Log In</div>
          </NavItem>
          <NavItem
            eventKey={2}
            onClick={() => {
              browserHistory.push("/signup");
            }}
          >
            <div style={navButtonStyle}>Create Account</div>
          </NavItem>
        </Nav>
      );
    }

    return rightNavGroup;
  };

  _constructHeader = () => {
    if (!this.props.headerIsShown) {
      return <div />;
    }

    let navStyle = this._displayMinimalHeader()
      ? styles.navbarMainPage
      : styles.navbar;
    let titleTextStyle = this._displayMinimalHeader()
      ? styles.titleTextMainPage
      : styles.titleText;

    return (
      <Navbar style={navStyle} inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <div
              style={titleTextStyle}
              onClick={() => {
                browserHistory.push("/");

                // scroll to top
                ReactDOM.findDOMNode(this).scrollTop = 0;
              }}
            >
              <img
                style={AppStyles.primaryIcon}
                src="../images/primary.png"
                alt="Algernon primary icon"
              />{" "}
              Algernon <sup style={styles.betaText}>beta</sup>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>{this._constructRightNavGroup()}</Navbar.Collapse>
      </Navbar>
    );
  };

  _constructFooter = () => {
    if (!this.props.footerIsShown) {
      return <div />;
    }

    return (
      <footer style={styles.outerFooter}>
        <div style={styles.innerFooter}>
          {/*<div
            className="underline_on_hover"
            style={styles.footerButton}
            onClick={() => {
              browserHistory.push("/about");
            }}
          >
            About
          </div>*/}
          <div className="underline_on_hover" style={styles.footerButton}>
            <a
              className="underline_on_hover"
              style={styles.linkText}
              href={AppConstants.SOURCE_CODE}
            >
              Source Code
            </a>
          </div>
          <div style={styles.footerButton}>
            <a
              className="underline_on_hover"
              style={styles.linkText}
              href={`mailto:${AppConstants.CONTACT_FORM_FROM_EMAIL}`}
              target="_top"
            >
              Contact
            </a>
          </div>
          <div
            className="underline_on_hover"
            style={styles.footerButton}
            onClick={() => {
              browserHistory.push("/terms");
            }}
          >
            Terms
          </div>
          <div
            className="underline_on_hover"
            style={styles.footerButton}
            onClick={() => {
              browserHistory.push("/privacy");
            }}
          >
            Privacy
          </div>
          {/*
          <div style={styles.footerText}>
            © 2017 Algernon Labs, LLC
          </div>
          */}
        </div>
      </footer>
    );
  };

  render() {
    // TODO - the title should be an image (eg linode, vultr, digital ocean)

    return (
      <div>
        <div style={styles.mainContent}>
          {this._constructHeader()}

          {this.props.children}
        </div>

        {this._constructFooter()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  footerIsShown: state.footer.isShown,
  headerIsShown: state.header.isShown,
  profile: state.user.profile,
  isLoggedIn: state.user.isLoggedIn
});

const mapDispatchToProps = {
  logout: UserActions.logout
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
