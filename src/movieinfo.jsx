import React, {useEffect, useState} from "react";
import "./movieinfo.scss"
import Movieactor from "./component/movieinfo-actor";
import CommentCard from "./Comment";
import _ from "lodash";
import axios from "./config/axios";

function Movieinfo() {
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const [text, textUpdate] = useState("");
    const [comment, setComment] = useState([]);
    const [movie, setMovie] = useState([]);
    
    const fetchMovie = async() => {
        try {
            const httpResponse = await axios.get("/movie");
            setMovie(httpResponse.data);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };
    
    const fetchComment = async () => {
        try {
            const httpResponse = await axios.get("/comment");
            setComment(httpResponse.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    useEffect(() => {
        fetchComment();
        fetchMovie();
    },[]);
    
    const addPlaylist = async () => {
        try {
            await axios.post("/comment/addcomment", {
                commentDate: 53,
                commentText: text,
                ratingscore: 5,
                MovieId: 3
            });
            fetchComment();
        } catch (error) {
            console.error("Error adding comment:", error);
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

    return (
        <div>
            <div className='coverImage'>
                <img src="image/fanday.jpg" alt='fanday'/>
            </div>
            <div className="movieinfo">
                <div className="movieinfo-name">
                    <div>แฟนเดย์</div><div>แฟนกันแค่วันเดียว</div>
                </div>
                <div>
                    <span className="movieinfo-logo"><span>THAI</span>REVIEW</span><span>8.2 (12.0)</span><span>2021</span><span>1 hour 55 minutes</span><span>Sci-fi</span>
                </div>
                <div className="movieinfo-btn">
                    <span className="btn"><button className="btn-watchTrailer">Watch trailer</button></span>
                    <button className="btn-watchNow"><i class="fa-solid fa-play"></i>Watch now</button>
                </div>
            </div>
            <div>
                <div className="movieinfo-story">
                    <div className="movieinfo-story-header">เรื่องย่อ</div>
                    <div className="movieinfo-story-detail">" <span className='highlight'>เด่นชัย' (เต๋อ-ฉันทวิชช์ ธนะเสวี) </span>เจ้าหน้าที่ไอทีสุดเนิร์ดประจำออฟฟิศ วัย 30 ผู้จะมีตัวตนในสายตาพนักงานคนอื่นแค่เวลาอุปกรณ์คอมพิวเตอร์เสีย ในชั่วโมงทำงานที่แสนเร่งรีบไม่มีใครสนใจแม้แต่จะจำชื่อของเด่นชัยจาเขาแอบน้อยใจอยู่บ่อยๆ จนกระทั่งวันที่เขาได้ไปซ่อมปรินเตอร์
    ให้ <span className='highlight'>'นุ้ย' (มิว-นิษฐา จิรยั่งยืน) </span>มาร์เก็ตติ้งสาวคนสวยผู้จดจำชื่อจริงของเขาได้เด่นชัยตกหลุมรักความน่ารักและจริงใจของนุ้ยที่ทำให้เขารู้สึกเหมือน
มีตัวตนขึ้นมา แต่ก็ทำได้เพียงเฝ้าเก็บรายละเอียดและดูแลเธออยู่ห่างๆ เพราะรู้ดีว่าหมาอย่างเขาคงได้แค่แหงนมองเครื่องบิน แต่แล้ว เมื่อบริษัทของเด่นชัยพาพนักงานไปเที่ยวเอาท์ติ้งยังสกีรีสอร์ทที่ฮอกไกโด เด่นชัยได้ขอพรกับระฆังแห่งความรักของรีสอร์ทให้เขาได้เป็นแฟนกับนุ้ย
แค่วันเดียวก็ยังดี โชคชะตาเล่นตลกเมื่อนุ้ยประสบอุบัติเหตุจากสกีจนหมดสติ พอนุ้ยฟื้นก็กลับมีอาการโรคความจำเสื่อมชั่วคราว ที่เรียกกันว่าโรค TGA ซึ่งเป็นโรคความจำเสื่อมที่จะมีอาการอยู่แค่เพียง 1 วันเท่านั้น
เด่นชัยคิดว่านี่เป็นโฮกาสเดียวที่คนอย่างเขาจะได้ใกล้ชิดกับนุ้ย เขาตัดสินใจสวมรอยหลอกนุ้ยว่าทั้งสองเป็นแฟนกันและอยู่เที่ยวต่อกันเพียงสองคน เด่นชัยตั้งใจว่าจะพานุ้ยไปเที่ยวในทุกๆที่ ที่เธออยากไปในฮอกไกโด ใช้เวลาสุดพิเศษของเขากับเธอในฐานะแฟน แม้ว่ามันจะ <span className='highlight'>เป็นการเป็นแฟนกันเพียงวันเดียว</span> ก็ตาม "</div>
                </div>
            </div>
            <div>
                <div className="movieinfo-actor">
                    <div className="movieinfo-actor-header">นักแสดงนำ</div>
                    <div className="movieinfo-actor-pic">
                        <Movieactor actorpic={"1"} actorname={"ฉันทวิชช์ ธนะเสวี (เต๋อ)"}/>
                        <Movieactor actorpic={"1"} actorname={"ฉันทวิชช์ ธนะเสวี (เต๋อ)"}/>
                        <Movieactor actorpic={"1"} actorname={"ฉันทวิชช์ ธนะเสวี (เต๋อ)"}/>
                    </div>
                </div>
            </div>
            <div className="movieinfo-container">
                <div className="movieinfo-review">
                    <div className="movieinfo-review-header">
                        <h1>Reviews</h1>
                        <button onClick={togglePopup}>+ Add Your Review</button>
                    </div>
                    {isOpen && (
                    <div className="popup-overlay" onClick={togglePopup}>
                        <div className="popup-content" onClick={e => e.stopPropagation()}>
                            <div>ชื่อ</div>
                            <input type="text" value={text} onChange={(e)=> textUpdate(e.target.value)}></input>
                            <button onClick={()=> {
                                addPlaylist()
                                textUpdate("") 
                                togglePopup();
                            }}> รีวิว</button>
                            <button onClick={togglePopup}>ยกเลิก</button>
                        </div>
                    </div>
                    )}
                    <div className="movieinfo-review-box">
                        <div>
                            {/* {comment.map((list => <div>{list.detail} <button onClick={() => deletePlaylist(list.id)}>ลบ</button></div>))} */}
                            {comment.map((list => 
                                <div className="movieinfo-review-comment">
                                        <div className="movieinfo-review-comment-info">
                                            <div>
                                                <div className="movieinfo-review-comment-box">
                                                    <div className="movieinfo-review-comment-pic">1</div>
                                                    <div className="movieinfo-review-comment-name">ชื่อ</div>
                                                </div>
                                                <div>25/09/67 20.30 น.</div>
                                            </div>
                                            <div>
                                            <div className="star-rating">
                                                <div className="star-background">
                                                    {'★'.repeat(5)} {/* ดาวเงาที่เป็นพื้นหลัง */}
                                                </div>
                                                <div className="star-foreground" style={{ width: `${(4.5 / 5) * 100}%` }}>
                                                    {'★'.repeat(5)} {/* ดาวเต็มที่จะปรากฏตามคะแนน */}
                                                </div>
                                            </div>
                                            <span className="rating">4.5</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div>{list.commentText}</div>
                                            <button onClick={() => deletePlaylist(list.id)}>ลบ</button>
                                        </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <CommentCard 
                                avatar="https://example.com/avatar.jpg" 
                                name="John Doe" 
                                date="25/09/67" 
                                time="13.30" 
                                commentText="This movie was recommended to me by a very dear friend who went for the movie by herself. I went to the cinemas to watch but had a houseful board so couldn’t watch it."
                                rating={4.5}
                            />
                        </div>
                    </div>
                    <div>
                        footer
                    </div>
                </div>
                <div className="movieinfo-data">
                    <div>Release year</div>
                </div>
            </div>
        </div>
    )
}

export default Movieinfo;