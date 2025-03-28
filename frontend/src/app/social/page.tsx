"use client";

import { useEffect, useState } from "react";
import { fetchMockFriendData, Friend } from "@/lib/social";
import { FriendBar } from "@/components/FriendBar";
import { Button } from "@/components/ui/button";

export default function Social() {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const data = await fetchMockFriendData();
      setFriends(data);
    };
    fetchFriends();
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
    </div>
  );
}
