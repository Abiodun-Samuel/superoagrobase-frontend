import { useAnimation } from "@/hooks/useAnimation";
import { motion } from "framer-motion";

const Animation = ({ children, animation, duration, delay, easing, className = "", ...props }) => {
    const motionProps = useAnimation({ animation, duration, delay, easing });

    return (
        <motion.div className={className} {...motionProps} {...props}>
            {children}
        </motion.div>
    );
};

export default Animation;