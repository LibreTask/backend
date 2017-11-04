/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

import { HEADER_SHOW, HEADER_HIDE } from "../actions/header";

const initialState = {
  isShown: true
};

export default function headerReducer(state = initialState, action) {
  switch (action.type) {
    case HEADER_HIDE:
      return {
        ...state,
        isShown: false
      };
    case HEADER_SHOW:
      return {
        ...state,
        isShown: true
      };
    default:
      return state;
  }
}
