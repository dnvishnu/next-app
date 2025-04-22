"use client";
import React, { useEffect, useState } from "react";
import { marked } from "marked";
import BattingTable from "../BattingTable";
import BowlingTable from "../BowlingTable";
import ReactMarkdown from "react-markdown";
import NewBattingTable from "../NewBattingTable";
import NewBowlingTable from "../NewBowlingTable";

function MatchDetails({ version, date, seriesId, matchId }) {
  const [batData, setBatData] = useState([]);
  const [ballData, setBallData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [summary, setSummary] = useState("");
  const [matchName, setMatchName] = useState("");
  const [matchData, setMatchData] = useState([]);

  const getStructuredData = (res) => {
    const count = Object.keys(res.Name).length;
    const result = [];

    for (let j = 0; j < count; j++) {
      const row = [];
      for (const key of Object.keys(res)) {
        row.push(res[key][j]);
      }
      result.push(row);
    }

    return result;
  };

  useEffect(() => {
    if (version === "v1") {
      const fetchMatchData = async () => {
        try {
          const response = await fetch(
            `https://storage.googleapis.com/daynightcricket/${date}.json`
          );

          if (!response.ok) {
            console.error("Failed to fetch data:", response.statusText);
            return;
          }

          const res = await response.json();

          for (let i = 0; i < res.length; i++) {
            const matchData = res[i]?.["additional_data"]; // Safe check for undefined
            const mainIds = matchData?.["main_ids"]; // Safe check for undefined

            if (
              mainIds &&
              mainIds.length >= 2 &&
              mainIds[0] === seriesId &&
              mainIds[1] === matchId
            ) {
              setTeamData(matchData?.["TeamName"] || []);

              try {
                setBatData(getStructuredData(res[i]?.["battingData"] || {}));
              } catch {
                console.error("Batting data not found");
              }

              try {
                setBallData(getStructuredData(res[i]?.["ballingData"] || {}));
              } catch {
                console.error("Bowling data not found");
              }
            }
          }
        } catch (error) {
          console.error("Error fetching match data:", error);
        }
      };

      fetchMatchData();
    } else {
      const fetchMatchData = async () => {
        const oldBucketUrl = `https://storage.googleapis.com/daynightcricket/${date}.json?t=${new Date().getTime()}`;
        const response = await fetch(oldBucketUrl);
        const matches = await response.json();

        const match = matches.find((m) => m.id === matchId);

        if (match) {
          setMatchName(match.name);
        }

        if (match && match.scorecard) {
          setMatchName(match.name);
          setMatchData(match);
        } else {
          // Use the new approach
          const newBucketUrl = `https://storage.googleapis.com/daynightcricket/${date}/${seriesId}/${matchId}.json?t=${new Date().getTime()}`;
          const newResponse = await fetch(newBucketUrl);
          const newMatch = await newResponse.json();

          if (newMatch) {
            setMatchName(newMatch.name);
            setMatchData(newMatch);
          }
        }
      };

      fetchMatchData();
    }
  }, [date, matchId, seriesId, version]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        if (version === "v1") {
          const textResponse = await fetch(
            `https://storage.googleapis.com/daynightcricket/${date}/${seriesId}/${matchId}_summary.txt`
          );

          if (textResponse.ok) {
            const text = await textResponse.text();
            setSummary(text);
          }
        } else {
          let textResponse = await fetch(
            `https://storage.googleapis.com/daynightcricket/${date}/${seriesId}/${matchId}/summary.txt`
          );

          if (!textResponse.ok) {
            textResponse = await fetch(
              `https://storage.googleapis.com/daynightcricket/${date}/${seriesId}/${matchId}_summary.txt`
            );
          }

          if (textResponse.ok) {
            const text = await textResponse.text();
            setSummary(text);
          }
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    fetchSummary();
  }, [date, seriesId, matchId]);

  return (
    <div className="mx-auto max-w-7xl mb-60 mt-12">
      {/* Match Heading */}

      {/* Scorecard Section (Only for v1) */}
      {version === "v1" && (
        <>
          <div className="bg-white">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-2 lg:grid-cols-12 lg:gap-8 lg:px-8">
              <h3 className="max-w-xl text-balance text-1xl font-bold tracking-tight text-gray-700 sm:text-2xl lg:col-span-7">
                {teamData[0] || "Team 1"} vs {teamData[1] || "Team 2"}
              </h3>
            </div>
          </div>
          <div>
            <BattingTable data={batData} team={teamData[0]} teamNum={1} />
            <BowlingTable data={ballData} team={teamData[1]} teamNum={2} />
          </div>

          <div className="mt-24">
            <BattingTable data={batData} team={teamData[1]} teamNum={2} />
            <BowlingTable data={ballData} team={teamData[0]} teamNum={1} />
          </div>
        </>
      )}

      {version != "v1" && (
        <>
          <div className="bg-white">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-2 lg:grid-cols-12 lg:gap-8 lg:px-8">
              <h3 className="max-w-xl text-balance text-1xl font-bold tracking-tight text-gray-700 sm:text-2xl lg:col-span-7">
                {matchName}
              </h3>
            </div>
          </div>
          <div>
            <NewBattingTable
              battingData={matchData?.scorecard?.[0]?.batting}
              matchData={matchData?.score?.[0]}
            />
            <NewBowlingTable bowlingData={matchData?.scorecard?.[0]?.bowling} />
            <NewBattingTable
              battingData={matchData?.scorecard?.[1]?.batting}
              matchData={matchData?.score?.[1]}
            />
            <NewBowlingTable bowlingData={matchData?.scorecard?.[1]?.bowling} />
            <NewBowlingTable />
          </div>
        </>
      )}

      {/* Summary Section (For both v1 and v2) */}
      {summary && (
        <div className="mt-16 bg-gray-50 p-3 lg:px-8 shadow-sm rounded-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Match Summary
          </h3>
          <div className="text-gray-700 leading-relaxed text-justify">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchDetails;
