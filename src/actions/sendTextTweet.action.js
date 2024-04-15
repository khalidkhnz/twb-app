"use server";

import { TwitterDataModel } from "../db/token.schema";
import oauth from "./CollectAuthTokens/OAuthApp";

async function writeTweet({ oauth_token, oauth_token_secret }, tweet) {
  const token = {
    key: oauth_token,
    secret: oauth_token_secret,
  };

  const url = "https://api.twitter.com/2/tweets";

  const headers = oauth.toHeader(
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
      body: JSON.stringify(tweet),
      responseType: "json",
      headers: {
        Authorization: headers["Authorization"],
        "user-agent": "V2CreateTweetJS",
        "content-type": "application/json",
        accept: "application/json",
      },
    });
    const body = await request.json();
    return body;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function sendTweetAction(text) {
  let responseArray = [];
  let screenNames = [];

  try {
    let dbTokens = await TwitterDataModel.find({});

    // Create an array of promises using map
    const tweetPromises = dbTokens.map(async (token) => {
      const messageResponse = await writeTweet(token, {
        text: text,
      });
      responseArray.push(messageResponse);
      screenNames.push(token.screen_name);
      console.log("Using Auth : ", token.screen_name);
    });

    // Wait for all promises to resolve
    await Promise.all(tweetPromises);

    return JSON.stringify({ sentTweet: text, responseArray, screenNames });
  } catch (error) {
    console.error("Error:", error);
    return JSON.stringify({ success: false, message: error.message });
  }
}
