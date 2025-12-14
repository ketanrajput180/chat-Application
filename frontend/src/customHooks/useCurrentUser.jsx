import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../main";

const useCurrentUser = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });

        // ✅ Direct user object
        if (res.data) {
          dispatch(setUserData(res.data));
          localStorage.setItem("userData", JSON.stringify(res.data)); // persist on refresh
        } else {
          dispatch(setUserData(null));
          localStorage.removeItem("userData");
        }
      } catch (error) {
        console.error("Current user fetch error:", error.message);
        dispatch(setUserData(null));
        localStorage.removeItem("userData");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  return loading; // true while fetching
};

export default useCurrentUser;
