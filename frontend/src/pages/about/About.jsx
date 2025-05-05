import React from 'react';

const About = () => {
  const handleKnowAboutMe = () => {
    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-100 flex items-center justify-center"
        style={{
          backgroundImage: `url('https://plus.unsplash.com/premium_photo-1663013021590-c3d2ff59030b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative text-center text-white z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">About Me</h1>
          <p className="text-lg md:text-xl">Discover who I am</p>
        </div>
      </div>

      {/* Button Section */}
      <div className="flex-grow flex items-center justify-center p-6">
        <button
          onClick={handleKnowAboutMe}
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-base font-semibold"
        >
          Know About Me
        </button>
      </div>
    </div>
  );
};

export default About;