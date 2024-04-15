"use server";
require("dotenv").config();
import mongoose from "mongoose";

const URI = process.env.MONGO_URI;
// const URI = process.env.MONGO_URI_LOCAL || "mongodb://localhost:27017/tajtest";

if (!URI) throw new Error("Please add your Mongo URI to .env");

let clientPromise;

const db = async () => {
  const connect = async () => {
    if (mongoose.connection.readyState) {
      console.log("Found Db in Ready State");
      return mongoose.connection.readyState;
    }
    return await mongoose
      .connect(`${URI}`)
      .then(() => {
        console.log("Successfully connected to database");
      })
      .catch((error) => {
        console.log(`Error connecting to database ${error}`);
      });
  };

  if (process.env.NODE_ENV !== "production") {
    if (!global._mongoClientPromise) {
      console.log("Calling DB Connect Method");
      global._mongoClientPromise = await connect();
    }

    clientPromise = global._mongoClientPromise;
    console.log("Got DB from Global");
  } else {
    console.log("Calling DB Connect Method");
    clientPromise = await connect();
  }
  return clientPromise;
};

export default db;
