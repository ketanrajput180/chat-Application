import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { serverUrl } from "../main";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSelectedUser, setUserData } from "../redux/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [userState, setUserState] = useState({
    email: "",
    password: "",
  });

  const { email, password } = userState;

  const handleChange = (e) => {
    setErr("");
    setUserState({ ...userState, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      // ✅ Store user data in Redux
      dispatch(setUserData(result.data.user || result.data));
      dispatch(setSelectedUser(null)); // Clear selected user on login
      setUserState({ email: "", password: "" });
      setErr("");
      navigate("/"); // ✅ Redirect to home
    } catch (error) {
      console.error(error);
      setErr(error?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-slate-200 flex justify-center items-center">
      <div className="w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-gray-400 shadow-lg flex flex-col gap-[30px]">
        {/* Header */}
        <div className="w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex items-center justify-center">
          <h1 className="text-gray-600 font-bold text-[30px]">
            Login to <span className="text-white">Chat Application</span>
          </h1>
        </div>

        {/* Login Form */}
        <form
          className="w-full flex flex-col gap-[20px] items-center"
          onSubmit={handleLogin}
        >
          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-[90%] h-[60px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg shadow-gray-400 shadow-lg"
            onChange={handleChange}
            value={email}
            required
          />

          {/* Password Input */}
          <div className="w-[90%] h-[50px] border-2 border-[#20c7ff] overflow-hidden rounded-lg shadow-gray-400 shadow-lg relative flex items-center">
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full h-full outline-none px-[20px] py-[10px] bg-white text-gray-700 text-[19px]"
              onChange={handleChange}
              value={password}
              required
            />
            <span
              className="absolute top-[10px] right-[20px] text-[#20c7ff] cursor-pointer"
              onClick={() => setShow((prev) => !prev)}
            >
              {show ? <EyeOff size={22} /> : <Eye size={22} />}
            </span>
          </div>

          {/* Error Message */}
          {err && (
            <p className="text-red-500 font-bold mt-3 text-[16px] text-center">
              {err}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="px-[20px] py-[10px] bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg text-[20px] w-[200px] mt-[20px] font-semibold hover:shadow-inner"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>

          {/* Signup Redirect */}
          <p
            className="cursor-pointer mt-2"
            onClick={() => navigate("/Signup")}
          >
            Want to create a new account?{" "}
            <span className="text-[#20c7ff] font-bold">Signup</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
