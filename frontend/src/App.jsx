// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import { useSelector } from "react-redux";
import useCurrentUser from "./customHooks/useCurrentUser";
import useOtherUsers from "./customHooks/useOtherUser";

function App() {
  const currentUserLoading = useCurrentUser();
  const otherUsersLoading = useOtherUsers();
  const { userData } = useSelector((state) => state.user);

  if (currentUserLoading || otherUsersLoading) return null;

  return (
    <Routes>
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/signup"
        element={!userData ? <Signup /> : <Navigate to="/profile" />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile"
        element={userData ? <Profile /> : <Navigate to="/signup" />}
      />
    </Routes>
  );
}

export default App;
