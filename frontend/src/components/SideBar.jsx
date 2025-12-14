import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dp from "../../public/emty-dp.jpg";
import { FaSearch } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import {
  setUserData,
  setOtherUsers,
  setSelectedUser,
} from "../redux/userSlice";
import { serverUrl } from "../main";

const SideBar = () => {
  // ✅ onlineUsers added (THIS WAS MISSING)
  const { userData, otherUsers, selectedUser, onlineUsers } = useSelector(
    (state) => state.user
  );

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ✅ Filter users by search
  const filteredUsers = otherUsers?.filter((user) =>
    user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`lg:w-[30%] w-full h-[100vh] bg-gradient-to-b from-[#22caff] to-[#008ec5] overflow-hidden flex flex-col p-5 relative shadow-[0_0_40px_rgba(0,0,0,0.25)] transition-all duration-300 ${
        selectedUser ? "hidden lg:flex" : "flex"
      }`}
    >
      {/* 🔹 Header */}
      <div className="w-full flex items-center justify-between mb-6 shadow-[0_4px_15px_rgba(0,0,0,0.2)] rounded-2xl p-3 bg-[#1abef6]/40 backdrop-blur-sm">
        <h1 className="text-white font-bold text-3xl tracking-wide">KChat</h1>

        {/* 🔍 Search */}
        <div className="relative">
          {searchVisible ? (
            <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-md">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 text-sm outline-none bg-transparent"
              />
              <RxCross2
                className="text-gray-600 w-5 h-5 cursor-pointer ml-2"
                onClick={() => {
                  setSearchVisible(false);
                  setSearchQuery("");
                }}
              />
            </div>
          ) : (
            <div
              className="bg-white p-3 rounded-full shadow-md cursor-pointer"
              onClick={() => setSearchVisible(true)}
            >
              <FaSearch className="text-[#20c7ff] w-5 h-5" />
            </div>
          )}
        </div>
      </div>

      {/* 👤 Current User */}
      <div className="w-full flex items-center justify-between bg-white rounded-2xl p-3 shadow-md">
        <div>
          <h2 className="text-gray-700 text-lg font-semibold">
            Hi, {userData?.name || "User"} 👋
          </h2>
          <p className="text-gray-500 text-sm">Welcome back!</p>
        </div>

        <div
          className="w-[55px] h-[55px] rounded-full overflow-hidden border-4 border-[#20c7ff] cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <img
            src={userData?.image || dp}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 👥 Users List */}
      <div className="w-full mt-6 flex flex-col gap-3 overflow-y-auto h-[70vh] pr-2 scrollbar-hide">
        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-md hover:bg-[#eaf8ff] cursor-pointer transition"
              onClick={() => dispatch(setSelectedUser(user))}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-[#20c7ff] shadow-md shadow-black/30">
                  <img
                    src={user?.image || dp}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 🟢 ONLINE DOT (ONLY IF ONLINE) */}
                {onlineUsers?.includes(user._id) && (
                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-[0_0_6px_rgba(0,255,0,0.7)]" />
                )}
              </div>

              {/* Name */}
              <div className="flex flex-col">
                <h3 className="text-gray-800 font-semibold">
                  {user?.name || user?.userName}
                </h3>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center mt-10">No users found...</p>
        )}
      </div>

      {/* 🚪 Logout */}
      <div
        className="absolute bottom-6 left-6 bg-white p-3 rounded-full shadow-md cursor-pointer"
        onClick={handleLogOut}
      >
        <BiLogOutCircle className="text-[#20c7ff] w-6 h-6" />
      </div>
    </div>
  );
};

export default SideBar;
