import React, { useState } from 'react';
import { Form, Input, DatePicker, Switch, Button, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from '../../config/axios';

const AdminMovieForm = () => {
  const [form] = Form.useForm();
  const [posterFile, setPosterFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState([]);// รองรับหลายไฟล์
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
      setBackgroundFile(fileList.map(file => file.originFileObj)); // เก็บหลายไฟล์
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

    if (posterFile) formData.append('posterimagePath', posterFile);
    if (backgroundFile) backgroundFile.forEach((file, index) => {
      formData.append(`backgroundimagePath_${index}`, file); // ส่งเป็น array
    });
    
    try {
      await axios.post('/movie/add', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('เพิ่มภาพยนตร์สำเร็จ!');
      form.resetFields();
      setPosterFile(null);
      setBackgroundFile(null);
      setPosterFileList([]);
      setBackgroundFileList([]);
    } catch (error) {
    // เช็คว่า error.response มีอยู่จริงก่อน
      if (error.response) {
        console.error("Error response:", error.response);
        message.error('เกิดข้อผิดพลาด: ' + (error.response.data?.message || error.message));
      } else {
        // หากไม่มี response จากเซิร์ฟเวอร์ให้แสดงข้อความที่เหมาะสม
        console.error("Error message:", error.message);
        message.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
      }
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none',color:"black" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8, color:"black" ,fontSize:"12px"}}>อัพโหลดรูป</div>
    </button>
  );

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="ชื่อภาพยนตร์" name="title" rules={[{ required: true, message: 'กรุณากรอกชื่อภาพยนตร์' }]}>
        <Input placeholder="ใส่ชื่อภาพยนตร์" />
      </Form.Item>

      <Form.Item label="วันที่ฉาย" name="date" rules={[{ required: true, message: 'กรุณาเลือกวันที่ฉาย' }]}>
        <DatePicker
          style={{ width: '100%' }}
          format="YYYY-MM-DD" // กำหนด format ของวันที่
         />
      </Form.Item>

      <Form.Item label="รายละเอียด" name="description" rules={[{ required: true, message: 'กรุณากรอกรายละเอียด' }]}>
        <Input.TextArea rows={4} placeholder="ใส่รายละเอียดภาพยนตร์" />
      </Form.Item>

      <Form.Item label="ฉายในโรงภาพยนตร์" name="Atcinema" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="อัปโหลดภาพโปสเตอร์" name="posterimagePath" rules={[{ required: true, message: 'กรุณาอัพโหลดรูปภาพ' }]}>
        <Upload 
          listType="picture-card" 
          fileList={posterFileList}
          onChange={handlePosterChange}
          maxCount={1}
          beforeUpload={() => false}
          showUploadList={{ showPreviewIcon: true }}>
          {posterFileList.length >= 1 ? null : uploadButton}
          {/* <Button icon={<UploadOutlined />}>อัปโหลดโปสเตอร์</Button> */}
        </Upload>
      </Form.Item>

      <Form.Item label="อัปโหลดภาพพื้นหลัง (สูงสุด 3 รูป)" name="backgroundimagePath" rules={[{ required: true, message: 'กรุณาอัพโหลดรูปภาพ' }]}>
        <Upload 
         listType="picture-card"
         fileList={backgroundFileList}
         onChange={handleBackgroundChange}
         maxCount={3}
         beforeUpload={() => false}
         showUploadList={{ showPreviewIcon: true }}>
         {backgroundFileList.length >= 3 ? null : uploadButton}
          {/* <Button icon={<UploadOutlined />}>อัปโหลดพื้นหลัง</Button> */}
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