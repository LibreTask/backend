/*
 * @link https://www.algernon.io/
 * @license https://github.com/AlgernonLabs/algernon/blob/master/LICENSE.md
 */

import { invoke, constructAuthHeader } from "./api";

export const login = (email, password) => {
  const request = {
    endpoint: `/api/v1/user/login`,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  };

  return invoke(request);
};

export const signup = (email, password) => {
  const request = {
    endpoint: `/api/v1/user/signup`,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  };

  return invoke(request);
};

export const updateProfile = profile => {
  const request = {
    endpoint: `/api/v1/user/update`,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: constructAuthHeader(profile.id, profile.password)
    },
    body: JSON.stringify({
      profile: profile
    })
  };

  return invoke(request);
};

export const deleteProfile = profile => {
  const request = {
    endpoint: `/api/v1/user/delete`,
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: constructAuthHeader(profile.id, profile.password)
    }
  };

  return invoke(request);
};

export const fetchProfile = (userId, password) => {
  const request = {
    endpoint: `/api/v1/user/get-profile-by-id`,
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: constructAuthHeader(userId, password)
    }
  };

  return invoke(request);
};

export const upgradeAccount = (profile, stripeToken, paymentMethodId) => {
  const request = {
    endpoint: `/api/v1/user/upgrade-account`,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: constructAuthHeader(profile.id, profile.password)
    },
    body: JSON.stringify({
      id: profile.id,
      stripeToken: stripeToken,
      paymentMethodId: paymentMethodId
    })
  };

  return invoke(request);
};

export const downgradeAccount = profile => {
  const request = {
    endpoint: `/api/v1/user/downgrade-account`,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: constructAuthHeader(profile.id, profile.password)
    },
    body: JSON.stringify({
      id: profile.id
    })
  };

  return invoke(request);
};

export const updatePaymentInfo = (profile, stripeToken, paymentMethodId) => {
  const request = {
    endpoint: `/api/v1/user/update-payment-info`,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: constructAuthHeader(profile.id, profile.password)
    },
    body: JSON.stringify({
      id: profile.id,
      stripeToken: stripeToken,
      paymentMethodId: paymentMethodId
    })
  };

  return invoke(request);
};

/*
  This should be invoked when a user requests a password reset.
*/
export const requestPasswordReset = email => {
  const request = {
    endpoint: "/api/v1/user/request-password-reset",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email
    })
  };

  return invoke(request);
};

/*
  After a user requests a password reset and has it sent to their email, this
  should be invoked to submit the newly reset password.
*/
export const confirmNewPassword = (email, password, token) => {
  const request = {
    endpoint: `/api/v1/user/reset-password`,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password,
      token: token
    })
  };

  return invoke(request);
};

/*
  After a user registers or updates their email, this should be
  invoked to submit the subsequent email confirmation token.
*/
export const confirmNewEmail = token => {
  const request = {
    endpoint: "/api/v1/user/confirm/email",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: token
    })
  };

  return invoke(request);
};
