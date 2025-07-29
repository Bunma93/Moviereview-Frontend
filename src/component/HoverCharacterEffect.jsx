import { motion } from "motion/react"
import { useState } from "react";

const HoverCharacterEffect = ({ text, className, color}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <span className={className} style={{ display: "inline-block" ,whiteSpace: "pre-wrap"}}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          style={{
            display: "inline-block",
            marginRight: "1px"
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          animate={hoveredIndex === index ? { y: -8, scale: 1.3, color: "#000000ff" } : { y: 0, scale: 1, color: color }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

export default HoverCharacterEffect;