import React from "react";
import styles from '../About/About.module.scss';
import Logo from '../images/Logo.png';
import HoverCharacterEffect from "../HoverCharacterEffect";
import { motion } from "motion/react"
import InteractiveLogo from "../InteractivePicture";

function About() {
    return (
    <div className={styles.container}>
        <div className={styles.about}>
                <HoverCharacterEffect text="About us" className={styles.header}/>
                {/* <div className={styles.header}>About us</div> */}
                <div className={styles.year}><i>2567-2568n</i></div>
                <div className={styles.text}>โปรเจคนี้ เกี่ยวข้องกับเว็บไซต์สำหรับรีวิวภาพยนต์ ที่สร้างมาเพื่อคอมมูนิตี้คนชอบภาพยนต์ไทย ให้มีพื้นที่สำหรับการแสดงความคิดเห็นเกี่ยวกับภาพยนต์และซีรี่ย์ไทย และช่วยกันในการขับเคลื่อนวงการภาพยนต์ไทยต่อไป</div>
        </div>
        <div>
            <motion.img 
                src={Logo} 
                className={styles.Logo}
                whileHover={{
                    rotateY: 360,
                    scale: 1.2
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
            />
        </div>
    </div>
)};

export default About;