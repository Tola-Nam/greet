import React, { useState } from "react";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
        Register Form
      </h2>

      <form className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </form>

      <div className="border-t my-6"></div>

      <div className="bg-gray-50 p-4 rounded-xl">
        <h3 className="text-lg font-semibold mb-2 text-gray-600">
          Real-Time Preview
        </h3>
        <p className="text-gray-700">
          <span className="font-medium">Name:</span> {name || "—"}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">Email:</span> {email || "—"}
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
