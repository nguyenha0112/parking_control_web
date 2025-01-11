import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Loại bỏ khoảng trắng thừa
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "", // Ảnh đại diện
  },
  role: {
    type: String,
    enum: ["customer", "admin"], // Chỉ cho phép 2 giá trị: 'customer' hoặc 'admin'
    default: "customer", // Mặc định là khách hàng
  },
  searchHistory: {
    type: [String], // Lịch sử tìm kiếm (mảng các chuỗi)
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now, // Thời gian tạo
  },
});

export const User = mongoose.model("User", userSchema);
