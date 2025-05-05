import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import React from "react";

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  return isSignedIn ? children : <Navigate to="/" />;
}


export default ProtectedRoute;