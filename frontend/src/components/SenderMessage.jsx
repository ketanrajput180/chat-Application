import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import dp from "../../public/emty-dp.jpg";

const SenderMessage = ({ image, message }) => {
  const scrollRef = useRef(null);
  const { userData } = useSelector((state) => state.user);

  // 🔥 Auto scroll on new message/image
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  return (
    <div ref={scrollRef} className="flex justify-end gap-2 px-2">
      {/* Message Bubble */}
      <div className="max-w-[70%] bg-[#1797c2] text-white px-4 py-2 rounded-2xl rounded-br-md shadow-md flex flex-col gap-2">
        {/* Image Message */}
        {image && (
          <img
            src={image}
            alt="sent"
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

      {/* Sender Avatar */}
      <div className="w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-[#20c7ff] shadow-md">
        <img
          src={userData?.image || dp}
          alt="dp"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default SenderMessage;
