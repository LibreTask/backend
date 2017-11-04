/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

import RetryableError from "./errors/RetryableError";
import ErrorCodes from "./errors/ErrorCodes";

const API_ROOT = "https://algernon.io";

const MAX_RETRIES = 3;

export function constructAuthHeader(userId, password) {
  if (!userId || !password) {
    throw new Error(
      "Failed to construct auth header because of invalid arguments!"
    );
  }

  return "Basic " + btoa(userId + ":" + password);
}

// TODO - move this to its own module
// TODO - use a hash for this
function humanReadableError(errorCode) {
  try {
    if (errorCode === ErrorCodes.USER_DOES_NOT_EXIST) {
      return "That user does not exist";
    } else if (errorCode === ErrorCodes.EMAIL_IS_ALREADY_USED) {
      return "That email is already used";
    } else if (errorCode === ErrorCodes.INVALID_LOGIN) {
      return "Either email or password is invalid";
    } else if (errorCode === ErrorCodes.INVALID_EMAIL_CONFIRMATION_TOKEN) {
      return "That confirmation token is invalid";
    } else if (errorCode === ErrorCodes.EMAIL_CONFIRMATION_TOKEN_ALREADY_USED) {
      return "That confirmation token has already been used";
    } else if (errorCode === ErrorCodes.INVALID_PASSWORD_RESET_TOKEN) {
      return "That password reset token is invalid";
    } else if (errorCode === ErrorCodes.USER_HAS_ALREADY_UPGRADED) {
      return "This account is already upgraded to premium";
    } else {
      return "Something went wrong, please try again later";
    }
  } catch (err) {
    return "Something went wrong, please try again later";
  }
}

export function invoke(request, retriesRemaining) {
  const { method, headers, body, endpoint } = request;

  const fullUrl =
    endpoint.indexOf(API_ROOT) === -1 ? API_ROOT + endpoint : endpoint;

  let response = _invoke(fullUrl, method, headers, body);

  return response.catch(err => {
    if (retriesRemaining === undefined) {
      retriesRemaining = MAX_RETRIES;
    }

    let shouldRetry = err instanceof RetryableError;
    shouldRetry &= method === "GET";
    shouldRetry &= retriesRemaining >= 1;

    if (shouldRetry) {
      let retryAttemptNumber = MAX_RETRIES - retriesRemaining;

      return _retryWait(retryAttemptNumber).then(() => {
        return invoke(request, retriesRemaining - 1);
      });
    } else {
      throw err;
    }
  });
}

function _invoke(fullUrl, method, headers, body) {
  return fetch(fullUrl, {
    method: method,
    headers: headers,
    body: body
  })
    .then(response => {
      if (response.status >= 500) {
        throw new RetryableError();
      }

      return response;
    })
    .then(response => response.json())
    .then(response => {
      console.log("resonse...");
      console.dir(response);

      if (response.errorCode) {
        response.errorMessage = humanReadableError(response.errorCode);
      }

      if (response.error) {
        // TODO - better handle this case
        response.errorMessage = "Something went wrong, please try again later";
        response.errorCode = "INTERNAL_ERROR";
      }

      return response;
    })
    .catch(error => {
      if (error instanceof RetryableError) {
        throw error;
      } else {
        throw new Error(humanReadableError(error));
      }
    });
}

function _retryWait(retryAttemptNumber) {
  // TODO - refine this value
  let retryDurationMillis = 1000 * 1.5 ** retryAttemptNumber;

  console.log("retrying for: " + retryDurationMillis);

  return new Promise(resolve => setTimeout(resolve, retryDurationMillis));
}
