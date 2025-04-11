"use client";

import { useEffect, useState } from "react";
import { 
  fetchFriendData, 
  fetchFriendRequestData, 
  Friend, 
  FriendRequest, 
  TradeRequest,
  handleAcceptFriend,
  handleDeclineFriend 
} from "@/lib/social";
import { PendingFriend } from "@/types";
import { FriendBar } from "@/components/FriendBar";
import { FriendRequestBar } from "@/components/FriendRequestBar";
import { TradeRequestBar } from "@/components/TradeRequestBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { AddFriendModal } from "@/components/AddFriendModal";

export default function Social() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([]);
  const [loading, setLoading] = useState({
    friends: true,
    friendRequests: true,
    tradeRequests: true,
  });
  const [error, setError] = useState({
    friends: false,
    friendRequests: false,
    tradeRequests: false,
  });
  const toast = useToast();

  const refreshFriendRequests = async () => {
    try {
      const data = await fetchFriendRequestData();
      setFriendRequests(data);
    } catch (err) {
      console.error("Error refreshing friend requests:", err);
    }
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const data = await fetchFriendData();
        setFriends(data);
        setLoading(prev => ({ ...prev, friends: false }));
      } catch (err) {
        console.error("Error fetching friends:", err);
        setError(prev => ({ ...prev, friends: true }));
        setLoading(prev => ({ ...prev, friends: false }));
      }
    };
    
    const fetchFriendRequests = async () => {
      try {
        console.log("Fetching friend requests..."); 
        setLoading(prev => ({ ...prev, friendRequests: true }));
        const data = await fetchFriendRequestData();
        
        console.log("Raw friend requests data:", data);
        
        // Simply pass through the data - processing is now handled in fetchFriendRequestData
        setFriendRequests(data);
        setLoading(prev => ({ ...prev, friendRequests: false }));
      } catch (err) {
        console.error("Error fetching friend requests:", err);
        setError(prev => ({ ...prev, friendRequests: true }));
        setLoading(prev => ({ ...prev, friendRequests: false }));
      }
    };

    // Removed mock trade requests for now as we haven't implemented real trade data yet
    setLoading(prev => ({ ...prev, tradeRequests: false }));
    
    fetchFriends();
    fetchFriendRequests();
  }, []);

  // Loading skeletons for each section
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center p-4 border rounded-lg shadow">
          <Skeleton className="h-12 w-12 rounded-full mr-4" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );

  // Error display component
  const ErrorDisplay = ({ section }: { section: string }) => (
    <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-red-600">
      <p>Failed to load {section}. Please try again later.</p>
    </div>
  );

  // Handle trade completion (accept/decline)
  const handleTradeComplete = (tradeId: string, status: 'accepted' | 'declined') => {
    console.log(`Trade ${tradeId} was ${status}`);
    
    // Find the trade request that was completed
    const completedTrade = tradeRequests.find(trade => trade._id === tradeId);
    
    // Remove the completed trade from the list
    setTradeRequests(prev => prev.filter(trade => trade._id !== tradeId));
    
    // Show an additional toast notification when the trade is removed from the list
    if (completedTrade) {
      const otherUsername = completedTrade.sender_id === "12345" 
        ? completedTrade.recipient_username 
        : completedTrade.sender_username;
      
      if (status === 'accepted') {
        toast.open(
          <div>
            <div className="font-medium">Trade Complete</div>
            <div className="text-sm">
              Your trade with {otherUsername} has been processed successfully.
            </div>
          </div>,
          { variant: 'success', duration: 5000 }
        );
      } else {
        toast.open(
          <div>
            <div className="font-medium">Trade Declined</div>
            <div className="text-sm">
              Your trade with {otherUsername} has been declined.
            </div>
          </div>,
          { variant: 'default', duration: 5000 }
        );
      }
    }
  };

  // Handle friend request completion (accept/decline)
  const handleFriendRequestComplete = async (requestId: string, status: 'accepted' | 'declined') => {
    try {
        // Find the full request data
        const request = friendRequests.find(req => req._id === requestId);
        
        if (!request) {
            console.error('Friend request not found:', requestId);
            throw new Error('Friend request not found');
        }

        if (status === 'accepted') {
            await handleAcceptFriend(request.sender_id);
            
            // Immediately update UI by adding the new friend to friends list
            const newFriend: Friend = {
                _id: request.sender_id,
                username: request.username,
                profile_image: request.profile_image
            };
            
            setFriends(prev => [...prev, newFriend]);
        } else {
            await handleDeclineFriend(request.sender_id);
        }
        
        // Remove the request from the requests list
        setFriendRequests(prev => prev.filter(req => req._id !== requestId));
        
    } catch (error) {
        console.error('Error handling friend request:', error);
        toast.open(
            <div>
                <div className="font-medium">Error</div>
                <div className="text-sm">
                    Failed to process friend request. Please try again.
                </div>
            </div>,
            { variant: 'destructive' }
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Friends Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Friends</h1>
          <AddFriendModal onRequestSent={refreshFriendRequests} />
        </div>
        
        {loading.friends ? (
          <LoadingSkeleton />
        ) : error.friends ? (
          <ErrorDisplay section="friends" />
        ) : friends.length > 0 ? (
          <div className="space-y-4">
            {friends.map((friend) => (
              <FriendBar key={friend._id} friend={friend} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed rounded-lg">
            <p className="text-gray-500">No friends yet. Add some friends to get started!</p>
          </div>
        )}
      </div>

      {/* Friend Requests Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Friend Requests</h1>
          {!loading.friendRequests && friendRequests.length > 0 && (
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
              {friendRequests.length} pending
            </div>
          )}
        </div>
        
        {loading.friendRequests ? (
          <LoadingSkeleton />
        ) : error.friendRequests ? (
          <ErrorDisplay section="friend requests" />
        ) : friendRequests.length > 0 ? (
          <div className="space-y-4">
            {friendRequests.map((friend_request) => (
              <FriendRequestBar 
                key={friend_request._id}
                friend_request={friend_request}
                onRequestComplete={handleFriendRequestComplete}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed rounded-lg">
            <p className="text-gray-500">No pending friend requests.</p>
          </div>
        )}
      </div>

      {/* Trade Requests Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Trade Requests</h1>
          {!loading.tradeRequests && tradeRequests.length > 0 && (
            <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
              {tradeRequests.length} pending
            </div>
          )}
        </div>
        
        {loading.tradeRequests ? (
          <LoadingSkeleton />
        ) : error.tradeRequests ? (
          <ErrorDisplay section="trade requests" />
        ) : tradeRequests.length > 0 ? (
          <div className="space-y-4">
            {tradeRequests.map((trade_request) => (
              <TradeRequestBar 
                key={trade_request._id} 
                trade_request={trade_request} 
                onTradeComplete={handleTradeComplete}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed rounded-lg">
            <p className="text-gray-500">No pending trade requests.</p>
          </div>
        )}
      </div>
    </div>
  );
}
