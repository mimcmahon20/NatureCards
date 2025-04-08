import { GalleryResponse } from "@/types";

// Types for friend data. User id is used to fetch most other data
export interface Friend {
    _id: string;
    username: string;
    profile_image: string;
}

// Types for friend data. User id is used to fetch most other data
export interface FriendRequest {
    _id: string; //Friend request ID; matches sender id
    sender_id: string;
    recipient_id: string;
    username: string;
    profile_image: string;
}

export interface TradeRequest {
    _id: string; //Trade request ID
    sender_id: string;
    recipient_id: string;
    sender_username: string;
    recipient_username: string;
    profile_image: string;

    //SENDER card id
    sender_card_id: string;

    //RECIPIENT card id
    recipient_card_id: string;
}

//Mock data for friends. Friend mock user IDs should match with gallery mock user ids to test fetching gallery data
const mockFriendData: Record<string, Friend> = {
    //First user; nature_lover
    "12345": {
        "_id": "12345",
        "username": "Nature Lover",
        "profile_image": "https://hips.hearstapps.com/hmg-prod/images/close-up-of-blossoming-rose-flower-royalty-free-image-1580853844.jpg?crop=0.668xw:1.00xh;0.248xw,0&resize=980:*"
    },
    //Second user; forest_explorer
    "67890": {
        "_id": "67890",
        "username": "Forest Explorer",
        "profile_image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Wild_red_fox_%28Vulpes_vulpes%29.jpg/800px-Wild_red_fox_%28Vulpes_vulpes%29.jpg"
    },
    //Third user; butterfly_collector
    "24680": {
        "_id": "24680",
        "username": "Butterfly Collector",
        "profile_image": "https://www.nationalgeographic.com/content/dam/animals/thumbs/rights-exempt/invertebrates/b/butterfly_thumb.ngsversion.1485813662680.adapt.1900.1.jpg"
    }
}

//Mock friend request data. 
//From backend, the objects will be pairs of mongo_ids; first ID is ALWAYS the sender and second ID is ALWAYS the receiver
const mockFriendRequestData: Record<string, FriendRequest> = {
    //First user; forest_explorer TO user
    "67890": {
        "_id": "67890",
        "sender_id": "67890",
        "recipient_id": "12345",
        "username": "Forest Explorer",
        "profile_image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Wild_red_fox_%28Vulpes_vulpes%29.jpg/800px-Wild_red_fox_%28Vulpes_vulpes%29.jpg"
    },
    //Second user; moth_photographer. Test if THIS user sent the request.
    "24680": {
        "_id": "24680",
        "sender_id": "12345",
        "recipient_id": "23405",
        "username": "Moth Photographer",
        "profile_image": "https://blog.nature.org/wp-content/uploads/2018/10/Rosy-Maple-Moth-by-Ken-Childs-2-near-Henderson-TN.jpg"
    }
}

//Mock trade request data.
//From backend, the objects will be pairs of mongo_ids; first ID is ALWAYS the sender id and second ID is ALWAYS the receiver id
const mockTradeRequestData: Record<string, TradeRequest> = {
    //First: Trade with forest_explorer's sample card, received by user.
    "test1": {
        "_id": "test1",
        "sender_id": "67890",
        "recipient_id": "12345",
        "sender_username": "Forest Explorer",
        "recipient_username": "You",
        "profile_image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Wild_red_fox_%28Vulpes_vulpes%29.jpg/800px-Wild_red_fox_%28Vulpes_vulpes%29.jpg",

        //TODO: fetchCardDetails call to get actual card details from card ID
        "sender_card_id": "card-6",
        "recipient_card_id": "card-1"
    },
    //Second, Trade with butterfly_collector's sample card, SENT by user.
    "test2": {
        "_id": "test2",
        "sender_id": "12345",
        "recipient_id": "24680",
        "sender_username": "You",
        "recipient_username": "Butterfly Collector",
        "profile_image": "https://blog.nature.org/wp-content/uploads/2018/10/Rosy-Maple-Moth-by-Ken-Childs-2-near-Henderson-TN.jpg",

        //TODO: fetchCardDetails call to get actual card details from card ID
        "sender_card_id": "card-2",
        "recipient_card_id": "card-9"
    }
}

//Simulate get of a list of all of the mock friends (AKA default user fetch)
export async function fetchMockFriendData(): Promise<Friend[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(Object.values(mockFriendData));
        }, 1000);
    });
}

//Simulate get of a list of all of the mock friend friend requests (AKA default user fetch)
export async function fetchMockFriendRequestData(): Promise<FriendRequest[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(Object.values(mockFriendRequestData));
        }, 1000);
    });
}

//Simulate get of a list of all of the mock trade requests (AKA default user fetch)
export async function fetchMockTradeRequestData(): Promise<TradeRequest[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(Object.values(mockTradeRequestData));
        }, 1000);
    });
}

//Get a URL representing the user's gallery. Fetched using the passed in user's ID.
export function fetchFriendGalleryURL(user_id: string): string {
    return ("/gallery?userid=" + user_id);
}

