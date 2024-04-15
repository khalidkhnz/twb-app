"use client";
import React from "react";
import { sendReTweetAction } from "../../../actions/sendReTweet.action";
import { toast } from "sonner";
import { useState } from "react";
import { useEffect } from "react";

const Page = () => {
  const [tweetId, setTweetId] = useState("");

  const [allowed, setAllowed] = useState(false);
  const [pin, setPin] = useState("");

  async function handleSendReTweet() {
    try {
      let response = await sendReTweetAction(tweetId);
      response = await JSON.parse(response);
      console.log(response);
      response.success && toast.success("Done !!!");
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  useEffect(() => {
    if (pin == "8888") {
      setAllowed(true);
    }
  }, [pin]);

  return (
    <div className="bg-[#242424] h-screen text-white flex items-center justify-center">
      {!allowed && (
        <div className=" h-[50vh] w-[350px] rounded-md gap-3 bg-[#212121] border-[1px] border-red-400 flex flex-col items-center justify-center">
          <input
            type="text"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN to unlock"
            className="rounded-lg w-[90%] py-2 px-4 text-black outline-none border-none"
          />
        </div>
      )}
      {allowed && (
        <div className=" h-[50vh] w-[350px] rounded-md gap-3 bg-[#212121] border-[1px] border-red-400 flex flex-col items-center justify-center">
          <h1 className="uppercase">Enter Tweet Id</h1>
          <input
            type="text"
            value={tweetId}
            onChange={(e) => setTweetId(e.target.value)}
            placeholder="Enter Tweet Id"
            className="rounded-lg w-[90%] py-2 px-4 text-black outline-none border-none"
          />
          <button
            onClick={handleSendReTweet}
            className="uppercase border-[1px] border-green-200 w-[50%] py-[8px] rounded-md text-green-200 hover:bg-green-200 hover:text-black"
          >
            Re-Tweet Now
          </button>
          <span className="text-red-600 font-bold text-xs">
            *Do not click multiple times
          </span>
        </div>
      )}
    </div>
  );
};

export default Page;
