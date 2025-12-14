// frontend/src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: JSON.parse(localStorage.getItem("userData")) || null,
    otherUsers: null,
    selectedUser: null,
    onlineUsers: [],
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      if (action.payload) {
        localStorage.setItem("userData", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("userData");
      }
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setUserData, setOtherUsers, setSelectedUser, setOnlineUsers } =
  userSlice.actions;
export default userSlice.reducer;
