"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AvatarCarousel from "./AvatarCarousel";
import { logout } from "../lib/actions";
import { log } from "console";

const MainDropdown: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null); // Store selected avatar state
  const [username, setUsername] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedUserEmail = localStorage.getItem("userEmail");
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);
    }
  }, []);

  // get usernamefrom local storage
  useEffect(() => {
    // Retrieve avatar from localStorage on page load
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(username);
    }
  }, []);

  // Check if user is logged in on initial load (from localStorage)
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    const storedAvatar = localStorage.getItem("selectedAvatar");

    // If the user is logged in, set the corresponding states
    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true); // Update logged-in state
    }

    if (storedAvatar) {
      setSelectedAvatar(storedAvatar); // Update selected avatar
    }
  }, []); // This runs only once on initial load

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("selectedAvatar");
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setSelectedAvatar(null);
    setUsername(null);
    setUserEmail(null);
  };

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  // Close the dropdown when clicking outside
  const handleClickOutside = (e: any) => {
    if (!e.target.closest(".dropdown") && !e.target.closest(".avatar-btn")) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-40 flex items-center space-x-3">
      {isLoggedIn && selectedAvatar && (
        <img
          className="w-32 h-32 rounded-full ring-2 ring-blue-300 dark:ring-red-500 shadow-lg"
          src={selectedAvatar}
          alt="User Avatar"
          width={48}
          height={48}
        />
      )}
    </div>
  )};

  export default MainDropdown;