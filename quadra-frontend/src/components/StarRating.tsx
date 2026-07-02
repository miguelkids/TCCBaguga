import { Star } from "lucide-react";

export function StarRating({ value, size = "sm" }: { value: number; size?: "sm" | "md" }) {
  const px = size === "md" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.floor(value);
        const half = !filled && i - 0.5 <= value;
        return (
          <span key={i} className="relative inline-flex">
            {/* Star base (empty) */}
            <Star className={`${px} text-border`} strokeWidth={1.5} />
            {/* Fill overlay */}
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? "100%" : "50%" }}
              >
                <Star
                  className={`${px} fill-clay text-clay`}
                  strokeWidth={1.5}
                />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
