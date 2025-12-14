import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import dp from "../../public/emty-dp.jpg";

const ReceiverMessage = ({ image, message }) => {
  const scrollRef = useRef(null);
  const { selectedUser } = useSelector((state) => state.user);

  // 🔥 Auto scroll when message or image changes
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  return (
    <div ref={scrollRef} className="flex justify-start gap-2 px-2">
      {/* Receiver Avatar */}
      <div className="w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
        <img
          src={selectedUser?.image || dp}
          alt="dp"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Message Bubble */}
      <div className="max-w-[70%] bg-[#e6e6e6] text-black px-4 py-2 rounded-2xl rounded-bl-md shadow-md flex flex-col gap-2">
        {/* Image Message */}
        {image && (
          <img
            src={image}
            alt="received"
            className="w-[220px] rounded-lg object-cover"
            onLoad={() =>
              scrollRef.current?.scrollIntoView({ behavior: "smooth" })
            }
          />
        )}

        {/* Text Message */}
        {message && (
          <p className="text-sm leading-relaxed break-words">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ReceiverMessage;
