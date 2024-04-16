"use client";

import React, { useState } from "react";
import { userLookupUsingUsername } from "../../../actions/userLookup.action";

const page = () => {
  const [username, setUsername] = useState("");
  const [res, setRes] = useState(null);

  async function lookup() {
    let response = await userLookupUsingUsername(username);
    response = JSON.parse(response);
    setRes(response);
    console.log(response);
  }

  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="relative bg-pink-800 rounded-md w-[350px] h-[400px] gap-5 flex flex-col items-center justify-center">
        <input
          type="text"
          className="px-5 py-2 rounded-md outline-none border-none"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          className="rounded-md px-[20px] py-[10px] text-white bg-green-500 hover:bg-green-600"
          onClick={lookup}
        >
          LOOKUP
        </button>

        {res && (
          <h2 className="absolute bottom-[10px] text-green-400">{`User_Id : ${res?.lookupUserId}`}</h2>
        )}
      </div>
    </div>
  );
};

export default page;
