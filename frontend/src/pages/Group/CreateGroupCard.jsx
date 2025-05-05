import React from 'react';
import { Link } from 'react-router-dom';

function CreateGroupCard() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-blue-500 bg-blue-100 px-3 py-1 rounded-full font-semibold">
          HOME
        </span>
        <Link to="/group-form" className="flex items-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-md text-sm font-semibold">
            Create a Group +
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CreateGroupCard;
