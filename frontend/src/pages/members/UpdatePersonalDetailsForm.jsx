import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import Loader from "../loading/Loader";

const UpdatePersonalDetailsForm = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${url}/member/studentProfiles`);
        const data = await res.json();
        const currentUserId = user.id;
        const foundData = data.find(
          (student) => student.userId === currentUserId
        );
        if (foundData) {
          setUserData(foundData);
        } else {
          setError("Profile not found.");
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
        setError("Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfiles();
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());

    const res = await fetch(`${url}/member/studentProfiles/${userData._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (res.ok) {
      alert("Profile updated successfully!");
    } else {
      alert("Failed to update profile.");
    }
    console.log("Profile updated:", updatedData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-red-600 text-lg font-semibold bg-red-100 p-6 rounded-2xl shadow-md">
          {error || "Profile not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-64 flex items-center justify-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative text-center text-white z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Update Your Profile</h1>
          <p className="text-lg md:text-xl">Keep your information up to date</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-lg mx-auto p-6">
        <form
          onSubmit={handleProfileUpdate}
          className="bg-white shadow-lg rounded-2xl p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center">Update Your Student Profile</h2>

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              defaultValue={userData.fullName}
              readOnly
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={userData.email}
              readOnly
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              defaultValue={userData.phone}
              readOnly
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Roll Number</label>
            <input
              type="text"
              name="rollNumber"
              defaultValue={userData.rollNumber}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              name="department"
              defaultValue={userData.department}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year of Study</label>
            <input
              type="text"
              name="year"
              defaultValue={userData.year}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              defaultValue={userData.bio}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePersonalDetailsForm;