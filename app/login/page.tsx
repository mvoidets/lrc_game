"use client";

import { useState, useEffect } from "react";
import { authenticate } from "../lib/actions";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AvatarCarousel from "../components/AvatarCarousel";

const LoginPage: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Default to null
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setIsAnimating(true);
    }, 50);
  }, []);

  // Fetch login state and avatar on component mount
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    const storedAvatar = localStorage.getItem("selectedAvatar");
    const storedUsername = localStorage.getItem("username");

    // Check if user is logged in
    if (storedIsLoggedIn === "true" && storedUsername) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    // Check for stored avatar selection
    if (storedAvatar) {
      setSelectedAvatar(storedAvatar);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMessage("");

    try {
      await authenticate(username, password);
      localStorage.setItem("username", username); 
      localStorage.setItem("isLoggedIn", "true"); 
      setIsLoggedIn(true); 
      //router.push("/rules"); 
    } catch (error) {
      setErrorMessage("Failed to log in. Please check your username or password.");
    } finally {
      setIsPending(false);
    }
  };

  const handleAvatarSelection = (avatar: string) => {
    setSelectedAvatar(avatar);
    localStorage.setItem("selectedAvatar", avatar); // Save avatar to localStorage
  };

  const handleNavigateToRules = () => {
    if (selectedAvatar) {
      router.push("/game"); // Navigate to rules page if avatar is selected
    } else {
      setErrorMessage("Please select an avatar before continuing.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black-500 to-indigo-500">
      <div
        className={`bg-gray-800 p-6 rounded-lg shadow-md w-full sm:w-96 transform transition-all duration-500 ${
          isAnimating ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
        }`}
      >
        {!isLoggedIn ? (
          <>
            <h2 className="text-2xl font-semibold text-center mb-4 text-white">Login</h2>
            {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-300">Username</label>
                <input
                  className="mt-2 w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-300">Password</label>
                <div className="relative">
                  <input
                    className="mt-2 w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600"
                disabled={isPending}
              >
                {isPending ? "Logging In..." : "Log In"}
              </button>

              <p className="text-gray-300 text-sm mt-4">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
              </p>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4 text-white">Welcome!</h2>
            <h3 className="text-xl text-white mb-4">Select Your Avatar</h3>
            <AvatarCarousel onSelectAvatar={handleAvatarSelection} />
            {selectedAvatar && (
              <button
                onClick={handleNavigateToRules}
                className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Feeling Lucky?
              </button>
            )}
            {!selectedAvatar && errorMessage && (
              <div className="text-red-500 text-sm mt-4">{errorMessage}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
