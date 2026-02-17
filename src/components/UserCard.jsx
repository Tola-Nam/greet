import React from "react";

function UserCard({ username }) {
  return (
    <div className="bg-blue-500 text-white p-6 rounded-xl text-center">
      <h1 className="text-2xl font-bold">{username ? username : "Guest"}</h1>
    </div>
  );
}

export default UserCard;
