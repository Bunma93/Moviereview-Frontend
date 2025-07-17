import React, {useState, useEffect} from "react";
import styles from "../commentForm/commentForm.module.scss"
import axios from "../../config/axios";
import { Form, Input, Button, Rate, message, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

function CommentForm() {

    // let fetchUser = async () =>{
    //     const httpResponse = await axios.get('user/profile');
    //     setUserInfo(httpResponse.data);
    //     console.log(httpResponse.data);
    // }

    // useEffect(() => {
    //     fetchUser(); 
    // },[])

    // const [userInfo,setUserInfo] = useState([]);
    // const [isOpen, setIsOpen] = useState(false);
    // const imageUrl = `http://localhost:8000/${userInfo.userimagePath}`;
    // const togglePopup = () => {
    //     setIsOpen(!isOpen);
    // };

    // const handleSubmit = async (values) => {
    //     try {
    //       // ส่งข้อมูลคอมเม้นท์ไปยัง API
    //       const response = await axios.post('/comment/addcomment', {
    //         MovieId: movie.id, // ระบุ movieId ที่ต้องการคอมเม้นท์
    //         commentText: values.commentText,
    //         ratingScore: rating,
    //       }, );
          
    //       if (response.status === 200|| response.status === 201) {
    //         message.success('คอมเม้นท์สำเร็จ');
    //         setCommentText('');
    //         setRating(0); // รีเซ็ตฟอร์ม
    //         fetchComment();
    //       } else {
    //         message.error(response.data.message); 
    //     }
    //     } catch (error) {
    //         if (error.response) {
    //             message.error(error.response.data.message || 'เกิดข้อผิดพลาดในการเพิ่มคอมเม้นท์');
    //         } else {
    //             message.error('เกิดข้อผิดพลาด โปรดลองอีกครั้ง');
    //         }
    //         console.error('Error adding comment: ', error);
    //     }
    // }
    return (
        <div>
             {/* <div className={styles.popup_overlay} onClick={togglePopup}>
                <div className={styles.popup_content} onClick={e => e.stopPropagation()}>
                    <Form className={styles.popup_form} onFinish={handleSubmit} layout="vertical">
                        <div className={styles.popup_info}>
                            <div className={styles.popup_user}>
                                <Avatar className={styles.Avatar} size={45} icon={<UserOutlined />} src={imageUrl}/>
                                <div className={styles.Name}>{userInfo.name}</div>
                            </div>
                            <div>
                                <Form.Item
                                    // label="ให้คะแนน"
                                    className={styles.Rate}
                                    name="ratingScore"
                                    rules={[{ required: true, message: 'กรุณาเลือกคะแนน' }]}
                                >
                                    <Rate
                                    className={styles.Rate}
                                    allowHalf
                                    value={rating}
                                    onChange={(value) => setRating(value)}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <Form.Item
                            label="คอมเม้นท์/รีวิว"
                            name="commentText"
                            rules={[{ required: true, message: 'กรุณากรอกรีวิว' }]}
                            className={styles.comment}
                        >
                            <Input.TextArea
                            className={styles.custom_textarea}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            rows={4}
                            placeholder="เขียนความคิดเห็นของคุณ"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button className={styles.popup_submit}type="primary" htmlType="submit">
                            ส่งคอมเม้นท์
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div> */}
        </div>
    )
}

export default CommentForm;