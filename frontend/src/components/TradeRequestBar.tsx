"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TradeRequest } from "@/lib/social";
import { useState, useEffect } from "react";
import { TradeRequestGlance } from "./TradeRequestGlance";
import { Skeleton } from "@/components/ui/skeleton";
import { mockFetchCardDetails } from "@/lib/mock-trade-data";

// Card interface matching the structure used in CardDetailed
interface CardData {
  id: string;
  name: string;
  image: string;
  rating: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  commonName: string;
  scientificName?: string;
  family?: string;
  funFact?: string;
  timePosted?: string;
  location?: string;
  username?: string;
}

interface TradeRequestBarProps {
  trade_request: TradeRequest;
  onTradeComplete?: (tradeId: string, status: 'accepted' | 'declined') => void;
}

export function TradeRequestBar({ trade_request, onTradeComplete }: TradeRequestBarProps) {
  const [senderCard, setSenderCard] = useState<CardData | null>(null);
  const [recipientCard, setRecipientCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  // const [errorState, setErrorState] = useState(false);
  
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
  
  useEffect(() => {
    const loadCardDetails = async () => {
      try {
        // Fetch sender card details
        const senderCardData = await mockFetchCardDetails(trade_request.sender_card_id);
        if (senderCardData) {
          setSenderCard({
            id: senderCardData.id || trade_request.sender_card_id,
            name: senderCardData.commonName,
            image: senderCardData.image || "/placeholder.svg",
            rating: getRarityStars(convertRarity(senderCardData.rarity)),
            rarity: convertRarity(senderCardData.rarity),
            commonName: senderCardData.commonName,
            // Add other optional fields if available
            scientificName: senderCardData.scientificName,
            family: senderCardData.family,
          });
        }
        
        // Fetch recipient card details
        const recipientCardData = await mockFetchCardDetails(trade_request.recipient_card_id);
        if (recipientCardData) {
          setRecipientCard({
            id: recipientCardData.id || trade_request.recipient_card_id,
            name: recipientCardData.commonName,
            image: recipientCardData.image || "/placeholder.svg",
            rating: getRarityStars(convertRarity(recipientCardData.rarity)),
            rarity: convertRarity(recipientCardData.rarity),
            commonName: recipientCardData.commonName,
            // Add other optional fields if available
            scientificName: recipientCardData.scientificName,
            family: recipientCardData.family,
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading card details:", err);
        // setErrorState(true);
        setLoading(false);
      }
    };
    
    loadCardDetails();
  }, [trade_request.sender_card_id, trade_request.recipient_card_id]);

// Handle when a trade is completed (accepted or declined)
  const handleTradeComplete = (tradeId: string, status: 'accepted' | 'declined') => {
console.log(`Trade ${tradeId} was ${status}`);
    
    // Call the parent component's callback if provided
    if (onTradeComplete) {
      onTradeComplete(tradeId, status);
    }
  };

  return (
    <Card className="overflow-hidden">
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
                  Trading <span className="text-green-600">{senderCard?.commonName || "Unknown Card"}</span> for{" "}
                  <span className="text-blue-600">{recipientCard?.commonName || "Unknown Card"}</span>
                </p>
                {trade_request.sender_id === "12345" ? (
                  <p className="text-sm text-gray-500">
                    You offered this trade to {trade_request.recipient_username}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {trade_request.sender_username} offered this trade to you
                  </p>
                )}
              </>
            )}
          </CardContent>
        </div>
        
        <div className="flex items-center justify-end p-4 bg-gray-50 border-t sm:border-t-0 sm:border-l">
          <TradeRequestGlance
            tradeRequest={{
              id: trade_request._id,
              sender: {
                id: trade_request.sender_id,
                username: trade_request.sender_username,
                card: senderCard || {
                  id: trade_request.sender_card_id,
                  name: "Unknown Card",
                  image: "/placeholder.svg",
                  rating: 1,
                  rarity: "common",
                  commonName: "Unknown Card"
                }
              },
              recipient: {
                id: trade_request.recipient_id,
                username: trade_request.recipient_username,
                card: recipientCard || {
                  id: trade_request.recipient_card_id,
                  name: "Unknown Card",
                  image: "/placeholder.svg",
                  rating: 1,
                  rarity: "common",
                  commonName: "Unknown Card"
                }
              }
            }}
            onTradeComplete={handleTradeComplete}
            isDisabled={loading}
          />
        </div>
      </div>
    </Card>
  );
}
