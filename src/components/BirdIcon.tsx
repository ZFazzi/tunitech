
import { motion } from "framer-motion";

interface BirdIconProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "static" | "hover" | "float" | "pulse";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6", 
  lg: "w-8 h-8",
  xl: "w-12 h-12"
};

export const BirdIcon = ({ size = "md", variant = "static", className = "" }: BirdIconProps) => {
  const baseClasses = `${sizeClasses[size]} ${className}`;

  const animations = {
    static: {},
    hover: {
      whileHover: { scale: 1.1, rotate: 5 },
      transition: { duration: 0.2 }
    },
    float: {
      animate: { y: [-2, 2, -2] },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    pulse: {
      animate: { scale: [1, 1.05, 1] },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <motion.div
      className={baseClasses}
      {...animations[variant]}
    >
      <img 
        src="/lovable-uploads/177cc9fc-7331-4d16-86ae-60a74898919c.png"
        alt="TuniTech Bird"
        className="w-full h-full object-contain"
      />
    </motion.div>
  );
};
