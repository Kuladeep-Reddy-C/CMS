import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import Loader from "../loading/Loader"

export default function AllStudents() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [userExists, setUserExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const url = "http://localhost:3000";

  // Fetch all student profiles and current user's profile
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        // Fetch all students
        const res = await fetch(`${url}/member/studentProfiles`);
        const data = await res.json();
        const currentUserId = user.id;
        const presenceOfCurrentUser = data.find(
          (student) => student.userId === currentUserId
        );

        setUserExists(!!presenceOfCurrentUser);
        setStudents(data);
        if (presenceOfCurrentUser) {
          setUserProfile(presenceOfCurrentUser);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, [user]);

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    [student.fullName, student.email, student.department].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Student Directory</h1>
          <p className="text-lg md:text-xl">Connect with your peers</p>
        </div>
      </div>

      {/* Search Bar and Button */}
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <div className="w-full max-w-lg mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 text-lg border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
        <Link to={userExists ? "/members/update-profile" : "/members/create-profile"}>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300">
            {userExists ? "Update Profile" : "Create Profile"}
          </button>
        </Link>
      </div>

      {/* Loader */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      )}



      {/* Student Profiles Grid */}
      {!isLoading && (
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
              >
                <img
                  src={student.profileImage}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-gray-200"
                />
                <h3 className="text-lg font-semibold text-gray-800 text-center">{student.fullName}</h3>
                <p className="text-sm text-gray-600 text-center">{student.email}</p>
                <p className="text-sm text-gray-600 text-center">📞 {student.phone}</p>
                <p className="text-sm text-gray-600 text-center">
                  🎓 {student.year} Year - {student.department}
                </p>
                <p className="text-sm italic text-gray-500 text-center mt-2">{student.bio}</p>
              </div>
            ))}
          </div>
        </div>
      )}

            {/* User Profile (if available) */}
            {!isLoading && userProfile && (
        <div className="max-w-4xl mx-auto mb-12 bg-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h2>
          <div className="flex items-center space-x-6">
            <img
              src={userProfile.imageUrl}
              alt="Your Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{userProfile.fullName}</h3>
              <p className="text-gray-600">{userProfile.email}</p>
              <p className="text-gray-600">📞 {userProfile.phone}</p>
              <p className="text-gray-600">
                🎓 {userProfile.year} Year - {userProfile.department}
              </p>
              <p className="text-sm italic text-gray-500">{userProfile.bio}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}