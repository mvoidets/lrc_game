// "use client";
// import { createContext, useContext, useState, useEffect } from "react";
// import getSession from "../lib/getSession";
// import { type User } from "next-auth";

// type Player = {
//   id: number;
//   chips: number;
//   diceResult: string[] | null;
// };

// type GameContextType = {
//   players: Player[];
//   setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
// };

// const GameContext = createContext<GameContextType | undefined>(undefined);

// export const GameProvider = ({ children }: { children: React.ReactNode }) => {
//   const [players, setPlayers] = useState<Player[]>([
//     { id: 1, chips: 3, diceResult: null },
//     { id: 2, chips: 3, diceResult: null },
//     { id: 3, chips: 3, diceResult: null },
//     { id: 4, chips: 3, diceResult: null },
//     { id: 5, chips: 3, diceResult: null },
//     { id: 0, chips: 0, diceResult: null }
//   ]);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const userData = await getSession();
//       if (userData) {
//         setPlayers((prevPlayers) => {
//           const updatedPlayers = [...prevPlayers];
//           updatedPlayers[0] = { id: parseInt(userData.id), chips: 3, diceResult: null };
//           return updatedPlayers;
//         });
//       }
//     };
//     fetchUser();
//   }, []);

//   return <GameContext.Provider value={{ players, setPlayers }}>{children}</GameContext.Provider>;
// };

// export const useGame = () => {
//   const context = useContext(GameContext);
//   if (!context) {
//     throw new Error("useGame must be used within a GameProvider");
//   }
//   return context;
// };



//     useEffect(() =>{
//       if (user)  {
//       let id = user?.id?.toString() || ''
//       if (winner?.toString() !== id) {
//         console.log('you lost!')
        
//       }
//     }
//     },[winner])


// 'use client';
// import { useState, useEffect } from 'react';
// import getSession from '../lib/getSession';
// import { type User } from 'next-auth';
// import '../globals.css';

// type Player = {
//   id: number;
//   chips: number;
//   diceResult: string[] | null;
// };

// type GameState = {
//   isRolling: boolean;
//   isProcessingResults: boolean;
//   diceCount: number;
// };

// export default function useGame() {
//   const [players, setPlayers] = useState<Player[]>([
//     { id: 1, chips: 3, diceResult: null },
//     { id: 2, chips: 3, diceResult: null },
//     { id: 3, chips: 3, diceResult: null },
//     { id: 4, chips: 3, diceResult: null },
//     { id: 5, chips: 3, diceResult: null },
//     { id: 0, chips: 0, diceResult: null }
//   ]);

//   const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
//   const [gameLog, setGameLog] = useState<string[]>([]);
//   const [winner, setWinner] = useState<number | null>(null);
//   const [user, setUser] = useState<User>({ username: '', id: '' });

//   const [gameState, setGameState] = useState<GameState>({
//     isRolling: false,
//     isProcessingResults: false,
//     diceCount: 3
//   });

//   const getAuth = async () => {
//     const userData = await getSession();
//     console.log('session user data', userData);
//     if (userData) {
//       setUser(userData);
//       setPlayers(prevPlayers => {
//         const updatedPlayers = [...prevPlayers];
//         updatedPlayers[0] = { id: parseInt(userData.id), chips: 3, diceResult: null };
//         return updatedPlayers;
//       });
//     }
//   };

//   useEffect(() => {
//     getAuth();
//   }, []);

//   useEffect(() => {
//     const activePlayers = players.filter(player => player.id !== 0 && player.chips > 0);
//     if (activePlayers.length === 1) {
//       setWinner(activePlayers[0].id);
//     }
//   }, [players]);

//   useEffect(() => {
//     if (user) {
//       let id = user?.id?.toString() || '';
//       if (winner?.toString() !== id) {
//         console.log('you lost!');
//       }
//     }
//   }, [winner]);

//   useEffect(() => {
//     if (!gameState.isRolling && !gameState.isProcessingResults && players[currentPlayerIndex].id !== parseInt(user.id || '0')) {
//       const timer = setTimeout(() => {
//         handleTurn();
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [currentPlayerIndex, gameState, players, user.id]);

