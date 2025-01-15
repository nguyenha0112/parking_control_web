import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

let refreshTokens = []; // khi co database thi dung redis

const authController = {
    // REGISTER
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // Create new user
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            // Save user to DB
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //tao access token
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "60s" }
        );
    },
    //tao refresh token
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "365d" }
        );
    },
    // LOGIN
    loginUser: async (req, res) => {
        try {
            // Tìm người dùng qua username
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(404).json({ message: "Wrong username!" });
            }

            // Kiểm tra mật khẩu
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(404).json({ message: "Wrong password!" });
            }


            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);// redis
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false, // khi nao https thi mo true
                    path: "/",
                    sameSite: "strict",
                })
                const { password, ...others } = user._doc;
                res.status(200).json({ ...others, accessToken });
            }


        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    requestRefreshToken: async (req, res) => {
        // Take refresh token from user
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json("You're not authenticated");
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json("Refresh token is not valid");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            // Create new access token and refresh token
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            // Set new refresh token in cookies
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false, // Set `true` if using HTTPS
                path: "/",
                sameSite: "strict",
            });

            res.status(200).json({ accessToken: newAccessToken });
        });
    },
    //LOG OUT
    userLogout: async (req, res) => {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json("Logged out !");
    }

};

export default authController;
