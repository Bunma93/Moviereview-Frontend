import {React, useState, useEffect} from "react";
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/scrollbar';
import Playlist from "../../component/profile/profile-playlist";
import Review from "../../component/profile/profile-review";
import axios from "../../config/axios";
import { Link } from 'react-router-dom';
import { Avatar, Space, Popconfirm, message, Modal, Form, Input, Rate, Button} from 'antd';
import { useForm } from "antd/es/form/Form";
import { UserOutlined } from '@ant-design/icons';
import CoverPageCarousel from "../../Carousel"
import UserPlaylistForm from "../UserPlaylist/UserPlaylistForm"
import MoviePoster from '../../component/movieposter/movieposter';
import styles from "../ProfilePage/ProfilePage.module.scss";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectCoverflow } from 'swiper/modules';

function ProfilePage() {
    const [userProfile, setUserProfile] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [myPlaylist, setMyPlaylist] = useState([]);
    const [myComment, setMyComment] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [editReviewModalOpen, setEditReviewModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [rating, setRating] = useState("");
    const [form] = Form.useForm();
    
    const toggleModal = () => {
        setOpenModal(!openModal);
    }
    
    const fetchMyPlaylist = async () => {
        const httpResponse = await axios.get("/playlist/myplaylist");
        setMyPlaylist(httpResponse.data);
        console.log("ข้อมูลที่ได้มาจาก myplaylist", httpResponse.data);
    }
    
    const fetchMyComment = async () => {
        const httpResponse = await axios.get("/comment/commentById");
        setMyComment(httpResponse.data);
        console.log("ดีงคอมเม้นมาได้", httpResponse.data);
    }
    //ดึงข้อมูลหนังทั้งหมด
    const fetchUserProfile = async () => {
        const httpResponse = await axios.get("/user/profile");
        setUserProfile(httpResponse.data);
    };

    useEffect(() => {
        fetchUserProfile();
        fetchMyPlaylist();
        fetchMyComment();
    },[]);

    const handleEditClick = (playlist) => {
        setSelectedPlaylist(playlist);  // playlist = {playlistName: 'xxx', Movies: [...]}
        toggleModal(); // เปิด Modal
    };

    const handleEditReview = (review) => {
        setSelectedReview(review);
        setEditReviewModalOpen(true);
        console.log("คอมเม้น", selectedReview);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPlaylist(null); // ✅ เคลียร์ค่า initialPlaylist
        fetchMyPlaylist()
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/playlist/${id}`);
            message.success("ลบเพลลิสต์สำเร็จ");
            fetchMyPlaylist();
        } catch (error) {
            console.error("เกิดปัญหาในการลบ:", error);
            message.error("ไม่สามารถลบเพลลิสต์ได้");
        }
    }

    const imageUrl = `http://localhost:8000/${userProfile.userimagePath}`;
    const imageUrl_Backgroud = `http://localhost:8000/${userProfile.userBackgroundImagePath}`;
    
    return (
        <div>
            <div className={styles.coverPage_Profile}>
                <img src={imageUrl_Backgroud} />
            </div>
            <div className={styles.profile}>
                <div className={styles.profile_info}>
                    <Avatar size={230} icon={<UserOutlined />} src={imageUrl} className={styles.profile_info_Avatar}/>
                    <div className={styles.profile_info_name}> 
                    {userProfile.name 
                        ? userProfile.name.split(' ').map((word, index) => (
                            <div key={index}>{word}</div>
                        ))
                        : "Loading..."
                    }
                    </div>
                </div>
                <div className={styles.profile_followed}>
                    <div>ผู้ติดตาม 1700 คน</div>
                    <button className={styles.profile_followed_button}>ติดตาม</button>
                </div>
            </div>
            <div className={styles.profile_container}>
                <div className={styles.profile_container_myPlaylist}>
                    <h1>เพลลิสหนังของฉัน</h1>
                    <button onClick={toggleModal}>สร้างเพลลิส</button>
                </div>
                {/* <hr></hr> */}
                {myPlaylist.length ===0 && (
                    <div className={styles.profile_container_newPlaylist}>
                        <button onClick={toggleModal} className={styles.profile_container_newPlaylist_box}>
                           <span className={styles.plus_icon}>＋</span>
                            สร้างเพลลิสต์แรกของคุณ
                        </button>
                    </div>
                )}
                <hr></hr>
                {/* เพลลิส */}
                {openModal&& (
                    <UserPlaylistForm 
                        userPic={imageUrl} 
                        userName={userProfile.name} 
                        toggleModal={handleCloseModal} 
                        initialPlaylist={selectedPlaylist}
                    />
                )}
                {myPlaylist.map((list) => (
                    <div key={list.id} className={styles.playlist_container}>
                        <div className={styles.playlist_container_header}>
                            <div className={styles.playlist_container_header_edit}>
                                <div className={styles.playlist_container_name}>{list.playlistName}</div>
                                <button onClick={() => handleEditClick(list)}>
                                    <img width="20" height="20" src="https://img.icons8.com/material-rounded/96/pencil--v1.png" alt="pencil--v1"/>
                                </button>
                            </div>
                            <div>
                                <Popconfirm
                                    title="คุณแน่ใจว่าต้องการลบเพลลิสต์นี้?"
                                    onConfirm={() => handleDelete(list.id)}
                                    okText="ใช่"
                                    cancelText="ยกเลิก"
                                >
                                    <button>  
                                        <img width="20" height="20" src="https://img.icons8.com/material-rounded/24/trash.png" alt="trash" />
                                    </button>
                                </Popconfirm>
                            </div>
                        </div>
                        <div className={styles.movieGrid}>
                            <Swiper key={"Playlist"}
                                modules={[Navigation, Scrollbar, A11y]}
                                spaceBetween={0}
                                slidesPerView={5}
                                navigation
                                // loop={true}
                                observer={true}
                                observeParents={true}
                                breakpoints={{
                                    320: { slidesPerView: 1 },
                                    768: { slidesPerView: 2 },
                                    1024: { slidesPerView: 3 },
                                    1280: { slidesPerView: 5 },
                                    1900: { slidesPerView: 6.5 }
                                }}
                            >
                            {list.Movies.map((movie) => {
                                let movielangArr = [];
                                    try {
                                    movielangArr = movie.lang ? JSON.parse(movie.lang) : [];
                                } catch (error) {
                                    console.error("Error parsing lang:", error);
                                }
                                return (
                                <SwiperSlide key={list.id} className={styles.News_SwiperSlide}>
                                <MoviePoster
                                    className={styles.movielist}
                                    key={movie.id}
                                    moviename={movie.title}
                                    moviepic={movie.posterimagePath}
                                    movieage={movie.age}
                                    movielang={movielangArr}
                                />
                                </SwiperSlide>
                                );
                            })}
                            </Swiper>
                        </div>
                        <hr></hr>
                    </div>
                ))}
            </div>
            <div className={styles.profile_review}>
                <div>
                    <h1>รีวิวของฉัน</h1>
                </div>
                {myComment.length ===0 && (
                    <div className={styles.profile_container_newPlaylist}>
                        ยังไม่มีรีวิวจากคุณ &nbsp;&nbsp;<span className={styles.redText}>เริ่มรีวิวหนังกันเถอะ!</span>
                    </div>
                )}
                {/* รีวิว */}
                {editReviewModalOpen && (
                    <Modal
                        title="แก้ไขรีวิว"
                        open={editReviewModalOpen}
                        onCancel={() => setEditReviewModalOpen(false)}
                        footer={null}
                    >
                        <Form
                            form = {form}
                            initialValues={{
                                ratingScore: selectedReview?.ratingScore,
                                commentText: selectedReview?.commentText
                            }}
                            onFinish={async (values) => {
                                await axios.put(`/comment/${selectedReview.id}`, values);
                                message.success("อัปเดตรีวิวแล้ว");
                                setEditReviewModalOpen(false);
                                fetchMyComment();
                            }}
                        >
                            <Form.Item
                                label="คะแนนรีวิว"
                                name="ratingScore"
                                rules={[{ required: true, message: 'กรุณาใส่คะแนนรีวิว' }]}
                            >
                               <Rate
                                    className={styles.Rate}
                                    allowHalf
                                    value={rating}
                                    onChange={(value) => setRating(value)}
                                />
                            </Form.Item>

                            <Form.Item 
                                label="คอมเม้น/รีวิว"
                                name="commentText"
                                rules={[{ required: true, message: 'กรุณาใส่คอมเม้น' }]}
                            >
                                <Input.TextArea
                                    value={selectedReview.commentText}
                                    rows={4}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="กรุณากรอกข้อความของคุณ"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Popconfirm
                                    title="คุณแน่ใจหรือไม่ว่าต้องการแก้ไขรีวิวนี้?"
                                    onConfirm={() => form.submit()} // ✅ ส่งฟอร์มเมื่อกดยืนยัน
                                    okText="ใช่"
                                    cancelText="ยกเลิก"
                                >
                                    <Button type="primary">
                                        แก้ไขรีวิว
                                    </Button>
                                </Popconfirm>
                            </Form.Item>
                        </Form>
                    </Modal>
                )}
                <div className={styles.profile_review_container}>
                    {myComment.map((list) => (
                        <Review 
                            name={list.Movie.title} 
                            ratingScore={list.ratingScore} 
                            commentText={list.commentText} 
                            commentDate={list.commentDate}
                            onEdit={()=> handleEditReview(list)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;