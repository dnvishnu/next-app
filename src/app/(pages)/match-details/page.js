"use client";
import Banner from "@/components/Banner";
import Header from "@/components/Header";
import MatchDetails from "@/components/MatchDetails";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

function MatchInfo() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const matchId = searchParams.get("matchId");
  const seriesId = searchParams.get("seriesId");
  const version = searchParams.get("version");

  useEffect(() => {
    const fetchMetaData = async () => {
      if (matchId) {
        const bucketUrl = `https://storage.googleapis.com/daynightcricket/${date}.json?t=${new Date().getTime()}`;
        const response = await fetch(bucketUrl);
        const matches = await response.json();

        let matchName = "Match Details";

        if (version === "v2") {
          const match = matches.find((m) => m.id === matchId);
          if (match) {
            matchName = match.name;
          }
        } else if (version === "v1") {
          const match = matches.find(
            (m) => m.additional_data?.main_ids?.[1] === matchId
          );
          if (match) {
            matchName = `${match.additional_data.TeamName[0]} vs ${match.additional_data.TeamName[1]}`;
          }
        }

        document.title = `${matchName} - DayNightCricket`;
        const metaDescription = document.querySelector(
          'meta[name="description"]'
        );
        if (metaDescription) {
          metaDescription.setAttribute(
            "content",
            `Live match: ${matchName}. Stay updated with live scores, match status, and team details.`
          );
        } else {
          const meta = document.createElement("meta");
          meta.name = "description";
          meta.content = `Live match: ${matchName}. Stay updated with live scores, match status, and team details.`;
          document.head.appendChild(meta);
        }
      }
    };

    fetchMetaData();
  }, [matchId, version]);

  return (
    <div>
      <Banner />

      <Suspense fallback={<div>Loading matches...</div>}>
        <Header date={date} />
        <MatchDetails
          version={version}
          date={date}
          seriesId={seriesId}
          matchId={matchId}
        />
      </Suspense>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <MatchInfo />
    </Suspense>
  );
}
