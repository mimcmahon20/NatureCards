"use client";

import { Card, TradeRequest } from "@/types";
import { Card as CardComponent, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { TradeRequestGlance } from "./TradeRequestGlance";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchUserGalleryData } from "@/lib/gallery";
import { Button } from "@/components/ui/button";

interface TradeRequestBarProps {
  trade_request: TradeRequest;
  onTradeComplete?: (tradeId: string, status: 'accepted' | 'declined') => void;
}

export function TradeRequestBar({ trade_request, onTradeComplete }: TradeRequestBarProps) {
  const [senderCard, setSenderCard] = useState<Card | null>(null);
  const [recipientCard, setRecipientCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  // Convert database rarity to our component rarity type
  const convertRarity = (dbRarity: string): "common" | "rare" | "epic" | "legendary" => {
    switch(dbRarity) {
      case "legendary": return "legendary";
      case "epic": return "epic";
      case "rare": return "rare";
      case "uncommon": return "rare"; // Map uncommon to rare for UI purposes
      case "common":
      default: return "common";
    }
  };
  
  // Get star count for rarity visualization
  const getRarityStars = (rarity: "common" | "rare" | "epic" | "legendary"): number => {
    switch (rarity) {
      case "legendary": return 4;
      case "epic": return 3;
      case "rare": return 2;
      case "common":
      default: return 1;
    }
  };

  const validateTradeData = () => {
    if (!trade_request?.offeredCard || !trade_request?.requestedCard) return false;
    if (!senderCard || !recipientCard) return false;
    return true;
  };

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        setLoading(true);
        
        if (!trade_request?.offeredCard?.owner || !trade_request?.requestedCard?.owner) {
          console.log('Waiting for card ownership data...');
          return;
        }

        // Fetch users' data based on card ownership
        const [senderData, recipientData] = await Promise.all([
          fetchUserGalleryData(trade_request.offeredCard.owner),
          fetchUserGalleryData(trade_request.requestedCard.owner)
        ]);

        // Convert offered card
        setSenderCard({
          id: trade_request.offeredCard.id,
          name: trade_request.offeredCard.commonName,
          image: trade_request.offeredCard.image,
          rating: getRarityStars(convertRarity(trade_request.offeredCard.rarity)),
          rarity: convertRarity(trade_request.offeredCard.rarity),
          commonName: trade_request.offeredCard.commonName,
          scientificName: trade_request.offeredCard.scientificName,
          family: trade_request.offeredCard.family,
          username: senderData.username // Set username from gallery data
        });

        // Convert requested card
        setRecipientCard({
          id: trade_request.requestedCard.id,
          name: trade_request.requestedCard.commonName,
          image: trade_request.requestedCard.image,
          rating: getRarityStars(convertRarity(trade_request.requestedCard.rarity)),
          rarity: convertRarity(trade_request.requestedCard.rarity),
          commonName: trade_request.requestedCard.commonName,
          scientificName: trade_request.requestedCard.scientificName,
          family: trade_request.requestedCard.family,
          username: recipientData.username // Set username from gallery data
        });

      } catch (err) {
        console.error("Error loading card details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCardDetails();
  }, [trade_request]);

  // Handle when a trade is completed (accepted or declined)
  const handleTradeComplete = (tradeId: string, status: 'accepted' | 'declined') => {
    console.log(`Trade ${tradeId} was ${status}`);
    
    // Call the parent component's callback if provided
    if (onTradeComplete) {
      onTradeComplete(tradeId, status);
    }
  };

  // Update render check
  const canRenderGlance = validateTradeData();

  return (
    <CardComponent className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="flex-1 p-4">
          <CardContent className="p-0">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <>
                <p className="font-medium">
                  Trading <span className="text-green-600">{senderCard?.commonName || "Unknown Card"}</span> from{" "}
                  <span className="font-semibold">{senderCard?.username || "Unknown User"}</span> for{" "}
                  <span className="text-blue-600">{recipientCard?.commonName || "Unknown Card"}</span> from{" "}
                  <span className="font-semibold">{recipientCard?.username || "Unknown User"}</span>
                </p>
              </>
            )}
          </CardContent>
        </div>

        <div className="flex items-center justify-end p-4 bg-gray-50 border-t sm:border-t-0 sm:border-l">
          {canRenderGlance ? (
            <TradeRequestGlance
              tradeRequest={trade_request} // Pass the normalized trade request directly
              onTradeComplete={handleTradeComplete}
              isDisabled={loading}
            />
          ) : (
            <Button variant="outline" size="sm" disabled>
              Loading...
            </Button>
          )}
        </div>
      </div>
    </CardComponent>
  );
}
