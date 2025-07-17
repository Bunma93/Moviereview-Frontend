import React, { useEffect , useState} from "react";
import styles from '../UserPlaylist/UserPlaylistForm.module.scss'
import { Divider, Input,  message, Button } from "antd";
import axios from "../../config/axios"
import MoviePoster from '../../component/movieposter/movieposter';
const { Search } = Input;

function UserPlaylistForm({userPic, userName, toggleModal, initialPlaylist}) {
   const [movieList, setMovieList] = useState([]);
   const [searchText, setSearchText] = useState("");
   const [selectedMovies, setSelectedMovies] = useState([]);
   const [playlistName, setPlaylistName] = useState("");

   const filteredMovies = movieList.filter((movie) =>
    movie.title.toLowerCase().includes(searchText.toLowerCase())
    );

    const toggleSelectMovie = (movieId) => {
        setSelectedMovies((prevSelected) =>
            prevSelected.includes(movieId)
              ? prevSelected.filter((id) => id !== movieId) // เอาออก
              : [...prevSelected, movieId] // เพิ่มเข้า
          );
    }

    const selectedMovieList = movieList.filter((movie) =>
        selectedMovies.includes(movie.id)
      );

    useEffect(() => {
        const fetchMovie = async() => {
            try {
                const res = await axios.get("/movie/");
                console.log("ข้อมูลที่ได้มา", res.data);
                setMovieList(res.data)  

                if (initialPlaylist) {
                setPlaylistName(initialPlaylist.playlistName || "");

                // ดึง ID หนังจาก Movies[]
                const movieIds = initialPlaylist.Movies.map((movie) => movie.id);
                setSelectedMovies(movieIds);
                }
            } catch (error) {
                console.log("พบข้อผิดพลาดในการดึงข้อมูลหนัง", error)
            };
        };
        fetchMovie();
    },[initialPlaylist]);

    useEffect(() => {
        if (selectedMovies.length > 0) {
          console.log(`🎉 คุณเลือกหนัง ${selectedMovies.length} เรื่องแล้ว`);
        } else {
          console.log("❌ ยังไม่มีหนังที่ถูกเลือก");
        }
      }, [selectedMovies]);
    
    const handleSubmit = async () => {
        if (!playlistName || selectedMovies.length === 0) {
            message.error("กรุณากรอกชื่อเพลลิสต์และเลือกหนังอย่างน้อย 1 เรื่อง");
            return;
        }

        try {
            if (initialPlaylist) {
                await axios.put(`/playlist/update/${initialPlaylist.id}` ,{
                    playlistName,
                    MovieIds: selectedMovies,
            });
            message.success("อัปเดตเพลลิสต์สำเร็จ");
            toggleModal();
            } else {
                await axios.post("/playlist/create", {
                    playlistName,
                    MovieIds: selectedMovies,
                });
            message.success("สร้างเพลลิสต์สำเร็จ");
            };
            
            toggleModal();
            setPlaylistName("");
            setSelectedMovies([]);

        } catch(err) {
            console.error("เกิดข้อผิดพลาด:", err);
            message.error("สร้างเพลลิสต์ไม่สำเร็จ");
        }
    }

    const timestamp = Date.now();
    const date = new Date(timestamp);

    const formatted = date.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    });

    return (
        <div className={styles.modal_overlay} onClick={toggleModal}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <div className={styles.createPlaylist}>
                    <div className={styles.userProfile}>
                        <span className={styles.userProfile_container}>
                            <img src={userPic} className={styles.userProfile_Pic}></img>
                        </span>
                        <div className={styles.userProfile_Name}>{userName}</div>  
                    </div>
                    <div className={styles.playlistName}>
                        <div className={styles.playlistName_Header}>
                            ชื่อเพลลิสต์ :
                        </div>
                        <div className={styles.playlistName_Name}>
                            <input
                                type="text"
                                value={playlistName}
                                onChange={(e) => setPlaylistName(e.target.value)}
                                placeholder="กรอกชื่อเพลลิสต์ที่นี่"
                                className={styles.inputPlaylistName}
                                rules={[{ required: true, message: 'กรุณากรอกชื่อเพลลิสต์' }]}
                            />
                        </div>
                    </div>
                    <div className={styles.date}>
                        {formatted}
                    </div>
                    <div className={styles.selectedContainer}>
                        <h3>ภาพยนต์ที่คุณเลือกจำนวน <span className={styles.countMovies}> {selectedMovies.length} </span> เรื่อง</h3>
                        <div className={styles.movieContainer}>
                            {selectedMovieList.map((list) => {
                                let movielangArr = [];
                                try {
                                    movielangArr = list.lang ? JSON.parse(list.lang) : [];
                                    console.log(movielangArr);
                                } catch (error) {
                                    console.error("Error parsing lang:", error);
                                }
                                return (
                                    <MoviePoster
                                    key={list.id}
                                    moviename={list.title} 
                                    moviepic={list.posterimagePath} 
                                    moviedate={list.date}
                                    movieage={list.age}
                                    movielang={movielangArr}
                                    className={styles.movieCard}
                                    onClick={() => toggleSelectMovie(list.id)}
                                    />
                                )}
                            )}
                        </div>
                    </div>
                    <div className={styles.submitPlaylist_container}>
                        <button className={styles.submitPlaylist} onClick={handleSubmit}>สร้างเพลลิสต์</button>
                    </div>

                    <Divider />
                        <Search
                            placeholder="ค้นหาชื่อหนัง..."
                            allowClear
                            size="large"
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ marginBottom: "20px", maxWidth: "400px" }}
                            className={styles.movieSearch}
                            enterButton={
                                <Button
                                type="primary"
                                style={{
                                    backgroundColor: '#AB0A10', // ✅ สีพื้นหลังปุ่ม
                                    borderColor: '#AB0A10',
                                    margin: 0
                                }}
                                >
                                    ค้นหา
                                </Button>
                            }
                        />
                        <div className={styles.movieContainer}>
                            {filteredMovies.map((list) => {
                                let movielangArr = [];
                                try {
                                    movielangArr = list.lang ? JSON.parse(list.lang) : [];
                                    console.log(movielangArr);
                                } catch (error) {
                                    console.error("Error parsing lang:", error);
                                }
                                return (
                                    <MoviePoster
                                    key={list.id}
                                    moviename={list.title} 
                                    moviepic={list.posterimagePath} 
                                    moviedate={list.date}
                                    movieage={list.age}
                                    movielang={movielangArr}
                                    onClick={() => toggleSelectMovie(list.id)}
                                    className={`${styles.movieCard} ${
                                    selectedMovies.includes(list.id) ? styles.selected : ""
                                    }`}
                                    />
                                )
                            }
                            
                            )}
                        </div>
                </div>
                <div>

                </div>
            </div>
        </div>
)}

export default UserPlaylistForm;