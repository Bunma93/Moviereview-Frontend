import React from 'react';
import styles from '../Comment/Comment.module.scss'

function CommentCard({ avatar, name, date, time, commentText, rating }) {
  return (
    <div className={styles.comment_card}>
      <div className={styles.comment_header}>
        <img className={styles.avatar} src={avatar} alt={name} />
        <div className={styles.comment_info}>
          <div className={styles.comment_name}>{name}</div>
          <div className={styles.comment_date}>{`${date} ${time} น.`}</div>
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
        <p>{commentText}</p>
      </div>
    </div>
  );
}

export default CommentCard;