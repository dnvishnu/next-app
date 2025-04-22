// pages/matches.js
"use client";
import Banner from "@/components/Banner";
import Feature from "@/components/Feature";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Matches from "@/components/Matches";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function MatchesList() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  useEffect(() => {
    if (date) {
      document.title = `Matches on ${date} - DayNightCricket`;
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          `Check out the cricket matches scheduled on ${date}, live scores, and match details on DayNightCricket.`
        );
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = `Check out the cricket matches scheduled on ${date}, live scores, and match details on DayNightCricket.`;
        document.head.appendChild(meta);
      }
    }
  }, [date]);

  return (
    <div>
      <Banner />
      <Header date={date} active="Matches" />
      <Matches date={date} />
      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <MatchesList />
    </Suspense>
  );
}
