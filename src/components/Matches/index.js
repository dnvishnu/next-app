"use client";
import { useEffect, useState } from "react";
import Card from "../Card";
import NewCard from "../NewCard";

export default function Match(props) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const bucketUrl = `https://storage.googleapis.com/daynightcricket/${
      props.date
    }.json?t=${new Date().getTime()}`;

    fetch(bucketUrl)
      .then((response) => {
        if (!response.ok) {
          return;
        }
        return response.json();
      })
      .then((data) => {
        if (data && Array.isArray(data)) {
          const combinedMatches = data.map((item) => ({
            ...item,
            version: item.id ? "v2" : "v1",
          }));

          setMatches(combinedMatches);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch JSON data:", error);
        setMatches([]);
      });
  }, [props.date]);

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24 mb-60"
    >
      {matches.map((data, index) =>
        data.version === "v2" ? (
          <NewCard
            key={index}
            date={props.date}
            data={data}
            url={`/match/${data.series_id}/${data.id}?date=${props.date}&version=v2`}
          />
        ) : (
          <Card
            key={index}
            date={data.date}
            battingData={data.battingData}
            ballingData={data.ballingData}
            additionalData={data.additional_data}
            url={
              data?.additional_data?.main_ids?.length >= 2
                ? `/match/${data.additional_data.main_ids[0]}/${data.additional_data.main_ids[1]}?date=${data.date}&version=v1`
                : "#"
            }
          />
        )
      )}
    </ul>
  );
}
