"use client";

import { CalendarIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Card(props) {
  const router = useRouter();
  const { url, battingData, additionalData, date } = props;
  const batt = battingData?.["Name"] || {};

  let team1Total = 0,
    team2Total = 0;

  for (let i = 0; i < Object.keys(batt).length; i++) {
    if (batt[i] === "Total" || batt[i] === "TOTAL") {
      if (team1Total === 0) {
        team1Total = battingData["SR"][i];
      } else {
        team2Total = battingData["SR"][i];
      }
    }
  }

  const handleMatchClick = () => {
    router.push(url);
  };

  return (
    <li
      className="overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm transform transition-transform cursor-pointer"
      onClick={handleMatchClick}
    >
      <div className="p-4 flex items-center space-x-4 bg-white border-b border-gray-200">
        <div className="w-12 h-12 flex items-center justify-center rounded-md bg-gray-500 text-white font-bold text-lg">
          {additionalData?.Series?.[0] || "0"}
        </div>
        <div className="text-lg font-semibold text-gray-800">
          {additionalData?.Series || "0"}
        </div>
      </div>
      <dl className="p-4 space-y-4 text-gray-700">
        <div className="flex justify-between items-center">
          <div className="font-medium text-gray-600">
            {additionalData?.TeamName?.[0] || "0"}
          </div>
          <div className="text-lg font-semibold">{team1Total || "0"}</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="font-medium text-gray-600">
            {additionalData?.TeamName?.[1] || "0"}
          </div>
          <div className="text-lg font-semibold">{team2Total || "0"}</div>
        </div>
        <div className="flex justify-between mt-4">
          <dd className="flex items-center gap-x-2">
            <div
              className={classNames(
                "rounded-md bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600 ring-1 ring-blue-300"
              )}
            >
              {additionalData?.Status || "0"}
            </div>
          </dd>
        </div>
      </dl>
      <div className="flex p-4 gap-2 bg-gray-50 rounded-b-md text-gray-600 text-sm font-medium">
        <CalendarIcon className="w-5" />
        <span>{date || "0"}</span>
      </div>
    </li>
  );
}
