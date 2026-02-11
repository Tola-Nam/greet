import React from "react";

function CourseCard({ title, instructor, duration }) {
  return (
    <div className="shadow-lg rounded-2xl p-6 w-96 hover:shadow-2xl transition duration-300">
        <h2 className="text-2xl font-bold text-blue-500 mb-3">
          {title}
        </h2>
        <div className="border-t pt-3 text-sm text-gray-700">
          <p><span className="font-semibold">Instructor:</span> {instructor}</p>
          <p><span className="font-semibold">Duration:</span> {duration}</p>
        </div>
    </div>
  );
}

export default CourseCard;
