/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

import React, { Component } from "react";
import ReactDOM from "react-dom";

import { Button, Grid, Row, Col, Image, Table } from "react-bootstrap";

import AppConstants from "../constants";
import AppStyles from "../styles";

const styles = {
  content: {
    margin: "auto",
    color: "#272727",
    fontSize: "130%",
    paddingLeft: 0,
    paddingRight: 0
  },
  nonPaddedRowElementContent: {
    display: "inline",
    margin: "auto"
  },
  rowElementContent: {
    display: "inline",
    margin: "auto",
    padding: 20
  },
  rowElementFont: {
    paddingTop: 10,
    fontSize: "125%",
    fontWeight: "bold",
    margin: "auto",
    textAlign: "center"
  },
  rowElementImage: {
    verticalAlign: "top",
    margin: "auto",
    textAlign: "center"
  },
  featureIcon: {
    verticalAlign: "top",
    margin: "auto",
    textAlign: "center",
    padding: "15px",
    borderRadius: "6px",
    maxWidth: "160px",
    maxHeight: "160px",
    background: "black"
  },
  pricingTable: {
    minWidth: 320,
    maxWidth: 400,
    minHeight: 385,
    maxHeight: 400,
    width: "90%",
    backgroundColor: AppStyles.backgroundColor,
    textAlign: "center",
    margin: "auto",

    // required for rounded corners
    borderRadius: 5,
    overflow: "hidden"
  },
  greenCheck: {
    fontSize: "160%",
    color: "green"
  },
  tableHeader: {
    fontSize: "120%",
    fontWeight: "bold",
    textAlign: "center"
  },
  algernonDemo: {
    width: "100%",
    height: "100%",

    // scaled down proportionally from original size
    minWidth: 285,
    minHeight: 296,

    // an individual frame is 346 widty by 360 height
    maxWidth: 346,
    maxHeight: 360
  },
  titleText: {
    color: AppStyles.textOnMainColor,
    fontSize: "240%",
    margin: "auto",
    textAlign: "center",
    paddingTop: 20,
    paddingBottom: 70
  },
  whiteSectionText: {
    color: AppStyles.textOnMainColor,
    fontSize: "200%",
    margin: "auto",
    textAlign: "center",
    paddingTop: 5,
    paddingBottom: 20
  },
  blackSectionSmallText: {
    color: AppStyles.textOnMainColor,
    fontSize: "140%",
    margin: "auto",
    textAlign: "center",
    paddingTop: 5,
    paddingBottom: 5
  },
  blackSectionText: {
    color: "black",
    fontSize: "200%",
    margin: "auto",
    textAlign: "center",
    paddingTop: 5,
    paddingBottom: 5
  },
  blackRow: {
    backgroundColor: "black",
    margin: "auto",
    width: "100%",
    textAlign: "center",
    paddingTop: 30,
    paddingBottom: 30
  },
  whiteRow: {
    backgroundColor: AppStyles.backgroundColor,
    margin: "auto",
    width: "100%",
    textAlign: "center",
    paddingTop: 30,
    paddingBottom: 30
  },
  whiteRowNoBottomPadding: {
    backgroundColor: AppStyles.backgroundColor,
    margin: "auto",
    width: "100%",
    textAlign: "center",
    paddingTop: 30
  },
  whiteRowNoTopPadding: {
    backgroundColor: AppStyles.backgroundColor,
    margin: "auto",
    width: "100%",
    textAlign: "center",
    paddingBottom: 30
  },
  column: {
    float: "none",
    display: "inline-flex",
    verticalAlign: "middle"
  },
  titleColumn: {
    float: "none",
    display: "inline-flex",
    verticalAlign: "top"
  },
  premiumText: {
    fontSize: "110%",
    color: "green"
  }
};

class Home extends Component {
  componentDidUpdate() {
    /*
      This code enables anchor links.
    */
    let hash = this.props.location.hash.replace("#", "");
    if (hash) {
      let node = ReactDOM.findDOMNode(this.refs[hash]);
      if (node) {
        node.scrollIntoView();
      }
    }
  }

