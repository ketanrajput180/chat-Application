import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messageSlice";

const useGetMessages = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedUser) return; // don't fetch if no user selected

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${serverUrl}/api/message/messages/${selectedUser._id}`,
          { withCredentials: true }
        );
        dispatch(setMessages(res.data));
      } catch (error) {
        console.log("Messages fetch error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser, dispatch]);

  return loading;
};

export default useGetMessages;
