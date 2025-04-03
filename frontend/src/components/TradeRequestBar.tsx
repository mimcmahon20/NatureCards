"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TradeRequest } from "@/lib/social";
import { useState, useEffect } from "react";
import { TradeRequestGlance } from "./TradeRequestGlance";
import { Skeleton } from "@/components/ui/skeleton";
import { mockFetchCardDetails } from "@/lib/mock-trade-data"; // Import mock data

interface TradeRequestBarProps {
  trade_request: TradeRequest;
  onTradeComplete?: (tradeId: string, status: 'accepted' | 'declined') => void;
}

export function TradeRequestBar({ trade_request, onTradeComplete }: TradeRequestBarProps) {
  const [senderCardName, setSenderCardName] = useState<string>("Loading...");
  const [recipientCardName, setRecipientCardName] = useState<string>("Loading...");
  const [senderCardImage, setSenderCardImage] = useState<string>("/placeholder.svg");
  const [recipientCardImage, setRecipientCardImage] = useState<string>("/placeholder.svg");
  const [senderCardRarity, setSenderCardRarity] = useState<"common" | "rare" | "epic" | "legendary">("common");
  const [recipientCardRarity, setRecipientCardRarity] = useState<"common" | "rare" | "epic" | "legendary">("common");
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(false);
  
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
  }
  
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
        // Use mock data for testing
        const senderCard = await mockFetchCardDetails(trade_request.sender_card_id);
        if (senderCard) {
          setSenderCardName(senderCard.commonName);
          if (senderCard.image) {
            setSenderCardImage(senderCard.image);
          }
          // Set card rarity, converting from DB format to our component format
          setSenderCardRarity(convertRarity(senderCard.rarity));
        } else {
          setSenderCardName("Unknown Card");
        }
        
        // Load recipient card details
        const recipientCard = await mockFetchCardDetails(trade_request.recipient_card_id);
        if (recipientCard) {
          setRecipientCardName(recipientCard.commonName);
          if (recipientCard.image) {
            setRecipientCardImage(recipientCard.image);
          }
          // Set card rarity, converting from DB format to our component format
          setRecipientCardRarity(convertRarity(recipientCard.rarity));
        } else {
          setRecipientCardName("Unknown Card");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading card details:", err);
        setSenderCardName("Unknown Card");
        setRecipientCardName("Unknown Card");
        setErrorState(true);
        setLoading(false);
        console.log(errorState)
      }
    };
    
    loadCardDetails();
  }, [trade_request.sender_card_id, trade_request.recipient_card_id, errorState]);

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
                  Trading <span className="text-green-600">{senderCardName}</span> for <span className="text-blue-600">{recipientCardName}</span>
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
            tradeId={trade_request._id}
            senderId={trade_request.sender_id}
            recipientId={trade_request.recipient_id}
            senderUsername={trade_request.sender_username}
            recipientUsername={trade_request.recipient_username}
            
            s_name={senderCardName}
            s_image={senderCardImage}
            s_rating={getRarityStars(senderCardRarity)}
            s_rarity={senderCardRarity}
            s_cardId={trade_request.sender_card_id}
            
            r_name={recipientCardName}
            r_image={recipientCardImage}
            r_rating={getRarityStars(recipientCardRarity)}
            r_rarity={recipientCardRarity}
            r_cardId={trade_request.recipient_card_id}
            
            onTradeComplete={handleTradeComplete}
          />
        </div>
      </div>
    </Card>
  );
}
