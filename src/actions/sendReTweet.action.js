"use server";

import db from "../db/setupDB";
import { TwitterDataModel } from "../db/token.schema";
import oauth from "./CollectAuthTokens/OAuthApp";

async function reTweet(
  { oauth_token, oauth_token_secret, user_id, screen_name },
  tweetId
) {
  const token = {
    key: oauth_token,
    secret: oauth_token_secret,
  };
  const url = `https://api.twitter.com/2/users/${user_id}/retweets`;

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
        tweet_id: tweetId,
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
      action: "Retweet",
      screen_name: screen_name,
      tweet: tweetId,
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

export async function sendReTweetAction(tweetId) {
  await db();
  let responseArray = [];
  let screenNames = [];

  try {
    let dbTokens = await TwitterDataModel.find({});

    // Create an array of promises using map
    const tweetPromises = dbTokens.map(async (token) => {
      const messageResponse = await reTweet(token, tweetId);
      responseArray.push(messageResponse);
      screenNames.push(token.screen_name);
      console.log("Using Auth : ", token.screen_name);
    });

    // Wait for all promises to resolve
    await Promise.all(tweetPromises);

    return JSON.stringify({
      success: true,
      sentReTweet: tweetId,
      responseArray,
      screenNames,
    });
  } catch (error) {
    console.error("Error:", error);
    return JSON.stringify({ success: false, message: error.message });
  }
}
