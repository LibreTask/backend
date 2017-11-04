/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

export const HEADER_SHOW = "HEADER_SHOW";

export function show() {
  return {
    type: HEADER_SHOW
  };
}

export const HEADER_HIDE = "HEADER_HIDE";

export function hide() {
  return {
    type: HEADER_HIDE
  };
}
