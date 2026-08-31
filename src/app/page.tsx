import dynamic from "next/dynamic";

import Navbar from "@/components/home/Navbar";
import HeroBanner from "@/components/home/HeroBanner";
import JustIn from "@/components/home/JustIn";
import Footer from "@/components/home/Footer";

const Collection = dynamic(
  () => import("@/components/home/Collection"),
  { loading: () => <SectionSkeleton /> }
);

const Subscribe = dynamic(
  () => import("@/components/home/Subscribe"),
  { loading: () => <SectionSkeleton /> }
);

function SectionSkeleton() {
  return (
    <div className="bg-white py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8" aria-hidden>
        <div className="mx-auto h-6 w-48 animate-pulse rounded-full bg-neutral-200" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="h-[450px] animate-pulse rounded-3xl bg-neutral-100 md:h-[600px]" />
          <div className="grid gap-6 lg:col-span-2">
            <div className="h-[350px] animate-pulse rounded-3xl bg-neutral-100 md:h-[450px]" />
            <div className="h-[280px] animate-pulse rounded-3xl bg-neutral-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-white">
      <Navbar />

      <div className="relative z-0">
        <HeroBanner />
        <JustIn />
        <Collection />
        <Subscribe />
        <Footer />
      </div>
    </div>
  );
}
