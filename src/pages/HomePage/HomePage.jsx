import React, {useEffect, useState} from 'react';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import 'swiper/scss/scrollbar';
import 'swiper/scss/autoplay'
import "swiper/scss/effect-coverflow";
import classNames from 'classnames';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectCoverflow } from 'swiper/modules';
import styles from "../HomePage/HomePage.module.scss"
import { Link } from 'react-router-dom';
import axios from '../../config/axios';
import { Carousel } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import Admin from "../Admin/Admin";
import Movieposter from '../../component/movieposter/movieposter';
import About from '../../component/About/About';
import Footer from '../../component/Footer/Footer';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import image from "../../component/images/w644.jpg"
import image2 from "../../component/images/s_gettyimages-2202908378.jpg"
import image3 from "../../component/images/pngegg.png"
import image4 from "../../component/images/cf2630c2-1313-47e6-9de0-1131e4c36f45.jpg"
import { motion } from "motion/react";

function formatThaiDate(dateString) {
  const months = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const [year, month, day] = dateString.split("-");
  const thaiYear = parseInt(year) + 543;
  const thaiMonth = months[parseInt(month, 10) - 1];

  return `${parseInt(day, 10)} ${thaiMonth} ${thaiYear}`;
}

function HomePage({isLoggedIn, setIsModalOpen, setIsLoggedIn}) {
    const [movielist, setmovielist] = useState([]);
    const [newMovieList, setNewMovieList] = useState([]);
    const [oldMovieList, setOldMovieList] = useState([]);
    const [movieNewsList, setMovieNewsList] = useState([]);
    const [movieRankList, setMovieRankList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [backgroundImage, setBackgroundImage] = useState("");
    const [movieName, setMovieName] = useState("");
    const [movieRating, setMovieRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [movieEngName, setMovieEngName] = useState("");
    const [movieDate, setMovieDate] = useState("")

    //ดึงข้อมูลหนังทั้งหมด
    const fetchmovielist = async () => {
        try {
            const httpResponse = await axios.get("/movie");
            const allMovies = httpResponse.data;
    
            // แยกหนังใหม่ (Atcinema === 1) และหนังเก่า (Atcinema === 0)
            const newMovies = allMovies.filter(movie => movie.Atcinema == 1);
            const oldMovies = allMovies.filter(movie => movie.Atcinema == 0);
    
            setmovielist(allMovies);
            setNewMovieList(newMovies);
            setOldMovieList(oldMovies);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลหนัง:", error);
        }
    };

    const fetchMovieRankList = async () => {
        const httpResponse = await axios.get("/movie/rank");
        setMovieRankList(httpResponse.data);
    }

    const fetchMovieNewsList = async() => {
        const httpResponse = await axios.get("/movienews");
        setMovieNewsList(httpResponse.data);
    }

    const openModal = () => setIsModalOpen(true);

    useEffect(() => {
        fetchMovieNewsList();
        fetchMovieRankList().then(() => setLoading(false));
        fetchmovielist().then(() => setLoading(false));
    }, []);
    
    useEffect(() => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (token) {
            setIsLoggedIn(true);
            setIsModalOpen(false);
        } else {
            openModal();
        }
    }, []);

    const handleSlideChange = ({ realIndex }) => {
        setActiveIndex(realIndex);
        const selectedMovie = movieRankList[realIndex];
        if (!selectedMovie || !selectedMovie.backgroundimagePath) {
        console.warn("Movie หรือ backgroundimagePath หาย:", selectedMovie);
        return;
    }
        console.log("หนังที่เลือก",selectedMovie);
        const backgroundImageArray = JSON.parse(selectedMovie.backgroundimagePath); // แปลงเป็น array
        const imageUrl = `http://localhost:8000/${backgroundImageArray[0]}`; // ดึงรูปแรกจาก array
        setBackgroundImage(imageUrl);

        const movieName = selectedMovie.title;
        setMovieName(movieName);
        setMovieRating(Number(selectedMovie.averageRating?.toFixed(1)) || 0);
        setReviewCount(selectedMovie.reviewCount);
        setMovieEngName(selectedMovie.engTitle);
        setMovieDate(formatThaiDate(selectedMovie.date));
    };

    return (
        <div className={styles.container}>
            {/* ปกด้านบน */}
            <div className={styles.carouselContainer}>
                <img src={backgroundImage} className={styles.coverImage}></img>
                <div className={styles.movieName}>
                    <div>
                        <p className={styles.movieName_title}>{movieName}</p>
                        <p className={styles.movieName_EngTitle}>{movieEngName}</p>
                        <p className={styles.movieName_Date}>{movieDate}</p>
                    </div>
                    <p className={styles.movieName_Rating}> คะแนนรีวิว : <span className={styles.movieName_Rating_Score}>{movieRating}</span> ({reviewCount})</p>
                </div>
                <motion.div
                        // className={styles.followed_list}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5 }}
                        viewport={{ once: true, amount: 1 }}
                >
                <div className={styles.coverCardSlideContainer}>
                    {!loading && ( 
                        <Swiper
                        className="mySwiper"
                        key="cover"
                        modules={[EffectCoverflow, Pagination]}
                        effect={"coverflow"}
                        centeredSlides={true}
                        grabCursor={true}
                        slidesPerView={5}
                        loop={true}
                        speed={800}
                        coverflowEffect={{
                            rotate: 0, // หมุนแกน Y
                            stretch: 20, // ขยายรูป
                            depth: 100, // ระยะห่างเชิงลึก
                            modifier: 2,
                            slideShadows: false, // ปิดเงา
                        }}
                        // pagination={true}
                        scrollbar={{ draggable: true }}
                        onSlideChange={handleSlideChange}
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 10 },  // หน้าจอเล็ก (มือถือ)
                            768: { slidesPerView: 2, spaceBetween: 15 },  // Tablet
                            1024: { slidesPerView: 3, spaceBetween: 20 }, 
                            1280: { slidesPerView: 4, spaceBetween: 26 }, // ค่าปกติที่ตั้งไว้
                            1900: { slidesPerView: 5, spaceBetween: 30 }, 
                        }}
                    >
                    {movieRankList.map((list, index) =>{
                        const imageUrl = `http://localhost:8000/${list.posterimagePath}`;
                        return (
                            <SwiperSlide 
                                key={list.id}  
                                className={classNames(styles.movieSlide, {
                                [styles.swiperSlideActive]: index === activeIndex, // Apply active class to current slide
                                })}
                            >       
                                    <div className={styles.movieList}>
                                    {index === activeIndex &&(
                                        <span className={styles.Container_Rank}>
                                                <img src={image3} className={styles.Container_Rank_Star}></img>
                                                <span className={styles.Container_Rank_Number}>
                                                    {list.rank}
                                                </span>
                                        </span>
                                            )}
                                        <img 
                                            src={imageUrl} 
                                            className={styles.Movie_Background}
                                        />
                                        <div className={classNames(styles.movieSelect, { [styles.active]: index === activeIndex })}>
                                        <div dangerouslySetInnerHTML={{ __html: list.title }} />
                                            {index === activeIndex && (
                                            <Link to={`/movieinfo/${list.id}`}>
                                                <button>อ่านรีวิว</button>
                                            </Link>
                                        )}
                                        </div>
                                    </div> 
                            </SwiperSlide>
                        )
                    })}
                        </Swiper>
                )}
                </div>
                </motion.div>
            </div>

            {/* ข่าว */}
            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeText}>
                    📢 พบกับรีวิวหนังใหม่ทุกวัน! 🎬 อัปเดตข่าวหนัง คะแนนรีวิว และอีกมากมายที่ THAIReview!
                </div>
            </div>
           <section className={styles.News}>
                <div className={styles.News_Container1}>
                    <div className={styles.News_Header}>ข่าวประจำวัน</div>
                </div>
                <div className={styles.News_Container2}>
                    <div className={styles.News_Container2_Courasel}>
                        <Swiper key={"movieNews"}
                            modules={[Navigation, Scrollbar, A11y]}
                            spaceBetween={26}
                            slidesPerView={1}
                            navigation
                            loop={true}
                            autoplay={{ 
                                delay: 3000, // หน่วงเวลา (3 วินาที)
                                disableOnInteraction: false, // ให้เลื่อนต่อ แม้มีการโต้ตอบ
                            }}
                            // breakpoints={{
                            //     320: { slidesPerView: 1, spaceBetween: 10 },  // หน้าจอเล็ก (มือถือ)
                            //     768: { slidesPerView: 2, spaceBetween: 15 },  // Tablet
                            //     1024: { slidesPerView: 3, spaceBetween: 20 }, 
                            //     1280: { slidesPerView: 4, spaceBetween: 26 }, // ค่าปกติที่ตั้งไว้
                            //     1900: { slidesPerView: 5, spaceBetween: 30 }, 
                            // }}
                        >
                            {movieNewsList.map((list) =>{
                                const imageUrl = `http://localhost:8000/${list.newsimagePath}`;
                                return (
                                <SwiperSlide key={list.id} className={styles.News_SwiperSlide}>
                                        <div className={styles.slide_container}>
                                            <img src={imageUrl} className={styles.slide_image}></img>
                                            <div className={styles.slide_overlay}></div>
                                            <div className={styles.slide_text}>{list.title}</div>
                                        </div>
                                </SwiperSlide>
                                )
                                }
                            )}
                        </Swiper>

                    </div>
                    <div className={styles.News_Container2_Other}>
                        <div  className={styles.slide_othercontainer}>
                            <div className={styles.slide_overlay}></div>
                            <img src={image} className={styles.slide_otherimage}/>
                        </div>
                        <div  className={styles.slide_othercontainer}>
                            <div className={styles.slide_overlay}></div>
                            <img src={image2} className={styles.slide_otherimage}/>
                        </div>
                    </div>
                </div>
            </section>

            {/* หนังโรง */}
            <div className={styles.Movie}>
                <div className={styles.Movie_Header}>กำลังฉายในโรงภาพยนต์</div>
                    <button className={styles.Movie_Button}>
                        <Link to={`/newmovie`}>
                        ดูเพิ่มเติม&nbsp;&nbsp;
                        <span>
                            <FontAwesomeIcon icon={faArrowRight}/>
                        </span>
                        </Link>
                    </button>
            </div>

            <div className={styles.Movie_Container}>
                {!loading && (
                    <Swiper
                        // install Swiper modules
                        key={"now-showing"}
                        modules={[Navigation, Scrollbar, A11y, Autoplay]}
                        spaceBetween={26}
                        slidesPerView={6}
                        navigation
                        loop={true}
                        scrollbar={{ draggable: true }}
                        autoplay={{ 
                            delay: 3000, // หน่วงเวลา (3 วินาที)
                            disableOnInteraction: false, // ให้เลื่อนต่อ แม้มีการโต้ตอบ
                        }}
                        observer={true}         // ✅ ให้ Swiper อัปเดตเมื่อ DOM เปลี่ยนแปลง
                        observeParents={true}   // ✅ ให้ตรวจสอบ DOM ระดับพ่อแม่ด้วย
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 10 },  // หน้าจอเล็ก (มือถือ)
                            768: { slidesPerView: 2, spaceBetween: 15 },  // Tablet
                            1024: { slidesPerView: 2.5, spaceBetween: 20 }, 
                            1280: { slidesPerView: 5, spaceBetween: 35 }, // ค่าปกติที่ตั้งไว้
                            1900: { slidesPerView: 6, spaceBetween: 30 }, 
                        }}
                    >
                        
                        {newMovieList.map((list, index) =>{
                        let movielangArr = [];
                        try {
                            movielangArr = list.lang ? JSON.parse(list.lang) : [];
                            console.log(movielangArr);
                        } catch (error) {
                            console.error("Error parsing lang:", error);
                        }
                            return (
                            <SwiperSlide key={list.id} className={styles.SwiperSlide}>
                                <Link to={`/movieinfo/${list.id}`}>
                                    <Movieposter 
                                        moviename={list.title} 
                                        moviepic={list.posterimagePath} 
                                        moviedate={list.date}
                                        movieage={list.age}
                                        movielang={movielangArr}
                                    />
                                </Link>
                            </SwiperSlide>
                            )
                        })}
                    </Swiper>
                )}
            </div>
                
            {/* หนังเก่า */}
            <div className={styles.Movie}>
                <div className={styles.Movie_Header}>หนังเก่านอกโรงภาพยนต์ <span className={styles.emoji}>🎞</span></div>
                <button className={styles.Movie_Button}>
                    <Link to={`/oldmovie`}>
                    ดูเพิ่มเติม&nbsp;&nbsp;
                    <span>
                        <FontAwesomeIcon icon={faArrowRight}/>
                    </span>
                    </Link>
                </button>
            </div>
            
            <div className={styles.Movie_Container}>
                {!loading && (
                    <Swiper
                        // install Swiper modules
                        key={"old-movies"}
                        modules={[Navigation, Scrollbar, A11y, Autoplay]}
                        spaceBetween={26}
                        slidesPerView={5}
                        navigation
                        loop={true}
                        scrollbar={{ draggable: true }}
                        autoplay={{ 
                            delay: 3000, // หน่วงเวลา (3 วินาที)
                            disableOnInteraction: false, // ให้เลื่อนต่อ แม้มีการโต้ตอบ
                        }}
                        observer={true}         // ✅ ให้ Swiper อัปเดตเมื่อ DOM เปลี่ยนแปลง
                        observeParents={true}   // ✅ ให้ตรวจสอบ DOM ระดับพ่อแม่ด้วย
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 10 },  // หน้าจอเล็ก (มือถือ)
                            768: { slidesPerView: 2, spaceBetween: 15 },  // Tablet
                            1024: { slidesPerView: 2.5, spaceBetween: 20 }, 
                            1280: { slidesPerView: 5, spaceBetween: 26 }, // ค่าปกติที่ตั้งไว้
                            1900: { slidesPerView: 6, spaceBetween: 30 }, 
                        }}
                    >
                        {oldMovieList.map((list, index) =>{
                        let movielangArr = [];
                        try {
                            movielangArr = list.lang ? JSON.parse(list.lang) : [];
                            console.log(movielangArr);
                        } catch (error) {
                            console.error("Error parsing lang:", error);
                        }
                            return (
                            <SwiperSlide key={list.id} className={styles.SwiperSlide}>
                                <Link to={`/movieinfo/${list.id}`}>
                                    <Movieposter 
                                        moviename={list.title} 
                                        moviepic={list.posterimagePath} 
                                        moviedate={list.date}
                                        movieage={list.age}
                                        movielang={movielangArr}
                                    />
                                </Link>
                            </SwiperSlide>
                            )
                        })}
                    </Swiper>
                )}
            </div>

            {/* ผู้คนที่ฉันติดตาม */}
            <div className={styles.followed_Header}>คนที่คุณกำลังติดตาม</div>
            <div className={styles.followed}>
                <div className={styles.followed_list}>
                    <div className={styles.followed_list_Pic}></div>
                    <div className={styles.followed_list_Name}>Jan Doe</div>
                    <div className={styles.followed_ist_movieName}>พี่มากพระขโนง</div>
                    <div className={styles.followed_Date}>23/09/67 20.11 น.</div>
                    <div className={styles.followed_Comment}>A restless king promises his lands to the local tribals in exchange of a stone (Panjurli, a deity of Keradi Village) wherein he finds solace and peace of mind.</div>
                </div>
                <div></div>
            </div>

            {/* About Us */}
            <About/>
            <Footer/>
        </div>
    )
}

export default HomePage;
