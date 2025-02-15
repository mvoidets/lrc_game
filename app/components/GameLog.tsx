"use client";

import { useState } from "react";
import { ScrollContainer } from "./ScrollContainer";

type GameLogProps = {
  gameLog: string[];
};

export default function GameLog({ gameLog }: GameLogProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="fixed bottom-4 right-4 h-14 px-6 m-2 text-lg text-white transition-colors duration-150 bg-teal-500 rounded-lg focus:shadow-outline hover:bg-teal-600"
      >
        Game Log
      </button>

      {isModalOpen && (
        <div className="fixed bottom-4 right-4 w-96 max-w-lg mx-auto p-4 bg-gray-800 border rounded-lg">
          <div className="bg-gray-800 p-4 rounded-lg w-full max-w-sm mx-auto text-left">
            <h3 className="text-2xl font-bold text-white text-center mb-4">
              Game Log
            </h3>

            {/* Game Log Scrollable Container */}
            <div className="max-h-64 overflow-hidden">
              <ScrollContainer>
                {gameLog.map((log, index) => (
                  <div key={index} className="text-sm mb-1 text-white">
                    {log}
                  </div>
                ))}
              </ScrollContainer>
            </div>

            {/* Close Button */}
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-full"
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
