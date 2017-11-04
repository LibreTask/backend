/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

export const FOOTER_SHOW = "FOOTER_SHOW";

export function show() {
  return {
    type: FOOTER_SHOW
  };
}

export const FOOTER_HIDE = "FOOTER_HIDE";

export function hide() {
  return {
    type: FOOTER_HIDE
  };
}