//Social "view profile" button click
export const handleProfileClick = (friend_id: string) => {
    console.log(fetchFriendGalleryURL(friend_id));
    window.location.href = '/gallery?userid=' + friend_id;
}

//View trade request drawer on click
export const handleTradeRequestClick = (trade_id: string) => {
    console.log(fetchFriendGalleryURL(trade_id));
    console.log("open trade request drawer here");
    //window.location.href = '/gallery?userid=' + trade_id;
}

// Accept friend request ONLY if this user is the recipient. This logic
// should not be handled by the user who sent the request.
export const handleAcceptFriend = (friend_id: string) => {
    console.log("Accept friend request logic here");

    //Move pending friend from friend request to friend array for both users
    mockFriendData[friend_id] = {
        "_id": friend_id,
        "username": mockFriendRequestData[friend_id].username,
        "profile_image": mockFriendRequestData[friend_id].profile_image
    }
    delete mockFriendRequestData[friend_id];

    // TODO: This user's data is handled, but we need to send this user's friend 
    // request accept to the user who sent it & update their database.
    // Probably can only be handled once backend is connected.

}

//Decline friend request from sender. Simply removes friend request data from both users.
export const handleDeclineFriend = (friend_id: string) => {
    console.log("Decline friend request logic here");

    //Remove pending friend from friend request array
    delete mockFriendRequestData[friend_id];

    //TODO: Remove pending friend from friend request array of the sender
    //Again, only possible once backend is connected.
}

//Handled when trade recipient accepts trade request, exchanging card data between sender and recipient
export const handleAcceptTrade = async (trade_request: TradeRequest): Promise<boolean> => {
    console.log("Accepting trade request:", trade_request);
    
    try {
        // In a real implementation, this would make an API call to accept the trade
        // For mock purposes, we'll simulate a successful trade
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Remove the trade request from our mock data
        if (mockTradeRequestData[trade_request._id]) {
            delete mockTradeRequestData[trade_request._id];
        }
        
        console.log("Trade accepted successfully");
        return true;
    } catch (error) {
        console.error("Error accepting trade:", error);
        return false;
    }
}

//Get this user's gallery data. Used for exchanging card data in trades.
export async function getUserGallery(user_id: string): Promise<GalleryResponse> {
    const response = await fetch(`/api/gallery?userid=${user_id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch gallery data");
    }
    return response.json();
}

//Handled when trade recipient declines trade request. This will remove the trade request from both users.
export const handleDeclineTrade = async (trade_id: string): Promise<boolean> => {
    console.log("Declining trade request:", trade_id);
    
    try {
        // In a real implementation, this would make an API call to decline the trade
        // For mock purposes, we'll simulate a successful decline
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Remove the trade request from our mock data
        if (mockTradeRequestData[trade_id]) {
            delete mockTradeRequestData[trade_id];
        }
        
        console.log("Trade declined successfully");
        return true;
    } catch (error) {
        console.error("Error declining trade:", error);
        return false;
    }
}

// Simulates sending a friend request to a user by username
export async function sendFriendRequest(username: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a successful request in 75% of cases
      const success = Math.random() < 0.75;
      
      // In real implementation, we would make an API call to send a friend request
      console.log(`Sending friend request to ${username}`);
      
      if (success) {
        // Mock adding to our pending requests data
        // In a real app, this would be handled by the server
        
        // In this mock, let's assume a random mock user is created with the given username
        const mockUserId = `user-${Math.random().toString(36).substring(2, 9)}`;
        
        mockFriendRequestData[mockUserId] = {
          "_id": mockUserId,
          "sender_id": "12345", // Assume current user is sending
          "recipient_id": mockUserId,
          "username": username,
          "profile_image": "https://source.unsplash.com/random/300x300/?person"
        };
      }
      
      resolve(success);
    }, 1500); // Simulate network delay
  });
}

// Add these new functions to check friendship status

// Enumerates possible friendship statuses
export type FriendshipStatus = "friend" | "pending_outgoing" | "pending_incoming" | "none";

// Check the friendship status of a given user ID relative to the current user
export async function checkFriendshipStatus(userId: string): Promise<FriendshipStatus> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check if the user is already a friend
      const isFriend = Object.values(mockFriendData).some(friend => friend._id === userId);
      
      if (isFriend) {
        resolve("friend");
        return;
      }
      
      // Check if there's a pending friend request sent by the current user
      const isOutgoingRequest = Object.values(mockFriendRequestData).some(
        request => request.sender_id === "12345" && request.recipient_id === userId
      );
      
      if (isOutgoingRequest) {
        resolve("pending_outgoing");
        return;
      }
      
      // Check if there's a pending friend request sent to the current user
      const isIncomingRequest = Object.values(mockFriendRequestData).some(
        request => request.sender_id === userId && request.recipient_id === "12345"
      );
      
      if (isIncomingRequest) {
        resolve("pending_incoming");
        return;
      }
      
      // No friendship relation exists
      resolve("none");
    }, 500); // Simulate network delay
  });
}