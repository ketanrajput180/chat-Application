import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setOtherUsers } from "../redux/userSlice";
import { serverUrl } from "../main";

const useOtherUsers = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/others`, {
          withCredentials: true,
        });

        // ✅ Set other users in redux
        if (res.data) {
          dispatch(setOtherUsers(res.data));
        } else {
          dispatch(setOtherUsers(null));
        }
      } catch (error) {
        console.error("Other users fetch error:", error.message);
        dispatch(setOtherUsers(null));
      } finally {
        setLoading(false);
      }
    };

    fetchOtherUsers();
  }, [dispatch]);

  return loading; // true while fetching
};

export default useOtherUsers;
