"use server";
import db from "./setupDB";
import { TwitterDataModel } from "./token.schema";

async function addTokenToMONGO(token) {
  await db();
  try {
    // Check if the token already exists
    const existingToken = await TwitterDataModel.findOne({
      oauth_token: token.oauth_token,
      oauth_token_secret: token.oauth_token_secret,
    });

    if (existingToken) {
      console.log("Token already exists:", existingToken);
      return { success: false, message: "Token already exists" };
    }

    // If the token doesn't exist, save it
    let tokenToSave = new TwitterDataModel(token);
    let savedToken = await tokenToSave.save();
    console.log("Token saved successfully:", savedToken);
    return { success: true, message: "Token saved successfully" };
  } catch (error) {
    console.error("Error saving token:", error);
    return { success: false, message: "Error saving token" };
  }
}

export async function saveTokenToDB(token) {
  let res = await addTokenToMONGO(token);
  console.log(res.message);
  return res;
}
