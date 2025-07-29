import { motion } from "framer-motion";
import { useState } from "react";

const InteractiveLogo = ({ src }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 30; // map เป็นองศา
    const y = ((e.clientY - top) / height - 0.5) * 30;
    setRotate({ x: -y, y: x });
  };

  return (
    <motion.img
      src={src}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.1 }}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y
      }}
      transition={{ type: "spring", stiffness: 100 }}
      style={{ perspective: 1000 }}
    />
  );
};

export default InteractiveLogo;