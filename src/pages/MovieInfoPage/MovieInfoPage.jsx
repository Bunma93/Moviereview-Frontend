import React, {useEffect, useState} from "react";
import { useParams } from 'react-router-dom';
import styles from "../MovieInfoPage/MovieInfoPage.module.scss"
import Movieactor from "../../component/movieinfo-actor";
import CommentCard from "../../Comment/Comment";
import _ from "lodash";
import axios from "../../config/axios";
import { Form, Input, Button, Rate, message, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import DOMPurify from "dompurify";

function MovieInfoPage() {
    const { id } = useParams();
    const [movie, setMovie] = useState([]);
    const [imageArray, setImageArray] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [text, textUpdate] = useState("");
    const [comment, setComment] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [rating, setRating] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [fade, setFade] = useState(false);
    const [isOpenTrailer, setIsOpenTrailer] = useState(false);
    const [userInfo,setUserInfo] = useState([]);

    useEffect(() => {
        // ใช้ id เพื่อดึงข้อมูลของหนังจาก API หรือฐานข้อมูล
        window.scrollTo(0, 0);
        fetch(`http://localhost:8000/movie/${id}`)
          .then(response => response.json())
          .then(data => {
            setMovie(data);
            if (data.backgroundimagePath) {
                const images = JSON.parse(data.backgroundimagePath).map(path => 
                    `http://localhost:8000/${path.replace(/\\/g, "/")}`
                );
                setImageArray(images);
            }
        })
          .catch(error => console.error("Error fetching movie:", error));
    }, [id]);

    useEffect(() => {
        console.log("Fetching Movie:", id);
    }, [id]);

    const fetchComment = async () => {
        try {
            const httpResponse = await axios.get("/comment", {
                params: {
                    MovieId: movie.id  // ส่ง MovieId ที่ต้องการ
                }
            });
            setComment(httpResponse.data);
            console.log(httpResponse.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    useEffect(() => {
        if (movie.id) { 
            fetchComment(); 
            fetchUser(); 
        }
    }, [movie.id]);

    useEffect(() => {
        if (imageArray.length > 1) {
            const interval = setInterval(() => {
                setFade(true); // เริ่มจางออก
                setTimeout(() => {
                    setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageArray.length);
                    setFade(false); // ค่อยๆ แสดงภาพใหม่
                }, 600); // ระยะเวลาที่ใช้จางหาย (ต้องตรงกับ CSS)
            }, 6000); // เปลี่ยนภาพทุก 6 วินาที

            return () => clearInterval(interval);
        }
    }, [imageArray]);

    let fetchUser = async () =>{
        const httpResponse = await axios.get('user/profile');
        setUserInfo(httpResponse.data);
        console.log(httpResponse.data);
    }

    const imageUrl = `http://localhost:8000/${userInfo.userimagePath}`;

    if (!movie) {
    return <div>Loading...</div>;
    }
    // console.log(movie);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const toggleModal = () => {
        setIsOpenTrailer(false); 
    };

    
  const handleSubmit = async (values) => {
    try {
      // ส่งข้อมูลคอมเม้นท์ไปยัง API
      const response = await axios.post('/comment/addcomment', {
        MovieId: movie.id, // ระบุ movieId ที่ต้องการคอมเม้นท์
        commentText: values.commentText,
        ratingScore: rating,
      }, );
      
      if (response.status === 200|| response.status === 201) {
        message.success('คอมเม้นท์สำเร็จ');
        setCommentText('');
        setRating(0); // รีเซ็ตฟอร์ม
        fetchComment();
      } else {
        message.error(response.data.message); 
    }
    } catch (error) {
        if (error.response) {
            message.error(error.response.data.message || 'เกิดข้อผิดพลาดในการเพิ่มคอมเม้นท์');
        } else {
            message.error('เกิดข้อผิดพลาด โปรดลองอีกครั้ง');
        }
        console.error('Error adding comment: ', error);
    }
};

   const deletePlaylist = async (id) => {
        console.log(id);
        await axios.delete(`/comment/${id}`);
        fetchComment();
        // const newPlaylist = [...playlist];
        // const targetIndex = newPlaylist.findIndex(playlist => playlist.id === id);
        // newPlaylist.splice(targetIndex, 1);
        // setPlaylist(newPlaylist);
   };

   let safeDescription = DOMPurify.sanitize(movie.description);

   // แทนที่ class="highlight" ด้วย class ที่ได้จาก CSS Modules
   safeDescription = safeDescription.replace(
     /class=["']highlight["']/g,
     `class="${styles.highlight}"`
   );
   console.log(comment)
    return (
        <div>
            <div className={styles.coverImage}>
                {imageArray.length > 0 && (
                    <div className={`fade-image ${fade ? "fade-out" : "fade-in"}`}>
                        <img src={imageArray[currentImageIndex]} alt={movie.title} />
                    </div>
                )}
            </div>
            <div className={styles.movieinfo}>
                <div className={styles.movieinfo_name}>
                    <div>{movie.title}</div><div>{movie.title}</div>
                </div>
                <div>
                    <span className={styles.movieinfo_logo}><span>THAI</span>REVIEW</span><span>8.2 (12.0)</span><span>2021</span><span>1 hour 55 minutes</span><span>Sci-fi</span>
                </div>
                <div className={styles.movieinfo_btn}>
                    <span className={styles.btn}><button className={styles.btn_watchTrailer}  onClick={() => setIsOpenTrailer(true)}>Watch trailer</button></span>
                    <button className={styles.btn_watchNow}><i className="fa-solid fa-play"></i>Watch now</button>
                </div>
            </div>
            {isOpenTrailer && (
                <div className={styles.modal_overlay} onClick={toggleModal}>
                    <div className={styles.modal_content} onClick={e => e.stopPropagation()}>
                        <button className={styles.close_btn} onClick={toggleModal}>X</button>
                        <iframe 
                            width="100%" 
                            height="400px" 
                            src={movie.trailerUrl} 
                            title="YouTube Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
            <div>
                <div className={styles.movieinfo_story}>
                    <div className={styles.movieinfo_story_header}>เรื่องย่อ</div>
                    <div className={styles.movieinfo_story_detail} dangerouslySetInnerHTML={{ __html: safeDescription }}></div>
                </div>
            </div>
            <div>
                <div className={styles.movieinfo_actor}>
                    <div className={styles.movieinfo_actor_header}>นักแสดงนำ</div>
                    <div className={styles.movieinfo_actor_pic}>
                        <Movieactor actorpic={"1"} actorname={"ฉันทวิชช์ ธนะเสวี (เต๋อ)"}/>
                        <Movieactor actorpic={"1"} actorname={"ฉันทวิชช์ ธนะเสวี (เต๋อ)"}/>
                        <Movieactor actorpic={"1"} actorname={"ฉันทวิชช์ ธนะเสวี (เต๋อ)"}/>
                    </div>
                </div>
            </div>
            
            <div className={styles.movieinfo_container}>
                <div className={styles.movieinfo_review}>
                    <div className={styles.movieinfo_review_header}>
                        <h1>Reviews</h1>
                        <button onClick={togglePopup}>+ Add Your Review</button>
                    </div>
                    {isOpen && (
                    <div className={styles.popup_overlay} onClick={togglePopup}>
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
                    </div>
                    )}
                    <div className={styles.movieinfo_review_box}>
                        <div>
                        {comment.map((list => {
                            const userImageUrl = list.User?.userimagePath 
                            ? `http://localhost:8000/${list.User.userimagePath}` 
                            : "https://example.com/default-avatar.jpg"; // ใช้รูปดีฟอลต์ถ้าไม่มีรูป

                            return (
                            <CommentCard 
                                avatar={userImageUrl|| "https://example.com/avatar.jpg"}
                                name={list.User?.name || "ไม่ระบุชื่อ"} // ใช้ list.User.name แทน username
                                date="25/09/67" 
                                time="13.30" 
                                commentText={list.commentText}
                                rating={list.ratingScore}
                                key={list.id}
                            />
                            )}
                        ))}
                        </div>
                    </div>
                    <div>
                        footer
                    </div>
                </div>
                <div className={styles.movieinfo_data}>
                    <div>Release year</div>
                </div>
            </div>
        </div>
    )
}

export default MovieInfoPage;