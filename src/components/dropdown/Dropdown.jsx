import { useEffect, useRef } from "react";
import Animated from "../../common/Animated";

export const Dropdown = ({
  isOpen,
  onClose,
  children,
  className = "",
  animation = 'fade-up',
  duration = 0.5,
  easing = 'ease',
  direction = 'left'
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !(event.target).closest(".dropdown-toggle")
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <Animated duration={duration} animation={animation} easing={easing}
      ref={dropdownRef}
      className={`absolute z-10 ${direction == 'right' ? 'left-0 top-7' : 'right-0'}  mt-2  rounded-xl border border-gray-200 bg-white  shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark ${className}`}
    >
      {children}
    </Animated>
  );
};
