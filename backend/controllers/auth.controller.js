import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenandsetcookie } from "../utils/generateToken.js";

// Hàm validate đầu vào
const validateSignupInput = ({ username, email, password }) => {
  const errors = [];
  // Kiểm tra rỗng
  

  if (!username || !email || !password) {
    errors.push("All fields are required");
  }

  // Kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.push("Invalid email format");
  }

  // Kiểm tra độ dài mật khẩu
  if (password && password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  return errors;
};

// Đăng ký người dùng mới
export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra đầu vào
    const errors = validateSignupInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Kiểm tra email hoặc username đã tồn tại chưa
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or username already exists",
      });
    }

    // Hash mật khẩu
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Tạo người dùng mới
    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      image,
    });

    // Tạo token và đặt cookie
    generateTokenandsetcookie(newUser._id, res);

    res.status(201).json({
      success: true,
      user: { ...newUser._doc, password: "" },
    });
  } catch (error) {
    console.error("Error on signup", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// Đăng nhập người dùng
export async function login(req, res) {
  try { // Lấy email và password từ body
    const { email, password } = req.body;

    // Kiểm tra email và password
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    generateTokenandsetcookie(user._id, res);

    res.status(200).json({
      success: true,
      user: { ...user._doc, password: "" },
    });
  } catch (error) {
    console.error("Error on login", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// Đăng xuất người dùng
export async function logout(req, res) {
  try {
    // xoa cookiecua jwt
    res.clearCookie("jwt-netflix", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error on logout", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
