'use client'
import getSession from '../lib/getSession';
import { useState, useEffect } from "react";
import { getUserStats } from "../lib/actions";


export default function GameStats() {

const [userName, setUserName] = useState("");
const [winnings, setWinnings] = useState(0);
const [losses, setLosses] = useState(0);
const [gamesPlayed, setGamesPlayed] = useState(0);
const [isModalOpen, setIsModalOpen] = useState(false);
const [loading, setLoading] = useState(false);

const getAuth = async() => {
      const userData = await getSession()
      console.log('session user data', userData)
      if (userData) {
        
        setUserName(userData.username)
        const stats = await getUserStats(parseInt(userData.id))
        if (stats) {
          setWinnings(stats.winnings);
          setLosses(stats.losses);
          setGamesPlayed(stats.games_played)
          setLoading(true)
        }
      }
  }
  useEffect(() => {
    getAuth()
  }, [])

  
 

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      {loading ?(
        <button
        onClick={openModal}
        className="fixed bottom-4 right-4 h-14 px-6 m-2 text-lg text-white transition-colors duration-150 bg-teal-500 rounded-lg focus:shadow-outline hover:bg-teal-600"
      >
        Game Stats
      </button>
      ): (
        <button
       
        className="fixed bottom-4 right-4 h-14 px-6 m-2 text-lg text-white transition-colors duration-150 bg-teal-500 rounded-lg focus:shadow-outline hover:bg-teal-600"
      >
        Please wait while we load your stats...
      </button>
      )}
        
      {isModalOpen && (
        <div className="fixed bottom-4 right-4 bg-gray-800 p-6 rounded-lg w-80 sm:w-96 max-w-sm mx-auto shadow-lg z-50">
          {/* Adjusting padding to remove excessive margins */}
          <div className="bg-gray-800 p-4 rounded-lg w-full max-w-xs sm:max-w-sm mx-auto text-left">
            <h3 className="text-2xl font-bold text-white text-center mb-4">
              {userName}'s Stats
            </h3>

            <div className="flex justify-between text-white text-md mb-2">
              <span>Winnings:</span>
              <span>{winnings}</span>
            </div>
            <div className="flex justify-between text-white text-md mb-2">
              <span>Losses:</span>
              <span>{losses}</span>
            </div>
            <div className="flex justify-between text-white text-md mb-2">
              <span>Games Played:</span>
              <span>{gamesPlayed}</span>
            </div>

            {/* Close Button */}
            <button
              className="mt-4 bg-red-500 text-white p-2 rounded-lg"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    
  );
}
