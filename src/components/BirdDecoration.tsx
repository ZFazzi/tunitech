
import { AnimatedBird } from "./AnimatedBird";
import { motion } from "framer-motion";

interface BirdDecorationProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  variant?: "flying" | "floating" | "perched";
}

export const BirdDecoration = ({ 
  position = "top-right", 
  variant = "floating" 
}: BirdDecorationProps) => {
  const positionClasses = {
    "top-left": "absolute top-4 left-4 z-10",
    "top-right": "absolute top-4 right-4 z-10", 
    "bottom-left": "absolute bottom-4 left-4 z-10",
    "bottom-right": "absolute bottom-4 right-4 z-10",
    "center": "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
  };

  return (
    <motion.div
      className={positionClasses[position]}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <AnimatedBird variant={variant} size="md" color="#4CD6B3" />
    </motion.div>
  );
};
