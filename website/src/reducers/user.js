/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

import { LOGIN, LOGOUT, UPDATE_PROFILE } from "../actions/user";

const initialState = {
  profile: undefined,
  isLoggedIn: false
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROFILE:
    case LOGIN:
      return {
        isLoggedIn: true,
        profile: action.profile
      };
    case LOGOUT:
      return {
        isLoggedIn: false,
        profile: undefined
      };
    default:
      return state;
  }
}
