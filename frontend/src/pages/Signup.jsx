import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { setUserData } from "../redux/userSlice"; // 👈 userSlice se action import
import { serverUrl } from "../main";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // 👈 dispatch setup
  const { userData } = useSelector((state) => state.user);
  console.log(userData);

  const [show, setShow] = useState(false);
  const [userState, setUserState] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // input change handle karne ke liye
  const handleChange = (e) => {
    const { name, value } = e.target;
    setErr("");
    setUserState((prev) => ({ ...prev, [name]: value }));
  };

  // signup form submit hone pe
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await fetch(`${serverUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userState),
      });

      const data = await result.json();
      console.log("Signup result:", data);

      if (result.ok) {
        // 👇 yahan Redux me user data save hoga
        dispatch(setUserData(data));

        // form reset and navigate
        setUserState({ userName: "", email: "", password: "" });
        setLoading(false);
        navigate("/profile");
      } else {
        setErr(data?.message || "Signup failed!");
        setLoading(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErr("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-200 flex justify-center items-center">
      <div className="w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]">
        {/* Header */}
        <div className="w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex items-center justify-center">
          <h1 className="text-gray-600 font-bold text-[30px]">
            Welcome to <span className="text-white">Chat Application</span>
          </h1>
        </div>

        {/* Form */}
        <form
          className="w-full flex flex-col gap-[20px] items-center"
          onSubmit={handleSignup}
        >
          <input
            type="text"
            name="userName"
            placeholder="Username"
            className="w-[90%] h-[60px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg shadow-gray-400 shadow-lg"
            onChange={handleChange}
            value={userState.userName}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-[90%] h-[60px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg shadow-gray-400 shadow-lg"
            onChange={handleChange}
            value={userState.email}
            required
          />

          <div className="w-[90%] h-[50px] border-2 border-[#20c7ff] overflow-hidden rounded-lg shadow-gray-400 shadow-lg relative flex items-center">
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full h-full outline-none px-[20px] py-[10px] bg-white text-gray-700 text-[19px]"
              onChange={handleChange}
              value={userState.password}
              required
            />
            <span
              className="absolute top-[10px] right-[20px] text-[#20c7ff] cursor-pointer"
              onClick={() => setShow((prev) => !prev)}
            >
              {show ? <EyeOff size={22} /> : <Eye size={22} />}
            </span>
          </div>

          {/* Error message */}
          {err && (
            <p className="text-red-500 font-bold mt-3 text-[16px] text-center">
              {err}
            </p>
          )}

          <button
            type="submit"
            className="px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg text-[20px] w-[200px] mt-[20px] font-semibold hover:shadow-inner"
            disabled={loading}
          >
            {loading ? "Loading..." : "Signup"}
          </button>

          <p className="cursor-pointer" onClick={() => navigate("/login")}>
            Already Have An Account?{" "}
            <span className="text-[#20c7ff] font-bold">Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
