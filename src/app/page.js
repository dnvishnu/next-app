"use client";
import { useState, useEffect, useRef } from "react";
import Banner from "@/components/Banner";
import Header from "@/components/Header";
import HomeCard from "@/components/HomeCard";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import HomeSummary from "@/components/HomeSummary";
import DateNavigation from "@/components/DateNavigation";
import Feature from "@/components/Feature";
import Footer from "@/components/Footer";
import HomeMatches from "@/components/HomeMatches";

export default function Home() {
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

  return (
    <>
      <Banner home={true} />
      <Header date="daynightcricket" active="Matches" />
      {/* <HomeMatches /> */}
      <Feature />
      <HomeSummary matches={matchData} />
      <Footer />
    </>
  );
}
