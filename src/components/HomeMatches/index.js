"use client";
import { useState, useEffect, useRef } from "react";
import HomeCard from "@/components/HomeCard";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import "./HomeMatches.css";

export default function HomeMatches() {
  const [dates, setDates] = useState([]);
  const [matchData, setMatchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchMatches = async () => {
      let fetchedMatches = [];
      let validDates = [];
      let currentDate = new Date(); // Start with today
      let previousDate = new Date();
      previousDate.setDate(previousDate.getDate() - 1); // Start with yesterday

      const fetchData = async (date) => {
        const formattedDate = date
          .toISOString()
          .split("T")[0]
          .split("-")
          .reverse()
          .join("-");
        const bucketUrl = `https://storage.googleapis.com/daynightcricket/${formattedDate}.json?t=${new Date().getTime()}`;

        try {
          const response = await fetch(bucketUrl);
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0 && data[0].id) {
              return { date: formattedDate, matches: data };
            }
          }
        } catch (error) {
          console.error("Fetch error:", error);
        }
        return null;
      };

      let foundValidDate = false;

      while (!foundValidDate) {
        const result = await fetchData(currentDate);
        if (result) {
          validDates.push(result.date);
          fetchedMatches.push(...result.matches);
          foundValidDate = true;
        } else {
          currentDate.setDate(currentDate.getDate() - 1); // Move back one day
        }
      }

      // Once we find a valid date, get matches for the previous day
      previousDate = new Date(currentDate);
      previousDate.setDate(previousDate.getDate() - 1);

      const prevResult = await fetchData(previousDate);
      if (prevResult) {
        validDates.push(prevResult.date);
        fetchedMatches.push(...prevResult.matches);
      }

      setMatchData(fetchedMatches);
      setDates(validDates);
      setLoading(false);
    };

    fetchMatches();
  }, []);

  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: 250, behavior: "smooth" });
  };

  return (
    <>
      <div className="w-full flex flex-col items-center mt-0">
        {loading ? (
          <p className="text-gray-500 text-sm"></p>
        ) : (
          <div className="relative w-full max-w-6xl mx-auto">
            <button
              onClick={scrollLeft}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-gray-700 transition"
            >
              <ArrowLeftIcon className="w-4 h-4 text-white stroke-current" />
            </button>

            <div
              ref={containerRef}
              className="flex overflow-x-auto gap-3 py-4 px-4 hide-scrollbar"
            >
              {matchData.length > 0 ? (
                matchData.map((data, index) => (
                  <HomeCard
                    key={index}
                    data={data}
                    url={`/match/${data.series_id}/${data.id}?date=${data.date
                      .split("-")
                      .reverse()
                      .join("-")}&version=v2`}
                    
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm">No matches available.</p>
              )}
            </div>

            <button
              onClick={scrollRight}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-gray-700 transition"
            >
              <ArrowRightIcon className="w-4 h-4 text-white stroke-current" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
