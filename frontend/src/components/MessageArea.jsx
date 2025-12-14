import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../../public/emty-dp.jpg";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { BsCardImage } from "react-icons/bs";
import { TbSend2 } from "react-icons/tb";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { serverUrl } from "../main";
import { addMessage } from "../redux/messageSlice";
import { useSocket } from "../SocketContext.jsx";

const MessageArea = () => {
  const dispatch = useDispatch();
  const { selectedUser, userData } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.message);
  const socket = useSocket();

  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const imageRef = useRef(null);

  // Handle image upload
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFrontendImage(URL.createObjectURL(file));
    setBackendImage(file);
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message && !backendImage) return;

    try {
      const formData = new FormData();
      formData.append("message", message);
      if (backendImage) formData.append("image", backendImage);

      const res = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      dispatch(addMessage(res.data));

      // Reset input fields
      setMessage("");
      setFrontendImage(null);
      setBackendImage(null);
      setShowPicker(false);

      // Emit via socket
      socket?.emit("sendMessage", res.data);
    } catch (err) {
      console.log("Message Send Error:", err.message);
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (mess) => dispatch(addMessage(mess));
    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, dispatch]);

  return (
    <div
      className={`w-full lg:w-[70%] h-screen bg-gradient-to-b from-[#22caff] to-[#008ec5] flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.25)] ${
        selectedUser ? "flex" : "hidden lg:flex"
      } relative`}
    >
      {selectedUser ? (
        <>
          {/* HEADER */}
          <div className="w-full flex items-center gap-4 p-4 bg-[#1abef6]/40 backdrop-blur-md shadow-md rounded-b-2xl">
            <IoIosArrowRoundBack
              className="w-10 h-10 text-white cursor-pointer block lg:hidden"
              onClick={() => dispatch(setSelectedUser(null))}
            />
            <div className="w-[55px] h-[55px] rounded-full overflow-hidden border-4 border-[#20c7ff] shadow-md">
              <img
                src={selectedUser?.image || dp}
                alt="dp"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-white text-lg font-semibold">
                {selectedUser?.name}
              </h1>
              <p className="text-white/80 text-sm">Online</p>
            </div>
          </div>

          {/* CHAT BODY */}
          <div className="flex-1 bg-white/90 rounded-t-3xl mt-4 shadow-inner overflow-y-auto p-5 flex flex-col gap-4">
            {messages?.length > 0 ? (
              messages.map((mess) =>
                mess.sender === userData._id ? (
                  <SenderMessage
                    key={mess._id}
                    image={mess.image}
                    message={mess.message}
                  />
                ) : (
                  <ReceiverMessage
                    key={mess._id}
                    image={mess.image}
                    message={mess.message}
                  />
                )
              )
            ) : (
              <p className="text-gray-400 text-center mt-10">
                Say hello 👋 to <b>{selectedUser?.name}</b>
              </p>
            )}
          </div>

          {/* IMAGE PREVIEW */}
          {frontendImage && (
            <img
              src={frontendImage}
              alt="preview"
              className="w-[100px] absolute bottom-[80px] right-9 rounded-md shadow-gray-500 shadow-lg"
            />
          )}

          {/* EMOJI PICKER */}
          {showPicker && (
            <div className="absolute bottom-[90px] left-5 z-50">
              <EmojiPicker
                width={300}
                height={360}
                onEmojiClick={(emojiData) =>
                  setMessage((prev) => prev + emojiData.emoji)
                }
              />
            </div>
          )}

          {/* INPUT BAR */}
          <div className="w-full px-4 py-4 bg-white/90">
            <form
              className="w-full h-[60px] bg-[#1797c2] rounded-full shadow-lg flex items-center px-4 gap-4"
              onSubmit={handleSendMessage}
            >
              <RiEmojiStickerLine
                className="w-6 h-6 text-white cursor-pointer"
                onClick={() => setShowPicker((prev) => !prev)}
              />
              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImage}
              />
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder-white/80 text-lg"
              />
              <BsCardImage
                className="w-6 h-6 text-white cursor-pointer"
                onClick={() => imageRef.current.click()}
              />
              {/* SEND BUTTON: Show only if message, image, or emoji exists */}
              {(message.length > 0 || backendImage != null) && (
                <button type="submit">
                  <TbSend2 className="w-7 h-7 text-white cursor-pointer" />
                </button>
              )}
            </form>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center text-center px-5">
          <h1 className="text-white text-4xl font-bold mb-2 drop-shadow-lg">
            Welcome to KChat 💬
          </h1>
          <p className="text-white text-lg opacity-90">
            Select a user to start chatting...
          </p>
        </div>
      )}
    </div>
  );
};

export default MessageArea;
