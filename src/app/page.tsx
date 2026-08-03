"use client";

import Navbar from "@/components/home/Navbar";
import HeroBanner from "@/components/home/HeroBanner";
import JustIn from "@/components/home/JustIn";
import Collection from "@/components/home/Collection";
import Subscribe from "@/components/home/Subscribe";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-white">
      <Navbar />

      <div className="relative z-0">
        <HeroBanner />
        <JustIn />
        <Collection />
        <Subscribe />
        <Footer />
      </div>
    </main>
  );
}