"use server";

import db from "../db/setupDB";
import { TwitterDataModel } from "../db/token.schema";
import oauth from "./CollectAuthTokens/OAuthApp";
import { userLookupUsingUsername } from "./userLookup.action";

async function follow(
  { oauth_token, oauth_token_secret, user_id, screen_name },
  userId
) {
  const token = {
    key: oauth_token,
    secret: oauth_token_secret,
  };
  const url = `https://api.twitter.com/2/users/${user_id}/following`;

  const headers = await oauth.toHeader(
    oauth.authorize(
      {
        url,
        method: "POST",
      },
      token
    )
  );

  try {
    const request = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        target_user_id: userId,
      }),
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
      action: "Follow",
      screen_name: screen_name,
      target_user_id: userId,
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

export async function sendFollowAction(username) {
  await db();
  let responseArray = [];
  let screenNames = [];

  let userLookupData = await userLookupUsingUsername(username);
  userLookupData = await JSON.parse(userLookupData);

  let userId = userLookupData?.lookupUserId;

  try {
    let dbTokens = await TwitterDataModel.find({});

    // Create an array of promises using map
    const followPromises = dbTokens.map(async (token) => {
      const messageResponse = await follow(token, userId);
      responseArray.push(messageResponse);
      screenNames.push(token.screen_name);
      console.log("Using Auth : ", token.screen_name);
    });

    // Wait for all promises to resolve
    await Promise.all(followPromises);

    return JSON.stringify({
      success: true,
      sentFollow: { userId, username },
      responseArray,
      screenNames,
    });
  } catch (error) {
    console.error("Error:", error);
    return JSON.stringify({ success: false, message: error.message });
  }
}