  render() {
    let desktopDownloadButton;
    if (navigator.appVersion.indexOf("Win") !== -1) {
      desktopDownloadButton = (
        <div style={styles.nonPaddedRowElementContent}>
          <div style={styles.rowElementImage}>
            <a href={AppConstants.WINDOWS_DOWNLOAD_LINK}>
              <Button
                style={AppStyles.coloredDownloadButton}
                bsStyle="primary"
                bsSize="large"
                onClick={() => {}}
              >
                Download for Windows
              </Button>
            </a>
          </div>
        </div>
      );
    } else if (
      navigator.appVersion.indexOf("Linux") != -1 ||
      navigator.appVersion.indexOf("X11") != -1
    ) {
      desktopDownloadButton = (
        <div style={styles.nonPaddedRowElementContent}>
          <div style={styles.rowElementImage}>
            <a href={AppConstants.LINUX_DOWNLOAD_LINK}>
              <Button
                style={AppStyles.coloredDownloadButton}
                bsStyle="primary"
                bsSize="large"
                onClick={() => {}}
              >
                Download for Linux
              </Button>
            </a>
          </div>
        </div>
      );
    } else {
      // default to macOS
      desktopDownloadButton = (
        <div style={styles.nonPaddedRowElementContent}>
          <div style={styles.rowElementImage}>
            <a href={AppConstants.MAC_DOWNLOAD_LINK}>
              <Button
                style={AppStyles.coloredDownloadButton}
                bsStyle="primary"
                bsSize="large"
                onClick={() => {}}
              >
                Download for Mac
              </Button>
            </a>
          </div>
        </div>
      );
    }

    return (
      <div style={AppStyles.homePage}>
        <Grid fluid style={styles.content}>
          <Row style={styles.blackRow}>
            <Col style={styles.titleColumn} sm={10} md={5}>
              <div style={styles.titleText}>Minimalist task management.</div>
            </Col>
            <Col style={styles.column} sm={10} md={5}>
              <div style={styles.rowElementImage}>
                <Image
                  style={styles.algernonDemo}
                  alt="Algernon desktop application"
                  src="../images/algernon_demo.gif"
                  rounded
                />
              </div>
            </Col>
          </Row>
          <Row style={styles.whiteRowNoBottomPadding}>
            <Col>
              <div style={styles.blackSectionText}>Features</div>
            </Col>
          </Row>
          <Row style={styles.whiteRowNoBottomPadding}>
            <Col style={styles.column} sm={8} md={4}>
              <div style={styles.rowElementContent}>
                <img
                  src="../images/list.png"
                  style={styles.featureIcon}
                  alt="Algernon list diagram"
                />

                <div style={styles.rowElementFont}>Organize your goals</div>
              </div>
            </Col>
            <Col style={styles.column} sm={8} md={4}>
              <div style={styles.rowElementContent}>
                <img
                  src="../images/sync.png"
                  style={styles.featureIcon}
                  alt="Algernon sync diagram"
                />

                <div style={styles.rowElementFont}>Sync across devices</div>
              </div>
            </Col>
          </Row>
          <Row style={styles.whiteRowNoTopPadding}>
            <Col style={styles.column} sm={8} md={4}>
              <div style={styles.rowElementContent}>
                <img
                  src="../images/backup.png"
                  style={styles.featureIcon}
                  alt="Algernon backup diagram"
                />

                <div style={styles.rowElementFont}>Backup unlimited tasks</div>
              </div>
            </Col>
            <Col style={styles.column} sm={8} md={4}>
              <div style={styles.rowElementContent}>
                <img
                  src="../images/offline.png"
                  style={styles.featureIcon}
                  alt="Algernon offline diagram"
                />

                <div style={styles.rowElementFont}>Work completely offline</div>
                {/*
                <div style={styles.rowElementImage}>
                  <Image
                    alt="Algernon open source diagram"
                    src="../images/opensource.png"
                    rounded
                  />
                </div>

                <div style={styles.rowElementFont}>
                  View the source code
                </div>

                */}
              </div>
            </Col>
          </Row>
          <Row style={styles.blackRow}>
            <Col>
              <div style={styles.whiteSectionText}>Pricing</div>
            </Col>
            <Col>
              <div style={styles.rowElementImage}>
                <Table striped bordered condensed style={styles.pricingTable}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>Features</th>
                      <th style={styles.tableHeader}>Basic</th>
                      <th style={styles.tableHeader}>Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Mobile and desktop apps</td>
                      <td style={styles.greenCheck}>✓</td>
                      <td style={styles.greenCheck}>✓</td>
                    </tr>
                    <tr>
                      <td>Unlimited task creation</td>
                      <td style={styles.greenCheck}>✓</td>
                      <td style={styles.greenCheck}>✓</td>
                    </tr>
                    <tr>
                      <td>Offline usage</td>
                      <td style={styles.greenCheck}>✓</td>
                      <td style={styles.greenCheck}>✓</td>
                    </tr>
                    {/*
                    <tr>
                      <td>Open source</td>
                      <td style={styles.greenCheck}>✓</td>
                      <td style={styles.greenCheck}>✓</td>
                    </tr>
                    */}
                    <tr>
                      <td>Sync across devices</td>
                      <td />
                      <td style={styles.greenCheck}>✓</td>
                    </tr>
                    <tr>
                      <td>Unlimited backup</td>
                      <td />
                      <td style={styles.greenCheck}>✓</td>
                    </tr>
                    <tr>
                      <td>Price</td>
                      <td>Free</td>
                      <td>
                        <strike>
                          ${AppConstants.PREMIUM_COST_IN_DOLLARS} / year
                        </strike>
                        <br />
                        <span style={styles.premiumText}>Free during beta</span>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
          <Row style={styles.whiteRowNoBottomPadding}>
            <Col>
              <div style={styles.blackSectionText}>Get it now</div>
              <div>No payment or signup required!</div>
            </Col>
          </Row>
          <Row style={styles.whiteRow}>
            <Col style={styles.column} sm={6} md={4}>
              {desktopDownloadButton}
            </Col>
            <Col style={styles.column} sm={6} md={4}>
              <div style={styles.nonPaddedRowElementContent}>
                <div style={styles.rowElementImage}>
                  <a href={AppConstants.ANDROID_DOWNLOAD_LINK}>
                    <Image
                      style={AppStyles.downloadButton}
                      alt="Algernon Android download image"
                      src="../images/android.png"
                      rounded
                    />
                  </a>
                </div>
              </div>
            </Col>
            {/*
            <Col style={styles.column} sm={6} md={3}>
              <div style={styles.rowElementContent}>
                <div style={styles.rowElementImage}>
                  <a href={AppConstants.IOS_DOWNLOAD_LINK}>
                    <Image
                      style={styles.downloadButton}
                      alt="Algernon iOS download image"
                      src="../images/ios.svg"
                      rounded
                    />
                  </a>
                </div>
              </div>
            </Col>
            */}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Home;
