import React, { useRef, useState } from "react";
import dp from "../../public/emty-dp.jpg";
import { CiCamera } from "react-icons/ci";
import { TbArrowBarToLeft } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserData } from "../redux/userSlice"; // ✅ adjust import path if needed
import { serverUrl } from "../main"; // ✅ make sure you exported this in main.jsx

const Profile = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(userData?.name || "");
  const [frontImage, setFrontImage] = useState(userData?.image || dp);
  const [backendImage, setBackendImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const image = useRef();

  // 📸 Handle image upload
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontImage(URL.createObjectURL(file));
    }
  };

  // 💾 Handle profile update
  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/user/profile`,
        formData,
        { withCredentials: true }
      );

      dispatch(setUserData(result.data.user)); // ✅ only user object
      navigate("/");
    } catch (error) {
      console.log("Profile update error:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-200 flex flex-col justify-center items-center">
      {/* 🔹 Arrow Icon at top-left */}
      <div
        className="fixed top-[20px] left-[20px] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <TbArrowBarToLeft className="w-[40px] h-[40px] text-gray-700 hover:text-[#20c7ff] transition" />
      </div>

      {/* 🖼 Profile Image Section */}
      <div className="relative bg-white rounded-full border-4 border-[#20c7ff] shadow-gray-400 shadow-lg w-[200px] h-[200px] flex items-center justify-center overflow-hidden">
        <img
          src={frontImage}
          alt="Profile"
          className="w-full h-full rounded-full"
        />

        <div
          className="absolute bottom-3 right-5 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 cursor-pointer transition"
          onClick={() => image.current.click()}
        >
          <CiCamera className="text-gray-700 w-[25px] h-[22px]" />
        </div>
      </div>

      {/* 🧾 Profile Form */}
      <form
        className="flex flex-col gap-4 mt-5 w-[300px] items-center justify-center"
        onSubmit={handleProfile}
      >
        <input
          type="file"
          accept="image/*"
          ref={image}
          hidden
          onChange={handleImage}
        />

        <input
          type="text"
          placeholder="Enter your name"
          className="w-full outline-none px-5 py-2 bg-white text-gray-700 text-[19px] rounded-md shadow"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          readOnly
          placeholder="Username"
          className="w-full outline-none px-5 py-2 bg-white text-gray-400 text-[19px] rounded-md shadow"
          value={userData?.userName || ""}
        />

        <input
          type="email"
          readOnly
          placeholder="Email"
          className="w-full outline-none px-5 py-2 bg-white text-gray-400 text-[19px] rounded-md shadow"
          value={userData?.email || ""}
        />

        <button
          className="px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg text-[20px] w-[190px] mt-[20px] font-semibold hover:shadow-inner"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