//   const rollDice = (): string => {
//     const outcomes = ['L', 'R', 'C', '.', '.', '.'];
//     return outcomes[Math.floor(Math.random() * outcomes.length)];
//   };

//   const processResults = (rolls: string[], playerIndex: number) => {
//     const newPlayers = [...players];
//     const player = newPlayers[playerIndex];

//     rolls.forEach((roll) => {
//       if (roll === 'L') {
//         let leftIndex = (playerIndex - 1 + players.length) % players.length;
//         if (newPlayers[leftIndex].id === 0) {
//           leftIndex = (leftIndex - 1 + players.length) % players.length;
//         }
//         newPlayers[leftIndex].chips++;
//         player.chips--;
//       } else if (roll === 'R') {
//         let rightIndex = (playerIndex + 1) % players.length;
//         if (newPlayers[rightIndex].id === 0) {
//           rightIndex = (rightIndex + 1) % players.length;
//         }
//         newPlayers[rightIndex].chips++;
//         player.chips--;
//       } else if (roll === 'C') {
//         newPlayers.find(p => p.id === 0)!.chips++;
//         player.chips--;
//       }
//     });

//     setPlayers(newPlayers);
//     setGameLog((log) => [...log, `Player ${player.id} rolled ${rolls.join(', ')}`]);

//     setTimeout(() => {
//       setGameState(prev => ({ ...prev, isProcessingResults: false }));
//       nextTurn();
//     }, 1000);
//   };

//   const handleTurn = () => {
//     if (winner !== null || gameState.isRolling) return;

//     const player = players[currentPlayerIndex];
//     if (player.chips === 0) {
//       setGameLog((log) => [...log, `Player ${player.id} is out of chips :(`]);
//       nextTurn();
//       return;
//     }

//     // Calculate number of dice based on available chips
//     const diceCount = Math.min(player.chips, 3);
//     const rolls: string[] = [];
//     for (let i = 0; i < diceCount; i++) {
//       rolls.push(rollDice());
//     }

//     setGameState({ 
//       isRolling: true, 
//       isProcessingResults: false,
//       diceCount // Store the number of dice being rolled
//     });

//     // Store the results but don't process them yet
//     const newPlayers = [...players];
//     newPlayers[currentPlayerIndex].diceResult = rolls;
//     setPlayers(newPlayers);

//     return rolls;
//   };

//   const nextTurn = () => {
//     setCurrentPlayerIndex((prev) => {
//       let nextIndex = (prev + 1) % players.length;
//       while (players[nextIndex].chips === 0) {
//         nextIndex = (nextIndex + 1) % players.length;
//         if (nextIndex === prev) {
//           // All players are out of chips, end the game
//           setWinner(players.find(player => player.chips > 0)?.id || null);
//           return prev;
//         }
//       }
//       return nextIndex;
//     });
//   };

//   return {
//     players,
//     gameLog,
//     handleTurn,
//     winner,
//     currentPlayerIndex,
//     gameState,
//     setGameState,
//     processResults,
//     user // Return user state
//   };
// }

// 'use client';
// import { useState, useEffect } from 'react';
// import getSession from '../lib/getSession';
// import { type User } from 'next-auth';
// import '../globals.css';

// type Player = {
//   id: number;
//   chips: number;
//   diceResult: string[] | null;
// };

// type GameState = {
//   isRolling: boolean;
//   isProcessingResults: boolean;
//   diceCount: number;
// };

// export default function useGame() {
//   const [players, setPlayers] = useState<Player[]>([
//     { id: 1, chips: 3, diceResult: null },
//     { id: 2, chips: 3, diceResult: null },
//     { id: 3, chips: 3, diceResult: null },
//     { id: 4, chips: 3, diceResult: null },
//     { id: 5, chips: 3, diceResult: null },
//     { id: 0, chips: 0, diceResult: null }
//   ]);

//   const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
//   const [gameLog, setGameLog] = useState<string[]>([]);
//   const [winner, setWinner] = useState<number | null>(null);
//   const [user, setUser] = useState<User>({ username: '', id: '' });

//   const [gameState, setGameState] = useState<GameState>({
//     isRolling: false,
//     isProcessingResults: false,
//     diceCount: 3
//   });

