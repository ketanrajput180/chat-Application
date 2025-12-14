 
import jwt from "jsonwebtoken";

const genToken = (id) => {
  try {
    // ✅ use process.env.JWT_SECRET (not process.removeListener)
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // 7 days
    });
    return token;
  } catch (error) {
    console.log("Error while generating token:", error);
  }
};

export default genToken;
