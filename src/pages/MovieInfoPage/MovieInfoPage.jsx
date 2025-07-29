import React, {useEffect, useState} from "react";
import { useParams } from 'react-router-dom';
import styles from "../MovieInfoPage/MovieInfoPage.module.scss"
import Movieactor from "../../component/movieActor/movieActor";
import CommentCard from "../../component/Comment/Comment";
import commentForm from "../../component/commentForm/commentForm";
import Footer from "../../component/Footer/Footer"
import _ from "lodash";
import axios from "../../config/axios";
import { Form, Input, Button, Rate, message, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import DOMPurify from "dompurify";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/autoplay'
import { AnimatePresence, motion } from "motion/react"

function MovieInfoPage() {
    const { id } = useParams();
    const [movie, setMovie] = useState([]);
    const [actors, setActors] = useState([]);
    const [director, setDirector] = useState([]);
    const [languageArray,setLanguageArray] = useState([]);
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
    const displayCount = 5;
    const [visibleComment, setVisibleComment] = useState(displayCount);
    const [averageRating, setAverageRating] = useState(0)

    const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && visibleComment < comment.length) {
        setVisibleComment(prev => prev + displayCount);
    }
    };

    useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    }, [visibleComment, comment.length]);

    useEffect(() => {
        // ใช้ id เพื่อดึงข้อมูลของหนังจาก API หรือฐานข้อมูล
        // window.scrollTo(0, 0);
        const fetchMovie = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/movie/${id}`);
                const data = response.data;
                console.log("API Response:", data);
                setMovie(data);
                const director = data.Actors.filter(actor => actor.role === 'director');
                const actors = data.Actors.filter(actor => actor.role === 'actor');
                setActors(actors);
                setDirector(director);

            if (data.backgroundimagePath) {
                const images = JSON.parse(data.backgroundimagePath).map(path => 
                    `http://localhost:8000/${path.replace(/\\/g, "/")}`
                );
                setImageArray(images);
            }

            if (data.lang) {
                try {
                    const stringLang = JSON.parse(data.lang);
                    const arrLang = stringLang.split(",");
                    setLanguageArray(arrLang); // set ใน state
                    console.log("ภาษาที่พากษ์", languageArray);
                } catch (error) {
                    console.error("Error parsing lang:", error);
                }
            }
          } catch (error) {
                console.error("Error fetching movie:", error);
            }
        };

        fetchMovie();
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
             const allComments = httpResponse.data;
            setComment(allComments);

            const averageRating = allComments.length
            ? (
                allComments.reduce((sum, c) => sum + (c.ratingScore || 0), 0) /
                allComments.length
                ).toFixed(1)
            : 0;
            console.log("Average Rating:", averageRating);
            setAverageRating(averageRating)

        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };
    
    let fetchUser = async () =>{
        const httpResponse = await axios.get('user/profile');
        setUserInfo(httpResponse.data);
        console.log(httpResponse.data);
    }

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

   const handleDeleteComment = async (id)=> {
    try {
        await axios.delete(`/comment/${id}`);
        message.success("ลบคอมเม้นสำเร็จ");
        fetchComment();
    } catch (error) {
      console.error("เกิดปัญหาในการลบ:", error);
      message.error("ไม่สามารถลบคอมเม้นได้");
    }
  }

   let safeDescription = DOMPurify.sanitize(movie.description);

   // แทนที่ class="highlight" ด้วย class ที่ได้จาก CSS Modules
   safeDescription = safeDescription.replace(
     /class=["']highlight["']/g,
     `class="${styles.highlight}"`
   );

   function formatThaiDate(dateString) {
    const months = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
  
    let [year, month, day] = dateString.split("-");
    year = parseInt(year) + 543; // แปลง ค.ศ. เป็น พ.ศ.
    month = months[parseInt(month) - 1];
  
    return `${parseInt(day)} ${month} ${year}`;
  }

  function convertLangCodeToFull(langCode) {
    const languageMap = {
      "TH": "Thai",
      "EN": "English",
      "JP": "Japanese",
      "CN": "Chinese",
      "KR": "Korean",
      "FR": "French",
      "DE": "German",
      "ES": "Spanish",
      "IT": "Italian",
      "RU": "Russian"
    };
  
    return languageMap[langCode.toUpperCase()] || langCode; // ถ้าไม่มีในรายการ ให้คืนค่าเดิม
  }

    return (
        <div>
            <div className={styles.coverImage}>
                {imageArray.length > 0 && (
                    <div className={`fade-image ${fade ? "fade-out" : "fade-in"}`}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentImageIndex}
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <img src={imageArray[currentImageIndex]} alt={movie.title} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}
            </div>
            <div className={styles.movieinfo}>
                <div className={styles.movieinfo_name}>
                    <div>{movie.title}</div><div>{movie.engTitle}</div>
                </div>
                <div>
                    <span className={styles.movieinfo_logo}><span>THAI</span>REVIEW</span><span>8.2 (12.0)</span><span>2021</span><span>1 hour 55 minutes</span><span>Sci-fi</span>
                </div>
                <div className={styles.movieinfo_btn}>
                    <span className={styles.btn}><button className={styles.btn_watchTrailer}  onClick={() => setIsOpenTrailer(true)}>Watch trailer</button></span>
                    <button className={styles.btn_watchNow}><i className="fa-solid fa-play"></i>Watch now</button>
                </div>
            </div>
             <AnimatePresence>
                {isOpenTrailer && (
                    <motion.div
                                key="popup"
                                className={styles.popup_motion_wrapper}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1}}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                    >
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
                    </motion.div>
                )}
            </AnimatePresence>
            <div>
                <motion.div
                    className={styles.followed_list}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2 }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <div className={styles.movieinfo_story}>
                        <div className={styles.movieinfo_story_header}>เรื่องย่อ</div>
                        <div className={styles.movieinfo_story_detail} dangerouslySetInnerHTML={{ __html: safeDescription }}></div>
                    </div>
                </motion.div>
            </div>

            <section className={styles.movieinfo_actor}>
                <motion.div
                    className={styles.followed_list}
                    initial={{ opacity: 0, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                >
                <div className={styles.movieinfo_actor_header}>นักแสดงนำ</div>
                <div className={styles.movieinfo_actor_pic}>
                    <Swiper
                        // install Swiper modules
                        key={"Actor"}
                        modules={[Navigation, Scrollbar, A11y, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={7}
                        navigation
                        // scrollbar={{ draggable: true }}
                        observer={true}         // ✅ ให้ Swiper อัปเดตเมื่อ DOM เปลี่ยนแปลง
                        observeParents={true}   // ✅ ให้ตรวจสอบ DOM ระดับพ่อแม่ด้วย
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 10 },  // หน้าจอเล็ก (มือถือ)
                            768: { slidesPerView: 2, spaceBetween: 15 },  // Tablet
                            1024: { slidesPerView: 2.5, spaceBetween: 20 }, 
                            1280: { slidesPerView: 7, spaceBetween: 0 }, // ค่าปกติที่ตั้งไว้
                            1900: { slidesPerView: 8, spaceBetween: 0 }, 
                        }}
                    >
                        {movie && actors ? (
                            actors.map ((list)=> (
                                <SwiperSlide key={list.id} className={styles.SwiperSlide}>
                                    <Movieactor actorpic={list.actorimagePath} actorname={list.actorname}/>
                                </SwiperSlide>
                            ))
                            ) : (
                            <p>Loading...</p>
                        )}
                    </Swiper>
                </div>
                </motion.div>
            </section>
            
            <section className={styles.movieinfo_container}>
                <div className={styles.movieinfo_review}>
                    <div className={styles.movieinfo_review_header}>
                        <h1>Reviews</h1>
                        <button onClick={togglePopup}>+ Add Your Review</button>
                    </div>
                    <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            key="popup"
                            className={styles.popup_motion_wrapper}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1}}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
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
                        </motion.div>
                    )}
                    </AnimatePresence>
                    <div className={styles.movieinfo_review_box}>
                        <div>
                        {comment.slice(0, visibleComment).map((list => {
                            const userImageUrl = list.User?.userimagePath 
                            ? `http://localhost:8000/${list.User.userimagePath}` 
                            : "https://example.com/default-avatar.jpg"; // ใช้รูปดีฟอลต์ถ้าไม่มีรูป

                            return (
                            <div key={list.id} className={styles.comment_container}>
                               <CommentCard 
                                    avatar={userImageUrl}
                                    name={list.User?.name || "ไม่ระบุชื่อ"}
                                    date={list.commentDate}
                                    commentText={list.commentText}
                                    rating={list.ratingScore}
                                    userInfo={userInfo}
                                    commentId={list.id}
                                    handleDeleteComment={handleDeleteComment}
                                />
                            </div>
                            )}
                        ))}
                        </div>
                    </div>
                </div>
                
                <div className={styles.movieinfo_data}>
                    <div className={styles.movieinfo_data_container}>
                        <div className={styles.movieinfo_data_header}>
                            <div className={styles.movieinfo_data_icon}>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAACTklEQVR4nO3dS47TUBBAUU+atfBZKn8xSFWyg+wAWAbNQqB7FiQjSx4h6IzyTmHXlWrc975ynB7lTVPTNE3T3IjMnJ+aCVPdb/OBWdxv84FZ3G/zgVncb/OBWdxv84FZ3G/zgVncb/OBWdzvKsfj8VVmvo+I+4h4vBb0v09EPK6t7w6Hw0t28Ofz+VlEfIqIX/pQ0i1jaf+YmXfi8L/qA8g682XoEpYnv0D0XGki4sOwd/6eXzv577mcTqcXN1/AsukCsXPReXvzBWTm9wKhc9H5NmIBDwVC54oTET9HLOBJiWnjpO7nAhjezwUwvJ8LYHg/F8Dwfi6A4f1cAMP7uQCG918T2PtMvYDsBeinMPsT4A8i+xXkDyPB9HdA9gL4U5j9CfAHkXt9BU0bJ3U/F8Dwfi6A4f1cAMP7uQCG93MBDO/nAhjezwUwvJ8LYHg/F8Dwfi6A4f1cAMP7uQCG93MBDO/nAhjezwUwvJ8LYHg/F8Dwfi6A4f1cAMP7uQCG93MBDO/nAhjezwUwvJ8LYHg/F8Dwfi6A4f1cAMP7uQCG93MBDO/nAhjezwUwvJ8LYHg/F8Dwfi6A4f1cAMP7uQCG93MBDO/nAhjezwUwvH/5cdJrEjueHyMWcF8gdN7tTxcvN0cUCJ0rTkS8vvkClms7+ufr828LuGTm82kE67Ud/InLQrO8GYYc/rqAu/XaDh6eNebz8Htklj+4XuZwKXAAM5rL+p049vD//E5Ybo5Y/gPYyd0CD2vrmyFXljRN0zRN0zRN0zRN0zTTVvgN1dwmpJkliC0AAAAASUVORK5CYII=" alt="calendar--v1"></img>
                            </div>
                            <span>วันเดือนปีฉาย</span>
                        </div>
                        <div className={styles.movieinfo_data_date}>{movie.date ? formatThaiDate(movie.date) : "ไม่ระบุ"}</div>
                    </div>
                    <div className={styles.movieinfo_data_container}>
                        <div className={styles.movieinfo_data_header}>
                            <div className={styles.movieinfo_data_icon}>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFH0lEQVR4nO2dS4gcRRjHy+DjIIp6UfEVH1HBmze96Mmop4AsCoooYgQD8RVjAuIcvHhIhJHdqf+/ZmRwby74QhDBixhdXaIrSW6CBgX1oEaXCCK62/KxvdB2unf6NTtVPd8fvst2VVf195v6qrqqutYYlUqlUqlUKpVKpVKpVCqVSqWalHq93k0AXgAwJLngoc065x4ZDocXmTZrMBhcQPINkqskowDslHPucdNiGMseODmqYC+btiluGVGoZq2917SpzwgoTEU5tmzaIpIHPHBoVNecc9eaNigeTbUByE7TBsVDycyHNJ6J5MwmUGZMG6RAPJMC8UwKxDMpkCkCwlQn3PT9tFNXIOOXthDPpEA8kwJpAZARnWttM9XKnd43dQUyRimQFgBxzl0Zt5I6tpQo69PktU3qqiFrXALwwQYQAK8XyaNAxigAnyeAvKpAaoQsa+0VyRDT6XS2lQVC8qdEWU81AORw3TAqa/MkrzcBdup3JdNZa7eXKXN2dvayVFn3FKzrWIfbCTtOcpcJqIVsT6Zzzj1YpkwA9yfyr/Z6vYs9A7Jhh0wob+okv030AZ+VLPOdRDlLJfJtNRB5tj0mECAvpdI/UKQ859wtyW1HAJ4tkq/b7V5IcnGrgZD8o2gLniiQfr9/CclfE479bVRf0ul0tpE8kihjRe7jMYyNZ3vUhDC5mA4hAL4bDAbXZKWNougsAHOp9B3fYcT1nDOhzPYCmE/l+57k7ck08/Pz52dsVz3R7XbP8x1GDORNEwqQhYWFcwG8l8r7D8luv9+/FMBDJE+mrv/inLsxBBixLZiQ1kMECsm3Mu6xmvG3n0neGhAM/4HI5KK19mGST5A8SPI1AO/HLWNU8x+SfFLuEQgM/4E09D4wkwUjOcflkbUCyAqATwD8VQSIpy0jHCAA/pXPyuI+4TiAD0laCUcAbut0OmcnHH1fHNY+BvAjydNJIBVgnMozAH9PHZAm1S0fppZLziAokDHCiGQQUeCLMAVSVt2KHbi1dseoewM4pi1kC2CQ/KrI/QG8qEDGDyOS7yGLlCGzAAqkIAzWG9qesbxKcm9WWQC+DrJTl4mzTSoy07AtVnUKgC+z1vYB/E7ynPS1eAYhSCD/mxL32PZn1H13fO2O9LVer3ddkEDkIBcPnB1VCVeJWeZXsp5NBgHBAZFTdeK33MhjO5qut6ylAPgzvn4i69nkVKPggIjkVB0PnB7lGYDnM+q8M5lmbm7uqqywBWAtOCAiOVXHUxhrWWv1MjeWSrc757mOBglEFO/c8+2YpqVR25BiezcrnbSuYIFsSH6RAO5uYJh7uAFn7Muo346Mmd4fsoa/8bOsBQ2kKbHmQpY4Mm8XS8l6fKFATCMri4sN/TCeUyCmESDPNAFERmA1w5aGLKw78GrTkGrOoSkQ5oQrGd4C+CjPrLV35uR7WoGwesgSB1acDult8l1k1bMlp7uFICdckby8QF9wcpP6yMelCoTlnXAky6HW2seK5Jd19RwgexUIK/0i8xad3q4T7uRTunj7koYslnOC7BPO0umC+b9hvlYUCIO36e7U6Z8pEE4eggLh5B2vQDh5ZysQTt7B0wkE64tcUQtsYNqgfr9/gwfObMIKbWENQlw/yCUK2GRC8mbTFpHc5YFTK5t8h2/aJpKHAoVxTDaImzYKwB45yGXSTi5oq9IyWgtjQ3KqjhzkIv8c0oN/UHmGxd/Q729Vn6FSqVQqlUqlUqlUKpVKpVKpTHD6D5P5e5+VwU8KAAAAAElFTkSuQmCC" alt="translation"></img>
                            </div>
                            <span>ภาษาที่พากษ์</span>
                        </div>
                        <div className={styles.movieinfo_data_box}>
                            {languageArray.map((list) => (
                                <div key={list}>{convertLangCodeToFull(list)}</div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.movieinfo_data_container}>
                        <div className={styles.movieinfo_data_header}>
                            <div className={styles.movieinfo_data_icon}>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAACc0lEQVR4nO1WPWgUQRRewUNBBP+DFmLrD4o2VgYUQWMpCNqmSiFqo+m86sD2PJj5vpk9l5yQyjZgYiVYBCuVRCEKoviDSAIqGCTElYdvYVguXm73vID4YGCYfd/Pe7Ozs1H0P0qEc+6gjGitgqQH4NZEvNls7iT5XYbM+24AQJVkquNmX8Xr9foGkh8DA5+SJNnYNwMkh0UYwGMZamK4bwYAPFXRi9baS2pmJk3Tdf0QP6vi70hWqtXqepJvZM05d+avGyA5qRVfD9Zu6Nr9nop577cZYw6RHNJ9rwH4SfKbMWZrlidzWdNnNc0dEqxwdBRKkmSLAu+SfEhyTs942m4AaOQ5ZG2lfOWaU27RqIlmnuA8gMUc8AvJWQAPSI6pycve+4E23RqQZ5ozpphZ5QjNL4pW2044506QXNDk6bDNRUO3Z1o5F0TjjwBr7QGSbxUgFewtKh7H8R6ST5Trg7X2SDfAZ9qy9977w92Ke+/3Z8eT5IuuCzG/W/do1a0LguRxkp+zr2Xhy6rVam0iOZG9yasxoe9RdoImhCMqEyQrAF4KobX2XKd8ydHKBVMpJS4hJFKRfmR2RB2i0Whsl1w90j0xcCyrqAvMK8EYY46WNgBgRPdzvM1xlXthUuY5A+NqeqS0AZJ31MDV4HTcAvAj+MItkaQxZpeavqYGmqUNAJhRskGSVwDMB6K3dSxpzrzmDGb/CKXE4zjeTHJZBV8HFU+FbdftmAqeZ7nLwlHYgHPuVO4ikaN1YaV8kqcBPM9daCcLGwAwqsJfZS4/o50wkiO5glHsaBkD9/Ql3N0tVjCCFY7CBqy1+wqDe8gR/dPxC+Byjbjs0fr8AAAAAElFTkSuQmCC" alt="star--v1"></img>
                            </div>
                            <span>คะแนนรีวิว</span>
                        </div>
                        <div className={styles.movieinfo_data_score}>
                            <div className={styles.movieinfo_data_score_header}>Thaireview</div>
                            <div className={styles.comment_rating}>
                                <div className={styles.star_rating}>
                                    <div className={styles.star_background}>
                                        {'★'.repeat(5)} {/* ดาวเงาที่เป็นพื้นหลัง */}
                                    </div>
                                    <div className={styles.star_foreground} style={{ width: `${(averageRating  / 5) * 100}%` }}>
                                        {'★'.repeat(5)} {/* ดาวเต็มที่จะปรากฏตามคะแนน */}
                                    </div>
                                </div>
                                <span className={styles.rating}>{averageRating}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.movieinfo_data_container}>
                        <div className={styles.movieinfo_data_header}>
                            <div className={styles.movieinfo_data_icon}>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAACN0lEQVR4nO2dzW7TQBRGvSjPQpF4QVbeQwM7637KcxSegQ0LyotAkYjIYtAIL/ixQ0nj+03ic6S7tefOmfniNoqn6wAAAAAAAAAAAB7Idrt9FhGvI+JTRHyVVC654mePd5I2kq5tC0XSE0lvJO3dkyJf1d43fd9fOSb/XQMTUFqoiHibKmFc+fbG1VZt0jJ/5bFTZmo/DMPTxQWw+nVIws3iAurTTgOrrTRad4sLkHTfQKOlxYqILxkCDg6iu3Dk7t8+ADP2/u0DMGPv3z4AM/b+swegh38Ivjjx9Sb7QYBmJ2s3DMNzBPh2QJH0of6fih3gE1D+FUVE0PICdoeiCAHLCyiHoggBOQLKXBQhIE/AbiqKEHAC+r6/kvT+FE9F/8vq/g6Yo34hHhHfHvtUdHb92wfwC3VyH/tUdHb92wdgjiJ7//YBHB9FR9XE/RBwZBQhoIEoKuyAM4ui7u/7EEGZUTRxDwRkRtGf90BAchRNXJ8dkBlFE9dGgBMEmEGAGQSYQYAZBJhBgBkEmEGAGQSYQYAZBJhBgBkEmEGAGQSYQYAZBJhBgBkEmEGAGQSYQYAZBJhBgBkEmEGAGQSYQYAZBJhBgBkErF1AfTnpqX+HpcupzxkCeHWxZgV8XFzAeHKEe6WVRutlhoBrXl+vqcn/nvL6+lECu0C/C4iIV13y73FvG9jypZG6TT9HZpSwWflpGvu68tMnf+Iz4WY82mkNZwvc117rxKdlPgAAAAAAAAAAdJfAD3AAZiuw2PCtAAAAAElFTkSuQmCC" alt="option"></img>
                            </div>
                            <span>ประเภทหนัง</span>
                        </div>
                        <div className={styles.movieinfo_data_genre}>
                            {movie.Genres && movie.Genres.map((genre => (
                                <div className={styles.movieinfo_data_box} key={genre.id}>
                                    <div>{genre.genreName}</div>
                                </div>
                            )))}
                        </div>
                    </div>
                    <div className={styles.movieinfo_data_container}>
                        <div className={styles.movieinfo_data_header}>
                            <span>ผู้กำกับ</span>
                        </div>
                        <div>
                            {director.map((list) => {
                                let directorImage = `http://localhost:8000/${list.actorimagePath}`
                                return (
                            <div className={styles.movieinfo_data_director}>
                                <div className={styles.movieinfo_data_director_image}>
                                    <img src={directorImage}></img>
                                </div>
                                <div className={styles.movieinfo_data_director_info}>
                                    <div className={styles.movieinfo_data_director_name}>{list.actorname}</div>
                                    <div className={styles.movieinfo_data_director_role}>จากประเทศ{list.country}</div>
                                </div>
                            </div>
                            )})}
                        </div>
                    </div>
                    <div className={styles.movieinfo_data_container}>
                        <div className={styles.movieinfo_data_header}>
                            <span>เพลงประกอบ</span>
                        </div>
                        <div className={styles.movieinfo_data_director}>
                            <div className={styles.movieinfo_data_director_image}>
                                <img src="#"></img>
                            </div>
                            <div>
                                <div className={styles.movieinfo_data_director_name}>บรรจง ปิสัญธนะกุล</div>
                                <div className={styles.movieinfo_data_director_role}>จากประเทศไทย</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    )
}

export default MovieInfoPage;