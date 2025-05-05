// pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Users, Calendar, Star, Shield, Clock } from "lucide-react";

const Home = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  // Background images array
  const backgroundImages = [
    "https://img.freepik.com/free-photo/entrepreneurs-meeting-office_23-2148898688.jpg?t=st=1746366722~exp=1746370322~hmac=db6a6854fd8faad2b90f888bbdf75b4c8c46b24fb9ab19bebf3ca90824ecd57f&w=1380", // Replace with actual image paths in production
    "https://img.freepik.com/free-photo/focused-students-using-tablet-discussing-information_1262-14929.jpg?t=st=1746366840~exp=1746370440~hmac=9a197d27bfc190ec81da319a57242e7f2cbadc8d661f9e011b91a072896a3ea7&w=1380",
    "https://img.freepik.com/free-photo/group-three-young-good-looking-startupers-sitting-light-coworking-space-talking-about-future-project-looking-through-design-examples-digital-tablet-friends-smiling-talking-about-work_176420-8284.jpg?t=st=1746366887~exp=1746370487~hmac=8f7f152b687e71de5cd669694ace5ef24ad9569da24632690dbb0316c3e0f30b&w=1380"
  ];

  // Handle scroll position for animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Features data
  const features = [
    {
      icon: <Users size={24} />,
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time updates and shared workspaces."
    },
    {
      icon: <Calendar size={24} />,
      title: "Smart Scheduling",
      description: "Plan and organize events with intelligent calendar management."
    },
    {
      icon: <Star size={24} />,
      title: "Personalized Experience",
      description: "Tailor the platform to your unique workflow needs and preferences."
    },
    {
      icon: <Shield size={24} />,
      title: "Secure & Private",
      description: "Your data stays protected with our enterprise-grade security measures."
    },
    {
      icon: <Clock size={24} />,
      title: "Time-Saving Tools",
      description: "Automate repetitive tasks and focus on what really matters."
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: "This platform transformed how our team works together. Couldn't imagine going back.",
      author: "Sarah J., Product Manager"
    },
    {
      quote: "The intuitive design made adoption across our organization incredibly smooth.",
      author: "Michael T., Director of Operations"
    },
    {
      quote: "Finally found a solution that combines power and simplicity in one package.",
      author: "Elena R., Creative Director"
    }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section with Background Image Slider */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-10 overflow-hidden">
        {/* Background image slider */}
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />
        ))}
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div 
            className="transition-all duration-700 transform translate-y-0"
            style={{
              opacity: 1 - Math.min(scrollPosition / 400, 1),
              transform: `translateY(${Math.min(scrollPosition / 10, 50)}px)`
            }}
          >
            <span className="inline-block px-4 py-1 mb-4 text-sm font-bold tracking-wider text-blue-400 uppercase bg-blue-900 bg-opacity-50 rounded-full">Welcome to the Future</span>
            <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
              A beautiful space for your ideas to grow
            </h1>
            <p className="max-w-2xl mx-auto mb-8 text-xl text-gray-200">
              Discover a seamless experience designed with precision and elegance. Collaborate, organize,
              and create with intuitive tools that adapt to your workflow.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/group" className="px-8 py-3 text-lg font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center group">
                Get Started 
                <ArrowRight className="ml-2 transition transform group-hover:translate-x-1" size={20} />
              </Link>
              <Link to="/calendar" className="px-8 py-3 text-lg font-medium transition bg-white bg-opacity-20 rounded-lg text-gray-50 hover:bg-opacity-30">
                View Calendar
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl px-6 mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold">WHY CHOOSE US</span>
            <h2 className="mt-2 text-4xl font-bold text-gray-900">Powerful Features</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Experience a suite of tools designed to enhance productivity and streamline workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 transition-all duration-500 transform bg-gray-50 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1"
                style={{
                  opacity: scrollPosition > 300 ? 1 : 0,
                  transform: scrollPosition > 300 ? "translateX(0)" : `translateX(${index % 2 === 0 ? -100 : 100}px)`
                }}
              >
                <div className="p-3 mb-4 text-blue-600 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-6xl px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div 
              className="transition-all duration-700"
              style={{
                opacity: scrollPosition > 800 ? 1 : 0,
                transform: scrollPosition > 800 ? "translateY(0)" : "translateY(50px)"
              }}
            >
              <h3 className="text-4xl font-bold">10k+</h3>
              <p className="mt-2 text-blue-200">Active Users</p>
            </div>
            <div 
              className="transition-all duration-700 delay-100"
              style={{
                opacity: scrollPosition > 800 ? 1 : 0,
                transform: scrollPosition > 800 ? "translateY(0)" : "translateY(50px)"
              }}
            >
              <h3 className="text-4xl font-bold">500+</h3>
              <p className="mt-2 text-blue-200">Teams</p>
            </div>
            <div 
              className="transition-all duration-700 delay-200"
              style={{
                opacity: scrollPosition > 800 ? 1 : 0,
                transform: scrollPosition > 800 ? "translateY(0)" : "translateY(50px)"
              }}
            >
              <h3 className="text-4xl font-bold">99.9%</h3>
              <p className="mt-2 text-blue-200">Uptime</p>
            </div>
            <div 
              className="transition-all duration-700 delay-300"
              style={{
                opacity: scrollPosition > 800 ? 1 : 0,
                transform: scrollPosition > 800 ? "translateY(0)" : "translateY(50px)"
              }}
            >
              <h3 className="text-4xl font-bold">24/7</h3>
              <p className="mt-2 text-blue-200">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl px-6 mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold">TESTIMONIALS</span>
            <h2 className="mt-2 text-4xl font-bold text-gray-900">What Our Users Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="p-6 bg-white rounded-lg shadow-sm"
                style={{
                  opacity: scrollPosition > 1100 ? 1 : 0,
                  transform: scrollPosition > 1100 ? "translateX(0)" : `translateX(${(index - 1) * 100}px)`,
                  transition: `all 0.7s ease-out ${index * 0.2}s`
                }}
              >
                <svg className="h-8 w-8 text-blue-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-700 mb-4">{testimonial.quote}</p>
                <p className="font-medium text-gray-900">{testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div 
          className="max-w-4xl px-6 mx-auto text-center"
          style={{
            opacity: scrollPosition > 1400 ? 1 : 0.5,
            transform: scrollPosition > 1400 ? "scale(1)" : "scale(0.95)",
            transition: "all 0.7s ease-out"
          }}
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of teams already experiencing the difference. Start your journey today with a free trial.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/group" className="px-8 py-3 text-lg font-medium bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition flex items-center group">
              Start Free Trial
              <ChevronRight className="ml-1 transition transform group-hover:translate-x-1" size={20} />
            </Link>
            <Link to="/demo" className="px-8 py-3 text-lg font-medium border-2 border-white rounded-lg hover:bg-white hover:bg-opacity-10 transition">
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-6xl px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link to="/integrations" className="hover:text-white transition">Integrations</Link></li>
                <li><Link to="/roadmap" className="hover:text-white transition">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/documentation" className="hover:text-white transition">Documentation</Link></li>
                <li><Link to="/guides" className="hover:text-white transition">Guides</Link></li>
                <li><Link to="/api" className="hover:text-white transition">API</Link></li>
                <li><Link to="/community" className="hover:text-white transition">Community</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link to="/cookies" className="hover:text-white transition">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 border-t border-gray-800 text-center">
            <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;