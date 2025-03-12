import React, { useEffect, useRef } from "react";
import styles from '../component/movieposter.module.scss'

function Movieposter({moviename, moviepic, moviedate, movieage, movielang}) {
    console.log("moviepic:", moviepic);
    console.log("movielang", movielang)
    const imageUrl = moviepic ? `http://localhost:8000/${moviepic}` : "";

    console.log("Image URL:", imageUrl); // ตรวจสอบ URL ของภาพ

    const date = new Date(moviedate);
    const formattedDate = isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('th-TH', {
        month: 'long',
        day: '2-digit',
    }).format(date);

    const movielangArr = Array.isArray(movielang) ? movielang : []; // ถ้าไม่ใช่ array จะกำหนดเป็น array ว่าง
    return (
        <div>
            <div className={styles.Movie_List}>
            <img 
                src={imageUrl} 
                alt="Movie Poster" 
                className={styles.Movie_Background}
            />
                <div className={styles.Movie_List_Name}>{moviename}</div>
                <div className={styles.Movie_List_Date}>{formattedDate}</div>
                <div className={styles.Movie_List_Age}>{movieage}</div>
                <div className={styles.Movie_List_Lang}>
                {movielangArr.length > 0 ? (
                        movielangArr.map((item, index) => (
                            <div key={index}>{item}</div>
                        ))
                    ) : (
                        <div>No languages available</div> // แสดงข้อความหากไม่มีภาษาหรือไม่ใช่ array
                    )}
                </div>
            </div>
        </div>
    )
}

export default Movieposter;