import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

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
const socket = io("http://localhost:3005");

const Chatbox = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState('');
  const [userName, setUserName] = useState('');
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [isGameRoom, setIsGameRoom] = useState(false);

  useEffect(() => {
    // Fetch available rooms when component mounts
    socket.emit('get-available-rooms');

    socket.on('availableRooms', (rooms: Room[]) => {
      setAvailableRooms(rooms);
    });

    // Handle receiving message history for chat rooms
    socket.on('messageHistory', (history: Message[], room: string) => {
      setMessages(history);
      setRoom(room);
    });

    // Handle new messages for chat rooms
    socket.on('newMessage', (messageData: Message) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    // Handle user joining or leaving a room
    socket.on('user_joined', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, { sender: 'System', message }]);
    });

    socket.on('user_left', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, { sender: 'System', message }]);
    });

    // Listen for game-specific messages
    socket.on('gameMessage', (message: string) => {
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
    <div>
      <h2>Chatbox</h2>
      <div>
        <input
          type="text"
          placeholder="Enter username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      
      <div>
        <h3>Available Rooms</h3>
        {availableRooms.length > 0 ? (
          <ul>
            {availableRooms.map((room, idx) => (
              <li key={idx} onClick={() => handleRoomSelect(room.name)}>
                {room.name} ({room.type})
              </li>
            ))}
          </ul>
        ) : (
          <p>No rooms available</p>
        )}
      </div>

      <div>
        <h3>Messages</h3>
        <div>
          {messages.map((msg, idx) => (
            <div key={idx}>
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
          ))}
        </div>
      </div>

      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div>
        <button onClick={() => createRoom({ newRoomName: 'New Chat Room', type: 'chat' })}>
          Create Chat Room
        </button>
        <button onClick={() => createRoom({ newRoomName: 'New Game Room', type: 'game' })}>
          Create Game Room
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
