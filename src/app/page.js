"use client"

import { useEffect } from 'react';
import Navbar from "@/components/Navbar";
import SearchArea from "@/components/SearchArea";
import HowItWorks from "@/components/HowItWorks";
import GreatTourTrip from "@/components/GreatTourTrip";
import PeopleComment from "@/components/PeopleComment";
import PopularDestinations from "@/components/PopularDestinations";

export default function Home() {
  // Set document title on client side
  useEffect(() => {
    document.title = "Khan Travel - Premium Transfer & Car Rental Services";
  }, []);

  return (
    <> 
      <Navbar />
    
      <main className="w-screen flex flex-col h-screen">
        {/* Search Area */}
        <SearchArea />

        {/* People Comments */}
        <PeopleComment />
    
        {/* Great Tour Trip */}
        <GreatTourTrip />

        {/* Popular Destinations */}
        <PopularDestinations />

        {/* How It Works */}
        <HowItWorks />
      </main>
    </>
  );
}
