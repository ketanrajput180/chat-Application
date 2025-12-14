import mongoose, { connect } from "mongoose";

const connectDB =async () => {
    try {
       await mongoose.connect(process.env.MONGODB_URL)
       console.log("MongoDB connected successfully")    
    } catch(error) {
        console.log("Error while connecting to database",error.message)
    }
}

export default connectDB;