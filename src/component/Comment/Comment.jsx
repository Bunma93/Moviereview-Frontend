import React, {useState} from 'react';
import styles from '../Comment/Comment.module.scss';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Popconfirm } from 'antd';
import axios from '../../config/axios';

function formatThaiDate(dateString) {
  const dateObj = new Date(dateString);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth()).padStart(2, "0");
  const year = String(dateObj.getFullYear()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const sec = String(dateObj.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${minutes}:${sec}`
}

function CommentCard({ avatar, name, date, time, commentText, rating, userInfo, handleDeleteComment, commentId }) {
  return (
    <div className={styles.comment_card}>
       {userInfo?.role === 'admin' &&
        <div className={styles.comment_delete}>
          <Popconfirm
            title="คุณแน่ใจว่าต้องการลบคอมเม้น"
            onConfirm={() => handleDeleteComment(commentId)}
            okText="ใช่"
            cancelText="ยกเลิก"
          >
            <button>ลบ</button>
          </Popconfirm>
        </div>
      }
      <div className={styles.comment_header}>
        <Avatar className={styles.avatar} src={avatar} alt={name} icon={<UserOutlined />}/>
        <div className={styles.comment_info}>
          <div className={styles.comment_name}>{name}</div>
          <div className={styles.comment_date}>{formatThaiDate(date)}</div>
        </div>
        <div className={styles.comment_rating}>
          <div className={styles.star_rating}>
              <div className={styles.star_background}>
                  {'★'.repeat(5)} {/* ดาวเงาที่เป็นพื้นหลัง */}
              </div>
              <div className={styles.star_foreground} style={{ width: `${(rating / 5) * 100}%` }}>
                  {'★'.repeat(5)} {/* ดาวเต็มที่จะปรากฏตามคะแนน */}
              </div>
          </div>
            <span className={styles.rating}>{rating}</span>
        </div>
      </div>
      <div className={styles.comment_body}>
         {typeof commentText === 'string' ? <p>{commentText}</p> : commentText}
      </div>
    </div>
  );
}

export default CommentCard;