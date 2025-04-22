import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Matches from "@/components/Matches";

export async function generateMetadata({ params }) {
  const { date } = await params; // Await the params object

  return {
    title: `Matches on ${date} - DayNightCricket`,
    description: `Check out the cricket matches scheduled on ${date}, live scores, and match details on DayNightCricket.`,
    keywords: `Check out the cricket matches scheduled on ${date}, live scores, and match details on DayNightCricket.`,
  };
}

export default async function Page({ params }) {
  const { date } = await params; // Await the params object

  return (
    <>
      <Banner />
      <Header date={date} active="Matches" />
      <Matches date={date} />
      <Footer />
    </>
  );
}
