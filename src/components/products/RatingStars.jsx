import { Star, StarHalf } from "lucide-react";

export default function RatingStars({ ratings }) {
  const normalized = Math.round(ratings * 2) / 2;

  return (
    <>
      <div className="flex items-center" aria-label={`Rating: ${ratings} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => {
          const index = i + 1;

          const isFull = index <= normalized;
          const isHalf = !isFull && index - 0.5 <= normalized;

          if (isFull) {
            return (
              <Star
                key={i}
                className="w-4 h-4 text-yellow-400 fill-yellow-400"
              />
            );
          }

          if (isHalf) {
            return (
              <StarHalf
                key={i}
                className="w-4 h-4 text-yellow-400 fill-yellow-400"
              />
            );
          }

          return <Star key={i} className="w-4 h-4 text-gray-300" />;
        })}
      </div>
      <span className="text-sm text-gray-600">({ratings || 0})</span>
    </>
  );
}
