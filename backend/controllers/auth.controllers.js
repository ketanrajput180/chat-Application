    import User from "../models/user.model.js";
    import bcrypt from "bcryptjs";
    import genToken from "../config/token.js";

    // signup user
    export const signup = async (req, res) => {
        try {
            const { userName, email, password } = req.body;

            const checkUserByUserName = await User.findOne({ userName });
            if (checkUserByUserName) {
                return res.status(400).json({ message: "userName already exist" });
            }

            const checkUserByEmail = await User.findOne({ email });
            if (checkUserByEmail) {
                return res.status(400).json({ message: "email already exist" });
            }

            if (password.length < 6) {
                return res.status(400).json({ message: "password must be at least 6 characters" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                userName,
                email,
                password: hashedPassword
            });

            const token = genToken(user._id); // uses JWT_SECRET from .env

            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: "None",
                secure: true,
            });

            res.status(201).json(user);

        } catch (error) {
            return res.status(500).json({
                message: `error while signup ${error}`
            });
        }
    };

    // login user
    export const login = async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "user does not exist" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "invalid password" });
            }

            const token = genToken(user._id);

            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: "None",
                secure: true,
            });

            return res.status(200).json(user);

        } catch (error) {
            return res.status(500).json({
                message: `login error ${error}`
            });
        }
    };

    // logout user
    export const logout = async (req, res) => {
        try {
            res.clearCookie("token");
            return res.status(200).json({ message: "logout successfully" });
        } catch (error) {
            return res.status(500).json({
                message: `error while logout ${error}`
            });
        }
    };
