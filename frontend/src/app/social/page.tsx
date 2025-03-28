"use client";

import { useEffect, useState } from "react";
import { fetchMockFriendData, fetchMockFriendRequestData, fetchMockTradeRequestData, Friend, FriendRequest, TradeRequest } from "@/lib/social";
import { FriendBar } from "@/components/FriendBar";
import { FriendRequestBar } from "@/components/FriendRequestBar";
import { TradeRequestBar } from "@/components/TradeRequestBar";
import { Button } from "@/components/ui/button";
// import { Card, fetchCardDetails } from "@/lib/gallery";

export default function Social() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const data = await fetchMockFriendData();
      setFriends(data);
    };
    const fetchFriendRequests = async () => {
      const data = await fetchMockFriendRequestData();
      setFriendRequests(data);
    }
    const fetchTradeRequests = async () => {
      const data = await fetchMockTradeRequestData();
      setTradeRequests(data);
    }
    fetchFriends();
    fetchFriendRequests();
    fetchTradeRequests();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Friends</h1>
        <Button variant="success">Add Friend</Button>
      </div>
      <div className="space-y-4">
        {friends.map((friend) => (
          <FriendBar key={friend._id} friend={friend} />
        ))}
      </div>
      <div className="flex justify-between items-center mt-12 mb-6">
        <h1 className="text-xl font-bold">Friend Requests</h1>
      </div>
      <div className="space-y-4">
        {friendRequests.map((friend_request) => (
          <FriendRequestBar key={friend_request._id} friend_request={friend_request} />
        ))}
      </div>
      <div className="flex justify-between items-center mt-12 mb-6">
        <h1 className="text-xl font-bold">Trade Requests</h1>
      </div>
      <div className="space-y-4">
        {tradeRequests.map((trade_request) => (
          <TradeRequestBar key={trade_request._id} trade_request={trade_request} />
        ))}
      </div>
    </div>
  );
}
