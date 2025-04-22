// pages/matches.js
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import UploadFile from "@/components/UploadFile";
import { Suspense, useContext, useEffect } from "react";
import { AppContext } from "@/context/AppContext";

function UploadComponent() {
  const router = useRouter();
  const params = useSearchParams();
  const date = params.get("date"); // Access the 'date' query parameter
  const { user, loader } = useContext(AppContext);

  useEffect(() => {
    if (!user && !loader) {
      router.push("/login?page=register");
    }
  }, [user, loader]);

  return (
    <div>
      <Banner />
      <Header date={date} active="Register" />
      <UploadFile />
      <Footer />
    </div>
  );
}

export default function Upload() {
  return (
    <Suspense>
      <UploadComponent />
    </Suspense>
  );
}
