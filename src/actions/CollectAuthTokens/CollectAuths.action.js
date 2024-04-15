"use server";

import oauth from "./OAuthApp";

import { saveTokenToDB } from "../../db/addTokenToMONGO.action";
const { URLSearchParams } = require("url");

async function requestToken() {
  try {
    const requestTokenURL =
      "https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write";
    const authHeader = oauth.toHeader(
      oauth.authorize({
        url: requestTokenURL,
        method: "POST",
      })
    );

    const request = await fetch(requestTokenURL, {
      method: "POST",
      headers: {
        Authorization: authHeader["Authorization"],
      },
    });
    const body = await request.text();

    return Object.fromEntries(new URLSearchParams(body));
  } catch (error) {
    console.error("Error:", error);
  }
}

async function accessToken({ oauth_token, oauth_secret }, verifier) {
  try {
    const url = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`;
    const authHeader = oauth.toHeader(
      oauth.authorize({
        url,
        method: "POST",
      })
    );

    const request = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: authHeader["Authorization"],
      },
    });
    const body = await request.text();
    return Object.fromEntries(new URLSearchParams(body));
  } catch (error) {
    console.error("Error:", error);
  }
}

async function requestTokenAction() {
  const oAuthRequestToken = await requestToken();
  return JSON.stringify({
    token: oAuthRequestToken.oauth_token,
    oAuthRequestToken: oAuthRequestToken,
  });
}

async function accessTokenAction(oAuthRequestToken, pin) {
  const oAuthAccessToken = await accessToken(oAuthRequestToken, pin.trim());
  let res = await saveTokenToDB(oAuthAccessToken);
  return JSON.stringify({
    oAuthAccessToken,
    success: res.success,
    message: res.message,
  });
}

export { requestTokenAction, accessTokenAction };
