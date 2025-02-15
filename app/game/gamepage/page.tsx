"use client";
import { useState, useEffect } from "react";
import ChatBox from "../../components/ChatBox";
import GameLog from "../../components/GameLog";
import MainDropdown from "../../components/MainDropdown";
import PokerTable from "../../components/gametable"; // Import PokerTable

const GamePage: React.FC = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [gameLog, setGameLog] = useState<string[]>([]);

  useEffect(() => {
    // Retrieve avatar from localStorage on page load
    const storedAvatar = localStorage.getItem("selectedAvatar");
    if (storedAvatar) {
      setSelectedAvatar(storedAvatar);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent">
      <MainDropdown />
      <PokerTable setGameLog={setGameLog} />
      <ChatBox />
      <GameLog gameLog={gameLog} />
    </div>
  );
};

export default GamePage;
