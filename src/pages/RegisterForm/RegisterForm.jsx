import React, { useState } from 'react';
import styles from './RegisterForm.module.scss';
import axios from '../../config/axios';
import { notification, Form, Input, Button, Upload , Image} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const RegisterForm = ({ closeModal, setIsRegisterMode }) => {
  const [form] = Form.useForm(); // ใช้ formInstance ของ Ant Design
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนหน้า

  const [previewImage, setPreviewImage] = useState(null); // เก็บ URL ของรูปที่เลือก
  const [fileList, setFileList] = useState([]); // เก็บไฟล์ที่อัปโหลด

  const openNotification = (type, message, description) => {
    notification[type]({
      message: message,
      description: description,
    });
  };

  const switchToLogin = () => {
    setIsRegisterMode(true);
  };

   // ฟังก์ชันอัปเดตรูปที่เลือกและแสดงตัวอย่าง
   const handleChange = async ({ fileList: newFileList }) => {
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      const imagePreview = await getBase64(file);
      setPreviewImage(imagePreview);
    } else {
      setPreviewImage(null);
    }
    setFileList(newFileList);
  };
  
  const handleSubmit = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        formData.append(key, values[key]);
      }
    });

    if (fileList.length > 0) {
      formData.append('userimagePath', fileList[0].originFileObj);
    }

    try {
      await axios.post('/user/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      openNotification('success', 'ลงทะเบียนสำเร็จ', 'ลงทะเบียนบัญชีสำเร็จแล้ว กรุณาลงชื่อเข้าใช้');
      navigate('/login');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      openNotification('error', 'ลงทะเบียนไม่สำเร็จ', errorMsg);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none',color:"white" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8, color:"white" ,fontSize:"13px"}}>อัพโหลดรูป</div>
    </button>
  );

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

              {/* Upload Image Section */}
            <Form.Item label="อัพโหลดรูปโปรไฟล์">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                maxCount={1} // จำกัดให้เลือกรูปเดียว
                beforeUpload={() => false} // ป้องกันการอัปโหลดอัตโนมัติ
                showUploadList={{ showPreviewIcon: true }}
              >
                {fileList.length >= 1 ? null : uploadButton}
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