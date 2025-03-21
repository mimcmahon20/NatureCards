"use client";

import { useEffect, useState } from "react";
import { CardGlance } from "@/components/CardGlance";
import { Card, SortOption, fetchGalleryData, sortCards } from "@/lib/gallery";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Gallery() {
  const [cards, setCards] = useState<Card[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getGalleryData = async () => {
      setLoading(true);
      try {
        const data = await fetchGalleryData();
        setCards(sortCards(data.cards, sortBy));
      } catch (error) {
        console.error("Failed to fetch gallery data:", error);
      } finally {
        setLoading(false);
      }
    };

    getGalleryData();
  }, [sortBy]);

  const handleSort = (option: SortOption) => {
    setSortBy(option);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 pt-4 sm:pt-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-8 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold">Your Cards</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 text-sm sm:text-base w-fit">
              Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSort("name")}>
              Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("date")}>
              Date
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("rarity")}>
              Rarity
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      ) : cards.length > 0 ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4 md:gap-6">
          {cards.map((card) => (
            <CardGlance
              key={card.id}
              name={card.commonName}
              image={card.image}
              rarity={card.rarity}
              cardId={card.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No cards found in your collection</p>
        </div>
      )}
    </div>
  );
}
