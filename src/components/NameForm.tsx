"use client";

import { useState } from "react";
import ResultCard from "./ResultCard";

interface GeneratedName {
  id: number;
  name: string;
  goodness: number;
}

interface CombinationSet {
  id: number;
  name1: string;
  name2: string;
  createdAt: string;
  results: GeneratedName[];
}

export default function NameForm({
  initialHistory,
}: {
  initialHistory: CombinationSet[];
}) {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<CombinationSet[]>(initialHistory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name1.trim() || !name2.trim()) {
      setError("Both names are required!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/name-combinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name1: name1.trim(), name2: name2.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const newSet: CombinationSet = await res.json();

      // Add new result to the top of history
      setHistory((prev) => [newSet, ...prev]);

      // Clear inputs
      setName1("");
      setName2("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate names");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Input Form */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">
          ⚡ Generate Name Combinations
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name1"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                First Name
              </label>
              <input
                id="name1"
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                placeholder="e.g. John"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor="name2"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Second Name
              </label>
              <input
                id="name2"
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                placeholder="e.g. Jacob"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Naminating...
              </span>
            ) : (
              "🔥 Generate Names"
            )}
          </button>
        </form>
      </div>

      {/* Results History */}
      {history.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            📜 Your Naminations
          </h2>

          <div className="space-y-6">
            {history.map((set) => (
              <div
                key={set.id}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-lg"
              >
                {/* Set Header */}
                <div className="flex flex-wrap items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    <span className="text-orange-400">{set.name1}</span>
                    {" "}+{" "}
                    <span className="text-orange-400">{set.name2}</span>
                  </h3>
                  <span className="text-gray-500 text-xs">
                    {new Date(set.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Result Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {set.results
                    .sort((a, b) => b.goodness - a.goodness)
                    .map((result) => (
                      <ResultCard key={result.id} result={result} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {history.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">🤖</p>
          <p className="text-lg">No naminations yet.</p>
          <p className="text-sm">Enter two names above to get started!</p>
        </div>
      )}
    </div>
  );
}
