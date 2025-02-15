// import { useEffect, useState } from 'react';
// import io, { Socket } from 'socket.io-client';

// const useSocket = (): Socket | null => {
//   const [socket, setSocket] = useState<Socket | null>(null);

//   useEffect(() => {
//     const newSocket = io('http://localhost:3000/api/socket'); // Replace with your actual URL in production
//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   return socket;
// };

// export default useSocket;