//   const getAuth = async () => {
//     const userData = await getSession();
//     console.log('session user data', userData);
//     if (userData) {
//       setUser(userData);
//       setPlayers(prevPlayers => {
//         const updatedPlayers = [...prevPlayers];
//         updatedPlayers[0] = { id: parseInt(userData.id), chips: 3, diceResult: null };
//         return updatedPlayers;
//       });
//     }
//   };

//   useEffect(() => {
//     getAuth();
//   }, []);

//   useEffect(() => {
//     const activePlayers = players.filter(player => player.id !== 0 && player.chips > 0);
//     if (activePlayers.length === 1) {
//       setWinner(activePlayers[0].id);
//     }
//   }, [players]);

//   useEffect(() => {
//     if (user) {
//       let id = user?.id?.toString() || '';
//       if (winner?.toString() !== id) {
//         console.log('you lost!');
//       }
//     }
//   }, [winner]);

//   useEffect(() => {
//     if (!gameState.isRolling && !gameState.isProcessingResults && players[currentPlayerIndex].id !== parseInt(user.id || '0')) {
//       const timer = setTimeout(() => {
//         handleTurn();
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [currentPlayerIndex, gameState, players, user.id]);

//   const rollDice = (): string => {
//     const outcomes = ['L', 'R', 'C', '.', '.', '.'];
//     return outcomes[Math.floor(Math.random() * outcomes.length)];
//   };

//   const processResults = (rolls: string[], playerIndex: number) => {
//     const newPlayers = [...players];
//     const player = newPlayers[playerIndex];

//     rolls.forEach((roll) => {
//       if (roll === 'L') {
//         let leftIndex = (playerIndex - 1 + players.length) % players.length;
//         if (newPlayers[leftIndex].id === 0) {
//           leftIndex = (leftIndex - 1 + players.length) % players.length;
//         }
//         newPlayers[leftIndex].chips++;
//         player.chips--;
//       } else if (roll === 'R') {
//         let rightIndex = (playerIndex + 1) % players.length;
//         if (newPlayers[rightIndex].id === 0) {
//           rightIndex = (rightIndex + 1) % players.length;
//         }
//         newPlayers[rightIndex].chips++;
//         player.chips--;
//       } else if (roll === 'C') {
//         newPlayers.find(p => p.id === 0)!.chips++;
//         player.chips--;
//       }
//     });

//     setPlayers(newPlayers);
//     setGameLog((log) => [...log, `Player ${player.id} rolled ${rolls.join(', ')}`]);

//     setTimeout(() => {
//       setGameState(prev => ({ ...prev, isProcessingResults: false }));
//       nextTurn();
//     }, 1000);
//   };

//   const handleTurn = () => {
//     if (winner !== null || gameState.isRolling) return;

//     const player = players[currentPlayerIndex];
//     if (player.chips === 0) {
//       setGameLog((log) => [...log, `Player ${player.id} is out of chips :(`]);
//       nextTurn();
//       return;
//     }

//     // Calculate number of dice based on available chips
//     const diceCount = Math.min(player.chips, 3);
//     const rolls: string[] = [];
//     for (let i = 0; i < diceCount; i++) {
//       rolls.push(rollDice());
//     }

//     setGameState({ 
//       isRolling: true, 
//       isProcessingResults: false,
//       diceCount // Store the number of dice being rolled
//     });

//     // Store the results but don't process them yet
//     const newPlayers = [...players];
//     newPlayers[currentPlayerIndex].diceResult = rolls;
//     setPlayers(newPlayers);

//     return rolls;
//   };

//   const nextTurn = () => {
//     setCurrentPlayerIndex((prev) => {
//       let nextIndex = (prev + 1) % players.length;
//       while (players[nextIndex].chips === 0) {
//         nextIndex = (nextIndex + 1) % players.length;
//         if (nextIndex === prev) {
//           // All players are out of chips, end the game
//           setWinner(players.find(player => player.chips > 0)?.id || null);
//           return prev;
//         }
//       }
//       return nextIndex;
//     });
//   };

//   return {
//     players,
//     gameLog,
//     handleTurn,
//     winner,
//     currentPlayerIndex,
//     gameState,
//     setGameState,
//     processResults,
//     user // Return user state
//   };
// }