"use client";

import { useState, useEffect } from "react";
import { marked } from "marked";
import Link from "next/link";

export default function HomeSummary({ matches }) {
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    const fetchSummaries = async () => {
      const fetchedSummaries = await Promise.all(
        matches.map(async (match) => {
          const { id: matchId, series_id: seriesId, date } = match;
          const formattedDate = date.split("-").reverse().join("-");
          const summaryUrl = `https://storage.googleapis.com/daynightcricket/${formattedDate}/${seriesId}/${matchId}_summary.txt`;
  
          try {
            const response = await fetch(summaryUrl);
            if (response.ok) {
              const text = await response.text();
              const cleanSummary = marked(text).replace(/<[^>]*>?/gm, "").trim();
  
              if (cleanSummary) {
                return {
                  ...match,
                  summary: cleanSummary.slice(0, 220) + "...",
                };
              }
            }
          } catch (error) {
            console.error("Error fetching summary:", error);
          }
  
          return null; // If no valid summary, exclude this match
        })
      );
  
      // Filter out null entries (i.e., matches without valid summaries)
      const filteredSummaries = fetchedSummaries.filter(Boolean);
      setSummaries(filteredSummaries);
    };
  
    fetchSummaries();
  }, [matches]);
  

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-2 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Match Insights
          </h2>
          <p className="mt-3 text-base text-gray-500">
            Dive into quick highlights and moments from the last few matches.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 p-0 lg:p-12 lg:grid-cols-3">
          {summaries.map((match, index) => {
            const formattedDate = match.date.split("-").reverse().join("-");
            return (
              <Link
                key={index}
                href={`/match/${match.series_id}/${match.id}?date=${formattedDate}&version=v2`}
                className="group"
              >
                <article className="bg-gray-50 border border-gray-200 rounded-sm p-6 flex flex-col justify-between h-full w-full">
                  <div className="flex flex-col gap-3">
                    <span className="text-sm text-gray-500 font-medium">
                      {formattedDate}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
                      {match.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {match.summary}
                    </p>
                  </div>
                  <div className="mt-5 text-sm font-medium text-blue-600 group-hover:underline">
                    Read more →
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
