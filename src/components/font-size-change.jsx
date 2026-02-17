import React, { useState } from "react";

function FontSizdeChange() {
  const [fontSize, setFontSize] = useState(24);

  const makeLarge = () => {
    setFontSize(40);
  };

  const makeSmall = () => {
    setFontSize(14);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 text-center w-full max-w-md">
      <h1
        className="font-bold text-gray-700 transition-all duration-300"
        style={{ fontSize: `${fontSize}px` }}
      >
        Hello react
      </h1>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={makeLarge}
          className="px-5 py-2 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition"
        >
          Large
        </button>

        <button
          onClick={makeSmall}
          className="px-5 py-2 bg-red-500 text-white rounded-xl shadow-md hover:bg-red-600 transition"
        >
          Small
        </button>
      </div>
    </div>
  );
}

export default FontSizdeChange;
