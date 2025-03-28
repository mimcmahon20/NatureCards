"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card } from "@/types";
import { fetchCardDetails } from "@/lib/gallery";
import { CardDetailed } from "./CardDetailed";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface CardGlanceProps {
  name: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  cardId: string; // Added to identify the card
}

export function CardGlance({
  name,
  image,
  rarity,
  cardId,
}: CardGlanceProps) {
  const [cardDetails, setCardDetails] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDrawer = async () => {
    if (!cardDetails) {
      setIsLoading(true);
      try {
        const details = await fetchCardDetails(cardId);
        setCardDetails(details);
      } catch (error) {
        console.error("Failed to fetch card details:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Determine colors based on rarity
  const getColors = () => {
    switch (rarity) {
      case "common":
        return {
          border: "border-[#1a4e8c]", // Blue border
          bg: "bg-[#d8e6f3]", // Light blue background
          star: "text-[#1a4e8c]", // Blue stars
          header: "bg-[#d8e6f3]", // Light blue header
          rarityLevel: 1, // 1 star filled
        };
      case "rare":
        return {
          border: "border-[#2e7d32]", // Green border
          bg: "bg-[#e8f5e9]", // Light green background
          star: "text-[#2e7d32]", // Green stars
          header: "bg-[#e8f5e9]", // Light green header
          rarityLevel: 2, // 2 stars filled
        };
      case "epic":
        return {
          border: "border-[#6a4c93]", // Purple border
          bg: "bg-[#e7e0f4]", // Light purple background
          star: "text-[#6a4c93]", // Purple stars
          header: "bg-[#e7e0f4]", // Light purple header
          rarityLevel: 3, // 3 stars filled
        };
      case "legendary":
        return {
          border: "border-[#8b5a2b]", // Brown/gold border
          bg: "bg-[#f9f3e0]", // Light cream/gold background
          star: "text-[#8b5a2b]", // Brown/gold stars
          header: "bg-[#f9f3e0]", // Light cream/gold header
          rarityLevel: 4, // 4 stars filled
        };
      default:
        return {
          border: "border-gray-300",
          bg: "bg-gray-50",
          star: "text-gray-400",
          header: "bg-gray-50",
          rarityLevel: 0,
        };
    }
  };

  const colors = getColors();

  return (
    <Drawer onOpenChange={(open) => open && handleOpenDrawer()}>
      <DrawerTrigger asChild>
        <div
          className={`rounded-lg border-2 ${colors.border} overflow-hidden w-full max-w-full cursor-pointer hover:shadow-md transition-shadow shadow-xl`}
        >
          <div className={`p-1 sm:p-2 ${colors.border} ${colors.header}`}>
            <h3 className="text-sm sm:text-sm font-semibold truncate">{name}</h3>
          </div>
          <div className="relative aspect-square">
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              fill
              className={`object-cover border-t-2 border-b-2 ${colors.border}`}
            />
          </div>
          <div className={`flex justify-center p-1 sm:p-2 ${colors.bg}`}>
            {[1, 2, 3, 4].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ${
                  colors.star
                } ${
                  star <= colors.rarityLevel
                    ? "fill-current"
                    : "fill-transparent"
                }`}
              />
            ))}
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="min-h-[50vh] max-h-[90vh]">
        
        <div className="overflow-y-auto px-4 pb-8 h-full">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700"></div>
            </div>
          ) : cardDetails ? (
            <div className="relative max-w-lg mx-auto pt-10">
              <DrawerClose className="absolute top-0 right-0 p-2 rounded-full bg-gray-100 hover:bg-gray-200 z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span className="sr-only">Close</span>
              </DrawerClose>
              <CardDetailed
                plant={{
                  id: cardDetails.id || cardId,
                  name: cardDetails.commonName,
                  image: cardDetails.image,
                  rating: colors.rarityLevel,
                  rarity: (cardDetails.rarity === "uncommon" ? "rare" : cardDetails.rarity) as "common" | "rare" | "epic" | "legendary",
                  commonName: cardDetails.commonName,
                  scientificName: cardDetails.scientificName,
                  family: cardDetails.family || "",
                  funFact: cardDetails.funFact,
                  timePosted: new Date(
                    cardDetails.timeCreated
                  ).toLocaleDateString(),
                  location: cardDetails.location,
                  username: cardDetails.username || "Unknown",
                }}
              />
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Failed to load card details. Please try again.
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
