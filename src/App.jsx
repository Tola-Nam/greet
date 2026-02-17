import { useState } from "react";
import FontSizdeChange from "./components/font-size-change.jsx";
import RegisterForm from "./components/register-form.jsx";
import UserInput from "./components/UserInput.jsx";
import UserCard from "./components/UserCard.jsx";

function App() {
  const [username, setUsername] = useState(null);

  const handleUpdateUsername = (value) => {
    setUsername(value);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-center text-gray-700">
          React State & Props Demo
        </h1>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Register Form */}
          <div className="flex justify-center">
            <RegisterForm />
          </div>

          {/* Font Size Change */}
          <div className="flex justify-center">
            <FontSizdeChange />
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 text-center">
            User Management
          </h2>

          <UserInput onUpdateUsername={handleUpdateUsername} />
          <UserCard username={username} />
        </div>
      </div>
    </div>
  );
}

export default App;
