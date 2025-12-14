import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [], // array for storing messages
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      // always assign an array
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      // push single message (real-time)
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { setMessages, addMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
