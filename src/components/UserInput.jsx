import React from "react";

function UserInput({ onUpdateUsername }) {
  return (
    <input
      type="text"
      placeholder="Enter username..."
      onChange={(e) => onUpdateUsername(e.target.value)}
      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}

export default UserInput;
