import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { socket } from "../lib/socketClient";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import "../globals.css";

// Define types for rooms and messages
interface Room {
  name: string;
  type: 'chat' | 'game';
}

interface CreateRoomParams {
  newRoomName: string;
  type: 'chat' | 'game';
}

interface Message {
  sender: string;
  message: string;
}

// You should replace this with your server URL
// const socket = io("http://localhost:3005");

const Chatbox = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState('');
  const [userName, setUserName] = useState('');
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [isGameRoom, setIsGameRoom] = useState(false);


  useEffect(() => {
    const fetchUserName = async () => {
      const response = await fetch('/api/get-user'); // Replace with your API endpoint
      const data = await response.json();
      setUserName(data.username);
    };
  
    fetchUserName();
  }, []);
  

  useEffect(() => {
    // Fetch available rooms when component mounts
    socket.emit('get-available-rooms');

    socket.on('availableRooms', (rooms) => {
      setAvailableRooms(rooms);
    });

    // Handle receiving message history for chat rooms
    socket.on('messageHistory', (history, room) => {
      setMessages(history);
      setRoom(room);
    });

    // Handle new messages for chat rooms
    socket.on('newMessage', (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    // Handle user joining or leaving a room
    socket.on('user_joined', (message) => {
      setMessages((prevMessages) => [...prevMessages, { sender: 'System', message }]);
    });

    socket.on('user_left', (message) => {
      setMessages((prevMessages) => [...prevMessages, { sender: 'System', message }]);
    });

    // Listen for game-specific messages
    socket.on('gameMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, { sender: 'Game', message }]);
    });

    return () => {
      socket.off('availableRooms');
      socket.off('messageHistory');
      socket.off('newMessage');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('gameMessage');
    };
  }, []);

  // Handle message send event for chat rooms
  const sendMessage = () => {
    if (message.trim() === '') return;

    if (isGameRoom) {
      // For game rooms, use the 'gameMessage' event
      socket.emit('gameMessage', { room, message });
    } else {
      // For chat rooms, use the 'message' event
      socket.emit('message', { room, message, sender: userName });
    }

    setMessage('');
  };

  // Join a room (either game or chat)
  const joinRoom = (roomName: string, type: 'chat' | 'game') => {
    setRoom(roomName);
    setIsGameRoom(type === 'game');
    socket.emit('join-room', { room: roomName, userName });
  };

  // Handle creating a room
  const createRoom = ({ newRoomName, type }: CreateRoomParams) => {
    socket.emit(type === 'game' ? 'createGameRoom' : 'createRoom', newRoomName);
  };

  // Handle room selection
  const handleRoomSelect = (selectedRoom: string) => {
    const roomType = availableRooms.find((room) => room.name === selectedRoom)?.type;
    if (roomType) {
      joinRoom(selectedRoom, roomType);
    } else {
      console.error(`Room type for ${selectedRoom} is undefined`);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 w-80 p-4 border rounded-lg bg-gray-800 shadow-lg z-50">
      <h2 className="text-lg text-white font-semibold mb-2">Chatbox</h2>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Enter username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
        />
      </div>
      
      <div className="mb-2">
        <h3 className="text-sm font-medium">Available Rooms</h3>
        {availableRooms.length > 0 ? (
          <ul className="space-y-1">
            {availableRooms.map((room, idx) => (
              <li
                key={idx}
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => handleRoomSelect(room.name)}
              >
                {room.name} ({room.type})
              </li>
            ))}
          </ul>
        ) : (
          <p>No rooms available</p>
        )}
      </div>

      <div className="mb-2">
        <h3 className="text-sm font-medium">Messages</h3>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div key={idx}>
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="w-full p-2 border border-gray-300 rounded-md text-black"
        />
        <button
          onClick={sendMessage}
          className="w-full mt-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>

      <div className="space-x-2">
        <button
          onClick={() => createRoom({ newRoomName: 'New Chat Room', type: 'chat' })}
          className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Create Chat Room
        </button>
        <button
          onClick={() => createRoom({ newRoomName: 'New Game Room', type: 'game' })}
          className="w-full py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          Create Game Room
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
