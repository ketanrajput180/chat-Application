import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { setOnlineUsers } from "./redux/userSlice";
import { serverUrl } from "./main";

// Create the socket context
const SocketContext = createContext(null);

// Custom hook to use the socket safely
export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    console.warn("useSocket must be used inside a SocketProvider");
  }
  return socket || null;
};

// SocketProvider component
export const SocketProvider = ({ children }) => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const socketRef = useRef(null);
  const [socketState, setSocketState] = useState(null);

  useEffect(() => {
    if (!userData) return; // Only connect if user logged in

    const newSocket = io(serverUrl, {
      query: { userId: userData._id },
      transports: ["websocket"], // force websocket to avoid polling issues
    });

    socketRef.current = newSocket;
    setSocketState(newSocket);

    newSocket.on("connect", () =>
      console.log("Socket Connected:", newSocket.id)
    );
    newSocket.on("getOnlineUsers", (users) => dispatch(setOnlineUsers(users)));
    newSocket.on("disconnect", (reason) =>
      console.log("Socket Disconnected:", reason)
    );

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
      setSocketState(null);
    };
  }, [userData, dispatch]);

  return (
    <SocketContext.Provider value={socketState}>
      {children}
    </SocketContext.Provider>
  );
};
