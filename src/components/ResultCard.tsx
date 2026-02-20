"use client";

interface ResultCardProps {
  result: {
    id: number;
    name: string;
    goodness: number;
  };
}

export default function ResultCard({ result }: ResultCardProps) {
  const { name, goodness } = result;

  // Color based on goodness score
  const getScoreColor = (score: number) => {
    if (score >= 4.0) return "text-green-400 bg-green-400/10 border-green-400/30";
    if (score >= 3.0) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
    if (score >= 2.0) return "text-orange-400 bg-orange-400/10 border-orange-400/30";
    return "text-red-400 bg-red-400/10 border-red-400/30";
  };

  const getEmoji = (score: number) => {
    if (score >= 4.5) return "🏆";
    if (score >= 4.0) return "⭐";
    if (score >= 3.0) return "👍";
    if (score >= 2.0) return "🤷";
    return "😬";
  };

  // Star rating display
  const fullStars = Math.floor(goodness);
  const hasHalfStar = goodness - fullStars >= 0.5;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 group">
      {/* Name */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-white font-bold text-lg group-hover:text-orange-300 transition-colors">
          {name}
        </span>
        <span className="text-xl">{getEmoji(goodness)}</span>
      </div>

      {/* Score */}
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-semibold px-2 py-0.5 rounded-md border ${getScoreColor(
            goodness
          )}`}
        >
          {goodness.toFixed(1)}
        </span>

        {/* Stars */}
        <div className="flex gap-0.5 text-xs">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={
                i < fullStars
                  ? "text-yellow-400"
                  : i === fullStars && hasHalfStar
                  ? "text-yellow-400/50"
                  : "text-gray-600"
              }
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
