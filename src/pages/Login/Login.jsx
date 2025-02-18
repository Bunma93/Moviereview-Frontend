import { React, useState } from "react";
import styles from "./Login.module.scss";
import axios from "../../config/axios";
import { notification } from "antd";
import localStorage from "../../services/localStorageService";
import { useNavigate } from "react-router-dom"; // เพิ่มการนำเข้า useNavigate
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"; // ใช้ถอดรหัส JWT Token ที่ได้รับจาก Google

const Login = ({ closeModal, setRole, setIsLoggedIn, setIsRegisterMode }) => {
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

  const handleSuccess = (response) => {
    const token = response.credential; // รับ JWT Token ที่ได้จาก Google
    const decoded = jwtDecode(token); // ถอดรหัส JWT Token

    console.log("Google User:", decoded); // ดูข้อมูลผู้ใช้จาก Google

    localStorage.setItem("ACCESS_TOKEN", token); // บันทึก token ลง localStorage
    setIsLoggedIn(true); // อัพเดตสถานะการล็อกอิน
    setRole("user"); // กำหนด role หลังจากล็อกอินสำเร็จ
    openNotificationWithIcon(
      "success",
      "Login Success",
      "You have successfully logged in!"
    );
    handleClose(); // ปิดโมดอล
    // navigate("/profile"); // เปลี่ยนเส้นทางไปหน้าโปรไฟล์
  };

  const handleFailure = (error) => {
    console.log("Google Login Failed:", error);
  };

  const handleClose = () => {
    if (closeModal) closeModal();
  };

  const switchToRegister = () => {
    setIsRegisterMode(false); // เปลี่ยนเป็นโหมด Register
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      username: formData.username,
      password: formData.password,
    };
    try {
      const response = await axios.post("/user/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // ตรวจสอบว่า response.data มีค่าและมี token หรือไม่
      if (response.status === 200) {
        setIsLoggedIn(true);

        const token = response.data.token;
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
    <div className={styles.modal_overlay} onClick={handleClose}>
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal_content_info}>
          <div className={styles.modal_content_info_header}>Sign in account</div>
          <div>ลงทะเบียนบัญชีของคุณ</div>
        </div>
        <div className={styles.modal_content_input}>
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

            <button type="submit" disabled={loading} onClick={handleSubmit}>
              {loading ? "Loading..." : "Login"}
            </button><br></br>

            {/* <div> 
              <h2>Login with Google</h2>
              <GoogleLogin 
                onSuccess={handleSuccess} 
                onError={handleFailure}
              />
            </div> */}
            <br></br>
            <button type="button" onClick={switchToRegister}>
                ยังไม่มีบัญชี
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
