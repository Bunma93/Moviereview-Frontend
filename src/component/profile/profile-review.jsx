import React from "react";
import styles from "../profile/profile-review.module.scss";
import { Popconfirm } from 'antd';

function formatThaiDate(dateString) {
    const months = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    const dateObj = new Date(dateString);
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear() + 543;
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} - ${hours}:${minutes} น.`;
}

function Review({name, ratingScore, commentText, commentDate, onEdit, handleDelete}) {
    return (
        <div>
            <div className={styles.profile_review_box}>
                <div className={styles.profile_review_box_header}>
                    <div className={styles.profile_review_box_header_name}>{name}</div>
                    <div className={styles.comment_rating}>
                        <div className={styles.star_border}>
                            <div className={styles.star_rating}>
                                <div className={styles.star_background}>
                                    {'★'.repeat(5)} {/* ดาวเงาที่เป็นพื้นหลัง */}
                                </div>
                                <div className={styles.star_foreground} style={{ width: `${(ratingScore / 5) * 100}%` }}>
                                    {'★'.repeat(5)} {/* ดาวเต็มที่จะปรากฏตามคะแนน */}
                                </div>
                            </div>
                            <span className={styles.rating}>{ratingScore}</span>
                        </div>
                    </div>
                </div>
                <div className={styles.profile_review_box_date}>
                    <div>{formatThaiDate(commentDate)}</div>
                </div>
                <div className={styles.profile_review_box_massage}>
                    <div>{commentText}</div>
                </div>
                <div className={styles.profile_review_box_edit}>
                    <button className={styles.editButton} onClick={onEdit}>แก้ไข</button>
                    <Popconfirm
                        title="คุณแน่ใจหรือไม่ว่าต้องการลบรีวิวนี้?"
                        onConfirm={handleDelete}
                        okText="ใช่"
                        cancelText="ยกเลิก"
                    >
                        <button className={styles.deleteButton}>ลบ</button>
                    </Popconfirm>
                </div>
            </div>
        </div>
    )
}

export default Review;