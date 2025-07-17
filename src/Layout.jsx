import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Outlet,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import RegisterForm from "./pages/RegisterForm/RegisterForm"
import localStorage from "./services/localStorageService";
// import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from "react-router-dom"; // เพิ่มการนำเข้า useNavigate
import styles from "./Layout.module.scss";
import axios from "../src/config/axios";
import Admin from "../src/pages/Admin/Admin";
import { Modal } from "antd";

function Layout({ setRole, isLoggedIn, setIsLoggedIn, isModalOpen, setIsModalOpen, isRegisterMode, setIsRegisterMode }) {

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false)
  const toggleModal = () => {
    setIsOpenModal(!isOpenModal)
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); // ลบ token ออกจาก localStorage
    setRole("guest");
    setIsLoggedIn(false); // บอก parent ว่าล็อกเอาท์แล้ว
    navigate("/");
  };

  const fetchUser = async () => {
      try {
        const httpResponse = await axios.get("/user/profile");
        setUserInfo(httpResponse.data);
        console.log("ข้อมูล UserInfo", httpResponse.data); // ✅ ดูว่ามี role จริงไหม
      } catch (error) {
        console.log("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้", error)
      }
  }

  useEffect(() => {
    // สมมติว่า access token ถูกเก็บไว้ใน localStorage
    const accessToken = localStorage.getItem('ACCESS_TOKEN');
    console.log("Token", accessToken);
  
    if (accessToken) {
      setIsLoggedIn(true); // ตั้งค่าเป็น true ถ้ามี access token
      fetchUser();
      setIsModalOpen(false);
    } else {
      setIsLoggedIn(false); // ตั้งค่าเป็น false ถ้าไม่มี access token
    }
  }, []);

  useEffect(() => {
  if (isLoggedIn) {
    fetchUser();
  }
}, [isLoggedIn]);

  const handleLoginLogoutClick = () => {
    if (isLoggedIn) {
      handleLogout();
      fetchUser();
    } else {
      openModal();
    }
  };

  return (
    <div>
      <div className="Navbar">
        <div className="Navbar-Logo">
          <img src="/image/Logo.png" alt="ThaiReview" className="Logo"/>
        </div>
        <nav className="Navbar-link">
          {userInfo?.role === "admin" && 
            <button className={styles.adminButton} onClick={toggleModal}>
              แอดมินฟอร์ม
            </button>
          }
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li onClick={handleLoginLogoutClick} className="Navbar-link user-button">
            <span className="user-text"> {isLoggedIn ? "Logout" : "Login"} </span>
            <i className="fa-regular fa-user"></i>
          </li>
        </nav>
      </div>
      {isOpenModal && 
        <Modal
          open={isOpenModal}
          onCancel={toggleModal}
          footer={null}
          width={750} // ✅ กำหนดความกว้างตามต้องการ
          centered // ✅ ให้อยู่ตรงกลางจอ
          title="แอดมินฟอร์ม"
        >
          <Admin/>
        </Modal>
      }

      {/* Renders the child route(s) */}
      <Outlet />

      {/* Login modal (only if isModalOpen == true) */}
      {isModalOpen && (isRegisterMode ? ( 
        //  <GoogleOAuthProvider clientId={clientId}>
          <Login
            closeModal={closeModal}
            setRole={setRole}
            setIsLoggedIn={(val) => {
              console.log("LAYOUT: setIsLoggedIn got called with", val);
              setIsLoggedIn(val);
            }}
            setIsRegisterMode = {setIsRegisterMode}
          />
        // </GoogleOAuthProvider>
        )
      : ( <RegisterForm  closeModal={closeModal} setIsRegisterMode={setIsRegisterMode}/> ) 
      )}
    </div>
  );
}

export default Layout;
