import React, { useState } from 'react';
import { Form, Input, DatePicker, Switch, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from '../../config/axios';

const AdminMovieForm = () => {
  const [form] = Form.useForm();
  const [posterFile, setPosterFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);

  const handleBeforeUpload = (file, type) => {
    if (type === 'poster') setPosterFile(file);
    if (type === 'background') setBackgroundFile(file);
    return false; // ป้องกันไม่ให้ Upload อัปโหลดอัตโนมัติ
  };

  const [fileList, setFileList] = useState([]); // เก็บไฟล์ที่อัปโหลด

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

    const [posterFileList, setPosterFileList] = useState([]);
    const [backgroundFileList, setBackgroundFileList] = useState([]);
    
    const handlePosterChange = ({ fileList }) => {
      setPosterFileList(fileList);
      if (fileList.length > 0) {
        setPosterFile(fileList[0].originFileObj);
      } else {
        setPosterFile(null);
      }
    };
    
    const handleBackgroundChange = ({ fileList }) => {
      setBackgroundFileList(fileList);
      if (fileList.length > 0) {
        setBackgroundFile(fileList[0].originFileObj);
      } else {
        setBackgroundFile(null);
      }
    };
  
  const handleSubmit = async (values) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (!token) {
      message.error('กรุณาล็อกอินก่อน');
      return;
    }

    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    console.log(localStorage.getItem('ACCESS_TOKEN'))
    if (posterFile) formData.append('posterimagePath', posterFile);
    if (backgroundFile) formData.append('backgroundimagePath', backgroundFile);
    
    try {
      await axios.post('/movie/add', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`
        }
        
      });
      message.success('เพิ่มภาพยนตร์สำเร็จ!');
      form.resetFields();
      setPosterFile(null);
      setBackgroundFile(null);
      setFileList([]);
    } catch (error) {
      message.error('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="ชื่อภาพยนตร์" name="title" rules={[{ required: true, message: 'กรุณากรอกชื่อภาพยนตร์' }]}>
        <Input placeholder="ใส่ชื่อภาพยนตร์" />
      </Form.Item>

      <Form.Item label="วันที่ฉาย" name="date" rules={[{ required: true, message: 'กรุณาเลือกวันที่ฉาย' }]}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="รายละเอียด" name="description" rules={[{ required: true, message: 'กรุณากรอกรายละเอียด' }]}>
        <Input.TextArea rows={4} placeholder="ใส่รายละเอียดภาพยนตร์" />
      </Form.Item>

      <Form.Item label="ฉายในโรงภาพยนตร์" name="Atcinema" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="อัปโหลดภาพโปสเตอร์" name="posterimagePath">
        <Upload 
          listType="picture-card" 
          fileList={posterFileList}
          onChange={handlePosterChange}
          maxCount={1} // จำกัดให้เลือกรูปเดียว
          beforeUpload={() => false}
          showUploadList={{ showPreviewIcon: true }}>
          <Button icon={<UploadOutlined />}>อัปโหลดโปสเตอร์</Button>
        </Upload>
      </Form.Item>

      <Form.Item label="อัปโหลดภาพพื้นหลัง" name="backgroundimagePath">
        <Upload 
         listType="picture-card"
         fileList={backgroundFileList}
         onChange={handleBackgroundChange}
         maxCount={1}
         beforeUpload={() => false}
         showUploadList={{ showPreviewIcon: true }}>
          <Button icon={<UploadOutlined />}>อัปโหลดพื้นหลัง</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          เพิ่มภาพยนตร์
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AdminMovieForm;