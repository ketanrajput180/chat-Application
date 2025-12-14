import React from "react";
import SideBar from "../components/SideBar";
import MessageArea from "../components/MessageArea";
import useGetMessages from "../customHooks/useGetMessages";

const Home = () => {
  useGetMessages(); // fetch messages when selected user changes

  return (
    <div className="w-full h-[100vh] flex">
      <SideBar />
      <MessageArea />
    </div>
  );
};

export default Home;
