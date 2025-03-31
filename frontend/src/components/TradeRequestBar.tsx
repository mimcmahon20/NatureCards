"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TradeRequest, fetchMockTradeRequestData } from "@/lib/social";
import { fetchCardDetails } from "@/lib/gallery";
import { Card as CardType } from "@/types";
import { useState, useEffect } from "react";
import { TradeRequestGlance } from "./TradeRequestGlance";
import { Skeleton } from "@/components/ui/skeleton";

interface TradeRequestBarProps {
  trade_request: TradeRequest;
  onTradeComplete?: (tradeId: string, status: 'accepted' | 'declined') => void;
}

export function TradeRequestBar({ trade_request, onTradeComplete }: TradeRequestBarProps) {
  const [senderCardName, setSenderCardName] = useState<string>("Loading...");
  const [recipientCardName, setRecipientCardName] = useState<string>("Loading...");
  const [senderCardImage, setSenderCardImage] = useState<string>("/placeholder.svg");
  const [recipientCardImage, setRecipientCardImage] = useState<string>("/placeholder.svg");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Extract colors for rarity visualization
  const getSenderRarityColors = () => {
    return {
      primaryColor: "#4F46E5", 
      secondaryColor: "#818CF8",
      rarityLevel: 3
    };
  };
  
  const getRecipientRarityColors = () => {
    return {
      primaryColor: "#059669",
      secondaryColor: "#34D399",
      rarityLevel: 4
    };
  };
  
  useEffect(() => {
    const loadCardDetails = async () => {
      try {
        // Load sender card details
        const senderCard = await fetchCardDetails(trade_request.sender_card_id);
        if (senderCard) {
          setSenderCardName(senderCard.commonName);
          if (senderCard.image) {
            setSenderCardImage(senderCard.image);
          }
        } else {
          setSenderCardName("Unknown Card");
        }
        
        // Load recipient card details
        const recipientCard = await fetchCardDetails(trade_request.recipient_card_id);
        if (recipientCard) {
          setRecipientCardName(recipientCard.commonName);
          if (recipientCard.image) {
            setRecipientCardImage(recipientCard.image);
          }
        } else {
          setRecipientCardName("Unknown Card");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading card details:", err);
        setSenderCardName("Unknown Card");
        setRecipientCardName("Unknown Card");
        setError(true);
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
            s_rating={getSenderRarityColors().rarityLevel}
            s_rarity="rare"
            s_cardId={trade_request.sender_card_id}
            
            r_name={recipientCardName}
            r_image={recipientCardImage}
            r_rating={getRecipientRarityColors().rarityLevel}
            r_rarity="epic"
            r_cardId={trade_request.recipient_card_id}
            
            onTradeComplete={handleTradeComplete}
          />
        </div>
      </div>
    </Card>
  );
}
