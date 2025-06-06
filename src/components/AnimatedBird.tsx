
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface AnimatedBirdProps {
  variant?: "flying" | "floating" | "perched";
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export const AnimatedBird = ({ 
  variant = "floating", 
  size = "md", 
  color = "#4CD6B3",
  className = "" 
}: AnimatedBirdProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const flyingAnimation = {
    x: [0, window.innerWidth + 100],
    y: [0, -20, 0, -30, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      repeatDelay: 5,
      ease: "easeInOut"
    }
  };

  const floatingAnimation = {
    y: [-5, 5, -5],
    rotate: [-2, 2, -2],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const perchodAnimation = {
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const getAnimation = () => {
    switch (variant) {
      case "flying":
        return flyingAnimation;
      case "floating":
        return floatingAnimation;
      case "perched":
        return perchodAnimation;
      default:
        return floatingAnimation;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isVisible ? { opacity: 1, scale: 1, ...getAnimation() } : {}}
      className={`${sizeClasses[size]} ${className} relative`}
    >
      {/* Fågel SVG med flaxande vingar */}
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Kropp */}
        <motion.ellipse
          cx="12"
          cy="14"
          rx="4"
          ry="6"
          fill={color}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Huvud */}
        <motion.circle
          cx="12"
          cy="8"
          r="3"
          fill={color}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
        />
        
        {/* Vänster vinge */}
        <motion.path
          d="M8 12 L4 8 L6 14 Z"
          fill={color}
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -15, 0, 15, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ transformOrigin: "8px 12px" }}
        />
        
        {/* Höger vinge */}
        <motion.path
          d="M16 12 L20 8 L18 14 Z"
          fill={color}
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 15, 0, -15, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ transformOrigin: "16px 12px" }}
        />
        
        {/* Näbb */}
        <motion.triangle
          points="12,6 10,7 12,8"
          fill="#FFA500"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Öga */}
        <circle cx="11" cy="7" r="0.8" fill="white" />
        <circle cx="11" cy="7" r="0.4" fill="black" />
        
        {/* Stjärt */}
        <motion.path
          d="M12 20 L10 22 L14 22 Z"
          fill={color}
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: "12px 20px" }}
        />
      </motion.svg>
      
      {/* Glitter effekt runt fågeln */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-tunitech-mint rounded-full"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${10 + (i * 10)}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};
