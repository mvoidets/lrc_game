"use client";

import React, { useState, useEffect } from "react";
import { createUser } from "../lib/actions"; // Import the createUser function
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUpPage: React.FC = () => {
  const [username, setUsername] = useState(""); // Changed from email to username
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false); // Track animation state
  const [isSignupSuccess, setIsSignupSuccess] = useState(false); // Track signup success
  const [isFadeOut, setIsFadeOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setIsAnimating(true);
    }, 25);
  }, []);

  const handleFadeOut = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    setIsFadeOut(true);
    setTimeout(() => {
      router.push("/login"); // Navigate after fade-out animation
    }, 500); // Match this to the animation duration
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      // Attempt to create the user
      await createUser(username, password); // Now passing only username and password
      setErrorMessage("");
      setIsSignupSuccess(true); // Set signup success to true

      // Redirect to login page after a delay to show the success message
      setTimeout(() => {
        router.push("/login");
      }, 2000); // Delay the redirect by 2 seconds
    } catch (error) {
      // If the error is related to username being already taken, display a custom message
      if (
        error instanceof Error &&
        error.message === "Username already taken"
      ) {
        setErrorMessage("Username already taken. Please choose another.");
      } else {
        // Log other unexpected errors for debugging
        setErrorMessage("Failed to create user. Please try again.");
        console.error("Unexpected error:", error); // Log only unexpected errors
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black-500 to-indigo-500">
      <div
        className={`bg-gray-800 p-6 rounded-lg shadow-md w-full sm:w-96 transform transition-all duration-500 ${
          isFadeOut
            ? "opacity-0 translate-x-20" // Fade out when navigating
            : isAnimating
            ? "opacity-100 translate-x-0" // Normal animation when loaded
            : "opacity-0 translate-x-20" // Start off-screen for initial animation
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-white">
          Sign Up
        </h2>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        {/* Success notification */}
        {isSignupSuccess && (
          <div className="text-green-500 text-sm mb-4 text-center">
            Signup successful! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter username"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter password"
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-300">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2 w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm your password"
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                {confirmPasswordVisible ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600"
          >
            Sign Up
          </button>
        </form>
        <p className="text-gray-300 text-sm mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            onClick={handleFadeOut}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
