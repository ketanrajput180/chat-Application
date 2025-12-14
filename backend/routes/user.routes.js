import express from "express"
import {editUserProfile, getCurrentUser, getOtherUsers} from "../controllers/user.controllers.js"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"

const userRouter=express.Router()

userRouter.get("/current",isAuth, getCurrentUser)
userRouter.get("/others",isAuth, getOtherUsers)
userRouter.post("/profile",isAuth, upload.single("image"), editUserProfile)

export default  userRouter