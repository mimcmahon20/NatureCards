"use client";

import { useState } from "react";
import { TradeRequest } from "@/lib/social";
import { TradeRequestBar } from "@/components/TradeRequestBar";

export default function TradesDemoPage() {
  // Demo trade requests
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([
    {
      _id: "trade1",
      sender_id: "67890",
      recipient_id: "12345",
      sender_username: "Forest Explorer",
      recipient_username: "Nature Lover",
      profile_image: "",
      sender_card_id: "card-6", // Red Fox (legendary)
      recipient_card_id: "card-1" // Red Rose (rare)
    },
    {
      _id: "trade2",
      sender_id: "12345",
      recipient_id: "24680",
      sender_username: "Nature Lover",
      recipient_username: "Butterfly Collector",
      profile_image: "",
      sender_card_id: "card-2", // Sunflower (epic)
      recipient_card_id: "card-9" // Tiger Swallowtail (common)
    }
  ]);

  // Handle completed trades
  const handleTradeComplete = (tradeId: string, status: 'accepted' | 'declined') => {
    console.log(`Trade ${tradeId} was ${status}`);
    
    // Remove the trade from the list
    setTradeRequests(prev => prev.filter(trade => trade._id !== tradeId));
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">Trade Requests Demo</h1>
      <p className="text-gray-500 mb-6">
        Below are sample trade requests with mock data. You can view, accept, or decline trades.
      </p>
      
      <div className="space-y-4">
        {tradeRequests.length > 0 ? (
          tradeRequests.map(trade => (
            <TradeRequestBar 
              key={trade._id} 
              trade_request={trade} 
              onTradeComplete={handleTradeComplete}
            />
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No trade requests to show</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => {
                // Reset demo state with new trades
                setTradeRequests([
                  {
                    _id: "trade1",
                    sender_id: "67890",
                    recipient_id: "12345",
                    sender_username: "Forest Explorer",
                    recipient_username: "Nature Lover",
                    profile_image: "",
                    sender_card_id: "card-6", 
                    recipient_card_id: "card-1"
                  },
                  {
                    _id: "trade2",
                    sender_id: "12345",
                    recipient_id: "24680",
                    sender_username: "Nature Lover",
                    recipient_username: "Butterfly Collector",
                    profile_image: "",
                    sender_card_id: "card-2",
                    recipient_card_id: "card-9"
                  }
                ]);
              }}
            >
              Reset Demo
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 