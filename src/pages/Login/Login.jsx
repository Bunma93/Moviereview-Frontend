import React, { useState } from "react";
import styles from "./Login.module.scss";
import axios from "../../config/axios";
import { notification, Form, Input, Button } from "antd";
import localStorage from "../../services/localStorageService";
import { useNavigate } from "react-router-dom";
import image from "../../component/images/cf2630c2-1313-47e6-9de0-1131e4c36f45-Photoroom.png"
import image2 from "../../component/images/pngtree-movie-film-roll-black-and-white-png-image_6123879-Photoroom.png"

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const Login = ({ closeModal, setRole, setIsLoggedIn, setIsRegisterMode }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const handleClose = () => {
    if (closeModal) closeModal();
  };

  const switchToRegister = () => {
    setIsRegisterMode(false);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("/user/login", values, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setIsLoggedIn(true);
        localStorage.setItem("ACCESS_TOKEN", response.data.token);
        setRole("user");

        openNotificationWithIcon(
          "success",
          "Login Success",
          "You have successfully logged in!"
        );

        handleClose();
        navigate("/profile");
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
          <div className={styles.modal_content_info_header}>Sign in Account</div>
          <div>ลงทะเบียนบัญชีของคุณ</div>
          <img src={image} className={styles.popcorn}></img>
          <img src={image2} className={styles.film}></img>
        </div>
        <div className={styles.modal_content_input}>
          <Form form={form} {...layout} onFinish={handleSubmit}>
            <Form.Item
              label={<label style={{ color: "white", fontSize:"16px" }}>ชื่อผุ้ใช้</label>}
              name="username"
              rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้งาน" }]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>

            <Form.Item
              label={<label style={{ color: "white", fontSize:"16px" }}>รหัสผ่าน</label>}
              name="password"
              rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <Button className={styles.LoginButton} type="primary" htmlType="submit" loading={loading} block>
                {loading ? "Loading..." : "Login"}
              </Button>
            </Form.Item>

            <Form.Item>
              <Button className={styles.Registerlink} type="link" onClick={switchToRegister} block>
                ยังไม่มีบัญชี? ลงทะเบียนที่นี่
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;

