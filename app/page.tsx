"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);
  const router = useRouter();

  const handleClick = (path: string) => {
    setIsAnimating(true);
    setNextPath(path);
  };

  useEffect(() => {
    if (isAnimating) {
      const timeout = setTimeout(() => {
        if (nextPath) {
          router.push(nextPath);
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [isAnimating, nextPath, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black-500 to-indigo-500">
      <div
        className={`flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-md w-full sm:w-96 transition-all duration-500 ${
          isAnimating ? "opacity-0 translate-x-20" : "opacity-100 translate-x-0"
        }`}
      >
        <div className="mb-4">
          <p className="text-white text-center mb-3">
            <strong>Flex-Dice</strong> is a virtual version of the dice game{" "}
            <em>Left, Right, Center</em>.
          </p>
          <p className="text-white text-center">
            Please login or sign up below to play!
          </p>
        </div>
        <div className="mt-4 w-full">
          <button
            type="button"
            onClick={() => handleClick("/login")}
            className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => handleClick("/signup")}
            className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 mt-2"
          >
            Sign Up
          </button>
        </div>
      </div>
    </main>
  );
}
