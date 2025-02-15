import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import RulesRef from "./Rulesref";
import AvatarCarousel from "./AvatarCarousel";
// import { logout } from '../lib/actions'
import { boolean } from "zod";
import { signOut } from '../pages/api/auth/[...nextauth]'

const Nav: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarSelected, setAvatarSelected] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [showRules, setShowRules] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const loggedInUser = true;
    setIsLoggedIn(loggedInUser);
  }, []);

  const isGamePage = pathname === "/game/gamepage";
  const isRules = pathname === "/game";

  const handleAvatarSelection = (avatar: string) => {
    setAvatarSelected(true);
    setIsLoggedIn(true);
  };

  const handleSignOut = async () => {
    try {
      const res = await signOut({ redirect: false });
      console.log(res)
      if (Boolean(res)) {
        setIsLoggedIn(false);
        localStorage.clear();

        router.push("/");
      } else {
        console.error("Logout failed:", res);
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-gray-gradient bg-[length:400%_400%] animate-gradient mt-10 text-white flex justify-between items-center z-30">
      <div className="text-5xl p-4 font-semibold" style={{ marginLeft: "17%" }}>
        <img src="/images/FLEXDICE.png" className="w-48 h-auto" alt="FlexDice Logo"/>
      </div>
      <div className="p-4" style={{ marginRight: "17%" }}>
        {isGamePage && (
          <div className="flex space-x-4">
            <div
              onMouseEnter={() => setShowRules(true)}
              onMouseLeave={() => setShowRules(false)}
              className="relative"
            >
              <button
                type="button"
                className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600"
              >
                Rules
              </button>
              <div
                className={`absolute left-1/2 transform -translate-x-1/2 mt-2 transition-all duration-300 ease-in-out overflow-hidden ${
                  showRules ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {showRules && <RulesRef />}
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600"
            >
              Sign out
            </button>
          </div>
        )}
        {isRules && (
          <div className="flex space-x-4">
            <Link href="/game/gamepage">
              <button
                type="button"
                className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600"
              >
                Start Game
              </button>
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600"
            >
              Sign out
            </button>
          </div>
        )}
        {isLoggedIn && !isRules && !isGamePage && (
          <button
            type="button"
            onClick={handleSignOut}
            className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600"
          >
            Sign out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
