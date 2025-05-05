import React from "react";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";

export default function PersonalDetailsForm() {
  const { user } = useUser();
  const url = "http://localhost:3000";

  const [form, setForm] = useState({
    fullName: `${user?.firstName || ''} ${user?.lastName || ''}`,
    email: user?.primaryEmailAddress?.emailAddress || '',
    phone: user?.phoneNumbers?.[0]?.phoneNumber || '',
    rollNumber: '',
    department: '',
    year: '',
    bio: '',
    profileImage: user?.imageUrl || 'https://via.placeholder.com/100',
    userId: user?.id,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(url + '/member/studentProfiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Profile saved successfully!");
    } else {
      alert("Failed to save profile.");
    }
    console.log("Form submitted:", form);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-64 flex items-center justify-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb- acar4.0.3&auto=format&fit=crop&w=1350&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative text-center text-white z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Create Your Profile</h1>
          <p className="text-lg md:text-xl">Showcase your academic journey</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-lg mx-auto p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center">Complete Your Student Profile</h2>

          {/* Profile Picture */}
          <div className="flex justify-center">
            <img
              src={form.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
            />
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              disabled
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              disabled
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              disabled
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Roll Number</label>
            <input
              type="text"
              name="rollNumber"
              value={form.rollNumber}
              onChange={handleChange}
              placeholder="Enter your roll number"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Enter your department"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year of Study</label>
            <input
              type="text"
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="Enter your year of study"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}