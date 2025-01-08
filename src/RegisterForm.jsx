import { React, useState } from 'react';
import './RegisterForm.scss';
import axios from './config/axios';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ closeModal , setIsRegisterMode}) => {
  const [formData, setFormData] = useState({
    username: '',
    name:'',
    email:'',
    password:'',
    tel:'',
    age:'',
    userimagePath: null,
  });

  const switchToLogin = () => {
    setIsRegisterMode(true); // เปลี่ยนกลับเป็นโหมด Login
  };

  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const navigate = useNavigate(); // ประกาศ useNavigate เพื่อใช้งานในฟังก์ชั่น

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      userimagePath: file, // เก็บไฟล์ภาพใน state
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = new FormData();
    for (const key in formData) {
      if (formData[key]) {
      form.append(key, formData[key]); // ตรวจสอบว่าแต่ละค่ามีข้อมูลหรือไม่ก่อน append
      }
  }

    try {
      const response = await axios.post('/user/register', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      openNotification('success', 'Registration Successful', 'You have successfully registered! Please log in.');
      navigate('/login');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      openNotification('error', 'Registration Failed', errorMsg);
    }
};

    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content-info">
                <div className="modal-content-info-header">Sign in account</div>
                <div>ลงทะเบียนบัญชีของคุณ</div>
            </div>
            <div className="modal-content-input">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                required
              /><br></br>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              /><br></br>
              <input
                type="email"
                name="email"
                placeholder="example@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              /><br></br>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="tel"
                placeholder="Phone number"
                value={formData.tel}
                onChange={handleChange}
              />
              <input
                type="number"
                name="age"
                placeholder="Your age"
                value={formData.age}
                onChange={handleChange}
                min="0"
              />
              <input
                type="file"
                name="userimagePath"
                onChange={handleImageChange}
                accept="image/*"
              />
              <button type="submit">Register</button>
              <button type="button" onClick={switchToLogin}>
                Back to Login
              </button>
            </form>
            </div>
        </div>
      </div>
    );
  }

export default RegisterForm;