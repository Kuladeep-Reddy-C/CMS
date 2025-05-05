import React from "react";
import { Link, NavLink } from "react-router-dom";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';

const Navbar = () => {

    const { user } = useUser();
    const { isSignedIn, isLoaded } = useAuth();
    const navLinkClass = ({ isActive }) =>
    isActive ? "text-blue-600 font-semibold" : "text-gray-700";

    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <Link to="/home" className="text-xl font-bold text-blue-700" >Pulse</Link>
        <div className="space-x-6">
            <NavLink to="/home" className={navLinkClass}>Home</NavLink>
            <NavLink to="/group" className={navLinkClass}>Group</NavLink>
            <NavLink to="/calendar" className={navLinkClass}>Calendar</NavLink>
            <NavLink to="/members" className={navLinkClass}>Members</NavLink>
            <NavLink to="/about" className={navLinkClass}>About Creater</NavLink>

        </div>
        <div>
            <UserButton />
        </div>
        {/* <p>{user.id}</p> */}
        </nav>
    );
};

    export default Navbar;
