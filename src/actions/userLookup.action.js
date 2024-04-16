"use server";

import db from "../db/setupDB";
import { TwitterDataModel } from "../db/token.schema";
import oauth from "./CollectAuthTokens/OAuthApp";

async function userLookupByUsername(
  { oauth_token, oauth_token_secret, user_id, screen_name },
  username
) {
  const token = {
    key: oauth_token,
    secret: oauth_token_secret,
  };
  const url = `https://api.twitter.com/2/users/by/username/${username}`;

  const headers = await oauth.toHeader(
    oauth.authorize(
      {
        url,
        method: "GET",
      },
      token
    )
  );

  try {
    const request = await fetch(url, {
      method: "GET",
      responseType: "json",
      headers: {
        Authorization: headers["Authorization"],
        "user-agent": "V2CreateTweetJS",
        "content-type": "application/json",
        accept: "application/json",
      },
    });
    const body = await request.json();

    console.log({
      action: "Lookup",
      screen_name: screen_name,
      target_username: username,
      url: url,
      token: token,
      headers: headers,
      response: body,
    });

    return JSON.stringify(body);
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function userLookupUsingUsername(username) {
  await db();

  try {
    let dbTokens = await TwitterDataModel.aggregate([{ $sample: { size: 1 } }]);

    const messageResponse = await userLookupByUsername(dbTokens[0], username);

    let userIdFromUsername = await JSON.parse(messageResponse);

    userIdFromUsername = userIdFromUsername?.data?.id;

    return JSON.stringify({
      success: true,
      usedScreenName: dbTokens[0]?.screen_name,
      username: username,
      lookupUserId: userIdFromUsername,
    });
  } catch (error) {
    console.error("Error:", error);
    return JSON.stringify({ success: false, message: error.message });
  }
}
