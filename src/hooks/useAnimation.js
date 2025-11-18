import { animationVariants, easingFunctions } from '@/utils/animation';
import { useMemo } from 'react';

export const useAnimation = ({
  animation = 'fade',
  duration = 0.5,
  delay = 0,
  easing = 'ease-out',
}) => {
  const variant = animationVariants[animation] || animationVariants.fade;
  const transition = {
    duration,
    delay,
    ease: easingFunctions[easing] || easingFunctions['ease-out'],
  };

  return useMemo(
    () => ({
      initial: 'hidden',
      animate: 'visible',
      exit: 'hidden',
      variants: variant,
      transition,
    }),
    [variant, transition]
  );
};
