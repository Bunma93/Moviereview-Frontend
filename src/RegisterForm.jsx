import React, { useState } from 'react';
import styles from './RegisterForm.module.scss';
import axios from './config/axios';
import { notification, Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const RegisterForm = ({ closeModal, setIsRegisterMode }) => {
  const [form] = Form.useForm(); // ใช้ formInstance ของ Ant Design
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนหน้า
  const [file, setFile] = useState(null); // เก็บไฟล์ที่อัพโหลด

  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const switchToLogin = () => {
    setIsRegisterMode(true);
  };

  const handleBeforeUpload = (file) => {
    setFile(file); // เก็บไฟล์ไว้ใน state
    return false; // ป้องกันไม่ให้ Upload อัพโหลดอัตโนมัติ
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        formData.append(key, values[key]);
      }
    });

    if (file) {
      formData.append('userimagePath', file); // เพิ่มไฟล์ไปยัง FormData
    }

    try {
      await axios.post('/user/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      openNotification('success', 'Registration Successful', 'You have successfully registered! Please log in.');
      navigate('/login');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      openNotification('error', 'Registration Failed', errorMsg);
    }
  };

  return (
    <div className={styles.modal_overlay} onClick={closeModal}>
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal_content_info}>
          <div className={styles.modal_content_info_header}>Sign in account</div>
          <div>ลงทะเบียนบัญชีของคุณ</div>
        </div>
        <div className={styles.modal_content_input}>
          <Form form={form}  {...layout} onFinish={handleSubmit}>
            <Form.Item
              className={styles.register_label}
              label={<label style={{ color: "white", fontSize:"16px" }}>ชื่อผุ้ใช้</label>}
              name="username"
              rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ใช้งาน' }]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>

            <Form.Item
              className={styles.register_label}
              label={<label style={{ color: "white", fontSize:"16px" }}>ชื่อจริง-นามสกุล</label>}
              name="name"
              rules={[{ required: true, message: 'กรุณากรอกชื่อจริง' }]}
            >
              <Input placeholder="Enter your full name" />
            </Form.Item>

            <Form.Item
              label={<label style={{ color: "white", fontSize:"16px" }}>อีเมลล์</label>}
              name="email"
              rules={[
                { required: true, message: 'กรุณากรอกอีเมลล์' },
                { type: 'email', message: 'รูปแบบอีเมลล์ไม่ถูกต้อง' },
              ]}
            >
              <Input placeholder="example@example.com" />
            </Form.Item>

            <Form.Item
              label={<label style={{ color: "white", fontSize:"16px" }}>รหัสผ่าน</label>}
              name="password"
              rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน' }]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item
              label={<label style={{ color: "white", fontSize:"16px" }}>เบอร์โทรศัพท์</label>}
              name="tel"
              rules={[
                { required: true, message: 'กรุณากรอกเบอร์โทรศัพท์' },
                { pattern: /^[0-9]{10}$/, message: 'เบอร์โทรศัพท์ต้องมี 10 หลัก' },
              ]}
            >
              <Input placeholder="Phone number" />
            </Form.Item>

            <Form.Item
              label={<label style={{ color: "white", fontSize:"16px" }}>อายุ</label>}
              name="age"
              rules={[{ required: true, message: 'กรุณากรอกอายุ' }]}
            >
              <Input type="number" min="0" placeholder="Your age" />
            </Form.Item>

            <Form.Item label="อัพโหลดรูปโปรไฟล์" name="userimagePath" >
             <Upload beforeUpload={handleBeforeUpload} maxCount={1} showUploadList={true}>
                <Button icon={<UploadOutlined /> }>อัพโหลดไฟล์</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                ลงทะเบียน
              </Button>
            </Form.Item>

            <Form.Item>
              <Button type="link" onClick={switchToLogin} block>
                มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;