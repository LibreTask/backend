/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

// GOOD BLACK 272727
// GOOD WHITE eff1f3
// GOOD GREY 696773
/*

Candidate # 1
mainColor: '#3B3561',
textOnMainColor: '#eaeaea',
backgroundColor: '#eaeaea',
textOnBackgroundColor: '#272727',
linkOnMainColor: '#ead94c',
linkOnBackgroundColor: '#da7373',
hoverColor: '#615FFE',
*/

/*
Candidate #2

mainColor: '#242f40',
textOnMainColor: '#e5e5e5',
backgroundColor: '#e5e5e5',
textOnBackgroundColor: '#363636',
linkOnMainColor: '#cca43b',
linkOnBackgroundColor: '#363636',
hoverColor: '#615FFE',
*/

import AppConstants from "./constants";

// TODO - move colors to constants, so that we can reference here?

const STYLES = {
  mainColor: "#3436a5",
  textOnMainColor: "#f7fff7",
  backgroundColor: "white",
  textOnBackgroundColor: "#343434",
  linkOnMainColor: "#e5cf1e",
  linkOnBackgroundColor: "#343434",
  hoverColor: "#247ba0",

  // z-indices arbitrarily chosen for desired style
  navbarZIndex: 100, // navbar overlays everything, except modals
  modalZIndex: 1000, // modal overlays everything
  content: {
    margin: "auto",
    width: "67%",
    color: "#272727",
    minWidth: "300px",
    fontSize: "130%"
  },
  primaryIcon: {
    maxWidth: "30px",
    maxHeight: "30px",
    display: "inline"
  },
  coloredDownloadButton: {
    minHeight: 40,
    maxHeight: 80,
    minWidth: "100px",
    maxWidth: "100%",
    backgroundColor: "#2e3094"
  },
  downloadButton: {
    minHeight: 40,
    maxHeight: 80,
    minWidth: "100px",
    maxWidth: "100%"
  },
  mainWindow: {
    paddingTop: 90, // navbar height
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: AppConstants.FOOTER_HEIGHT,
    // should be same as official "backgroundColor"
    backgroundColor: "white",
    overflow: "auto"
  },
  homePage: {
    paddingTop: 68, // navbar height
    backgroundColor: "white",
    paddingBottom: AppConstants.FOOTER_HEIGHT,
    overflow: "auto"
  },
  titleText: {
    fontSize: "200%",
    fontWeight: "bold",
    color: "#22222",
    margin: "auto",
    width: "67%",
    minWidth: "300px",
    paddingBottom: 20
  },
  centerBlockMain: {
    // should be same as official "backgroundColor"
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    overflow: "scroll"
  },
  centerBlockContent: {
    margin: "auto",
    width: "60%",
    minWidth: "300px",
    maxWidth: "400px",
    borderRadius: "20px",
    borderWidth: "2px",
    borderColor: "black",
    borderStyle: "solid",
    padding: 10,
    backgroundColor: "white" // should be same as official "backgroundColor"
  },
  centerBlockContentNoBorder: {
    margin: "auto",
    width: "60%",
    minWidth: "300px",
    maxWidth: "400px",
    borderRadius: "20px",
    padding: 20,
    backgroundColor: "white" // should be same as official "backgroundColor"
  },
  centerContent: {
    padding: 10
  },
  centeredTitleText: {
    fontSize: "150%",
    textAlign: "center"
  },
  headerText: {
    margin: "auto",
    width: "30%",
    minWidth: "300px",
    fontSize: "180%",
    paddingBottom: 15,

    // should be same as official "textOnBackgroundColor"
    color: "#343434",
    paddingTop: 15,
    textAlign: "center",
    cursor: "pointer"
  },
  messageBanner: {
    // TODO - replace with AppConstants.textOnBackgroundColor
    backgroundColor: "black",
    textAlign: "center",
    // TODO - replace with AppConstants.backgroundColor
    color: "white",
    fontSize: "140%",
    padding: 15
  },
  successBanner: {
    // TODO - replace with AppConstants.successColor
    border: "3px solid #4CAF50",
    borderRadius: 10,
    padding: 10,
    fontSize: "120%",
    textAlign: "center",
    marginBottom: 15
  },
  errorBanner: {
    // TODO - replace with AppConstants.errorColor
    border: "3px solid #F44336",
    borderRadius: 10,
    padding: 10,
    fontSize: "120%",
    textAlign: "center",
    marginBottom: 15
  },
  textField: {
    overflow: "visible", // required to display error messages
    marginBottom: 5, // enough to show validation errors
    marginTop: 5,
    width: "100%"
  },
  formButton: {
    // TODO - replace with AppConstants.mainColor
    backgroundColor: "#3436a5",
    // TODO - replace with AppConstants.textOnMainColor
    color: "#f7fff7",
    marginTop: 2,
    marginBottom: 2,
    borderWidth: 0,
    width: "100%",
    textTransform: "none",
    fontSize: "120%",
    boxShadow: "4px 4px 4px #939393"
  },
  form: {
    marginTop: 2,
    marginButton: 2
  },
  formFooterLink: {
    margin: "auto",
    width: "30%",
    minWidth: "300px",
    paddingBottom: 15,
    paddingTop: 15,
    color: "#343434", //AppStyles.linkOnBackgroundColor,
    cursor: "pointer",
    fontSize: "110%",
    textAlign: "center"
  }
};

module.exports = STYLES;
