import { React, useState } from "react";
import "./Login.scss";
import axios from "./config/axios";
import { notification } from "antd";
import localStorage from "./services/localStorageService";
import { useNavigate } from "react-router-dom"; // เพิ่มการนำเข้า useNavigate

const Login = ({ closeModal, setRole, setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ประกาศ useNavigate เพื่อใช้งาน

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const handleClose = () => {
    if (closeModal) closeModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      username: formData.username,
      password: formData.password,
    };
    try {
      console.log(typeof setIsLoggedIn);
      // const response = await axios.post("/user/login", data, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      // ตรวจสอบว่า response.data มีค่าและมี token หรือไม่
      if (true) {
        setIsLoggedIn(true);

        const token = "yay";
        localStorage.setItem("ACCESS_TOKEN", token); // เก็บ token ใน localStorage
        setRole("user"); // กำหนด role หลังจากล็อกอินสำเร็จ
        openNotificationWithIcon(
          "success",
          "Login Success",
          "You have successfully logged in!"
        );
        handleClose(); // ปิดโมดอล
        navigate("/profile"); // เปลี่ยนเส้นทางไปหน้าโปรไฟล์
      } else {
        openNotificationWithIcon(
          "error",
          "Login Failed",
          "No token found in response"
        );
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      openNotificationWithIcon("error", "Login Failed", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content-info">
          <div className="modal-content-info-header">Sign in account</div>
          <div>ลงทะเบียนบัญชีของคุณ</div>
        </div>
        <div className="modal-content-input">
          <form>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <br />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <br />

            <button type="submit" disabled={loading} onClick={handleSubmit}>
              {loading ? "Loading..." : "Login"}
            </button>
            <a href="/register" onClick={handleClose}>
              Register
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
