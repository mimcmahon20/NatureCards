"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TradeRequest, handleTradeRequestClick } from "@/lib/social";
import { fetchCardDetails } from "@/lib/gallery";
import { Card as CardType } from "@/types";

interface TradeRequestBarProps {
  trade_request: TradeRequest;
}

const handleGetCardName = async (card_id: string) => {
  const cardDetails = await fetchCardDetails(card_id);
  if (!cardDetails) {
    console.error("Card details not found for card ID:", card_id);
    return;
  }
  return cardDetails.commonName;
}

export function TradeRequestBar({ trade_request }: TradeRequestBarProps) {
  return (
    <Card className="flex items-center p-4">
      <CardContent className="flex-1">
        <p className="font-medium">{"sender card"} with {"recipient card" /* TODO: handleGetCardName(trade_request.recipient_card_id) was being finnicky; temp names for now. */}</p>
        {trade_request.sender_id == "12345" ? ( //TODO: replace "12345" default with check for logged in user ID
          <p className="font-medium">Trade offered by you to {trade_request.recipient_username}</p>
        ) : (
          <p className="font-medium">Trade offered by {trade_request.sender_username} to you</p>
        )
        }

      </CardContent>

      {trade_request.sender_id == "12345" ? ( //TODO: replace "12345" default with check for logged in user ID
        <Button variant="outline" size="sm" onClick={() => handleTradeRequestClick(trade_request._id)}>
          View Offer
        </Button>
      ) : (
        <Button variant="disabled" size="sm">
          Trade Pending
        </Button>
      )
      }
    </Card>
  );
}
