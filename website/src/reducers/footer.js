/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

import { FOOTER_HIDE, FOOTER_SHOW } from "../actions/footer";

const initialState = {
  isShown: true
};

export default function footerReducer(state = initialState, action) {
  switch (action.type) {
    case FOOTER_HIDE:
      return {
        ...state,
        isShown: false
      };
    case FOOTER_SHOW:
      return {
        ...state,
        isShown: true
      };
    default:
      return state;
  }
}
