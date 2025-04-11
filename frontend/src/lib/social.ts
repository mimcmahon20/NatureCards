import { GalleryResponse, PendingFriend } from "@/types";
import { fetchGalleryData, fetchUserGalleryData, updateUserData } from "@/lib/gallery";

// Types for friend data. User id is used to fetch most other data
export interface Friend {
    _id: string;
    username: string;
    profile_image: string;
}

export interface FriendRequest {
    _id: string;
    sender_id: string;
    recipient_id: string;
    username: string;
    profile_image: string;
    sending: string; 
    receiving: string;
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

// Convert backend friend data to our Friend interface
async function processFriendData(userId: string): Promise<Friend> {
    const userData = await fetchUserGalleryData(userId);
    return {
        _id: userData._id,
        username: userData.username,
        profile_image: userData.profile_picture || '/default-avatar.png'
    };
}

// Fetch real friend data from backend
export async function fetchFriendData(): Promise<Friend[]> {
    try {
        const currentUser = await fetchGalleryData();
        const friendPromises = currentUser.friends.map(friendId =>
            processFriendData(typeof friendId === 'string' ? friendId : friendId.$oid)
        );
        return await Promise.all(friendPromises);
    } catch (error) {
        console.error("Error fetching friend data:", error);
        return [];
    }
}

// Fetch this user's friend request data from backend
export async function fetchFriendRequestData(): Promise<FriendRequest[]> {
    try {
        const currentUser = await fetchGalleryData();
        console.log("Current user data:", currentUser);

        if (!currentUser?.pending_friends) {
            console.log("No pending friends found");
            return [];
        }

        // Process friend requests by mapping friend request objects
        const pendingFriendsArray = currentUser.pending_friends.map(request => {
            if (!request?.sending || !request?.receiving) {
                console.error('Invalid request structure:', request);
                return null;
            }
            return request;
        }).filter((request): request is PendingFriend => request !== null);

        console.log("Structured pending friends:", pendingFriendsArray);

        const requestPromises = pendingFriendsArray.map(async (request) => {
            try {
                // note that request.sending and request.receiving represent user IDs
                const otherUserId = request.sending === currentUser._id ? 
                    request.receiving : request.sending;

                console.log(`Fetching data for user ${otherUserId}`);
                const otherUserData = await fetchUserGalleryData(otherUserId);

                return {
                    _id: request.sending,
                    sender_id: request.sending,
                    recipient_id: request.receiving,
                    username: otherUserData.username,
                    profile_image: otherUserData.profile_picture || '/default-avatar.png',
                    sending: request.sending,
                    receiving: request.receiving
                };
            } catch (err) {
                console.error('Error processing friend request:', err);
                return null;
            }
        });

        const results = await Promise.all(requestPromises);
        const validResults = results.filter((req): req is FriendRequest => req !== null);
        console.log("Final processed friend requests:", validResults);

        return validResults;
    } catch (error) {
        console.error("Error fetching friend request data:", error);
        return [];
    }
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
// should not be handled by the user who sent the request, but check isn't necessary here;
// Conditional on friend request bar should block the sender from accepting/declining request.
export const handleAcceptFriend = async (friend_id: string) => {
    try {
        const currentUser = await fetchGalleryData();
        const otherUser = await fetchUserGalleryData(friend_id);
        
        // Find the specific friend request
        const friendRequest = currentUser.pending_friends.find(
            request => request.sending === friend_id
        );
        
        if (!friendRequest) {
            throw new Error('Friend request not found');
        }

        // Update current user's data
        const updatedCurrentUser = {
            ...currentUser,
            friends: [...(currentUser.friends || []), friend_id],
            pending_friends: currentUser.pending_friends.filter(
                request => request.sending !== friend_id
            )
        };
        
        // Update other user's data
        const updatedOtherUser = {
            ...otherUser,
            friends: [...(otherUser.friends || []), currentUser._id],
            pending_friends: otherUser.pending_friends.filter(
                request => !(request.sending === friend_id && request.receiving === currentUser._id)
            )
        };

        // Update both users in database
        await Promise.all([
            updateUserData(updatedCurrentUser),
            updateUserData(updatedOtherUser)
        ]);
        
    } catch (error) {
        console.error("Error accepting friend request:", error);
        throw error;
    }
};

//Decline friend request from sender. Simply removes friend request data from both users.
export const handleDeclineFriend = async (friend_id: string) => {
    try {
        const currentUser = await fetchGalleryData();
        const otherUser = await fetchUserGalleryData(friend_id);

        // Update current user's data
        const updatedCurrentUser = {
            ...currentUser,
            pending_friends: currentUser.pending_friends.filter(
                request => request.sending !== friend_id
            )
        };

        // Update other user's data - fix the filter condition to remove the request
        const updatedOtherUser = {
            ...otherUser,
            pending_friends: otherUser.pending_friends.filter(
                request => !(request.sending === friend_id && request.receiving === currentUser._id)
            )
        };

        // Update both users in database
        await Promise.all([
            updateUserData(updatedCurrentUser),
            updateUserData(updatedOtherUser)
        ]);

    } catch (error) {
        console.error("Error declining friend request:", error);
        throw error;
    }
};

//Handled when trade recipient accepts trade request, exchanging card data between sender and recipient
export const handleAcceptTrade = async (trade_request: TradeRequest): Promise<boolean> => {
    try {
        const currentUser = await fetchGalleryData();
        const tradePartner = await fetchUserGalleryData(trade_request.sender_id);

        // Exchange cards between users
        const updatedCurrentUser = {
            ...currentUser,
            cards: currentUser.cards.map(card => 
                card.id === trade_request.recipient_card_id 
                    ? { ...card, owner: tradePartner._id }
                    : card
            ),
            trading: currentUser.trading.filter(t => t.offeredCard.id !== trade_request.recipient_card_id)
        };

        const updatedPartnerUser = {
            ...tradePartner,
            cards: tradePartner.cards.map(card =>
                card.id === trade_request.sender_card_id
                    ? { ...card, owner: currentUser._id }
                    : card
            ),
            trading: tradePartner.trading.filter(t => t.offeredCard.id !== trade_request.sender_card_id)
        };

        // Update both users in database
        await Promise.all([
            updateUserData(updatedCurrentUser),
            updateUserData(updatedPartnerUser)
        ]);

        return true;
    } catch (error) {
        console.error('Error accepting trade:', error);
        return false;
    }
};

export const handleDeclineTrade = async (trade_id: string): Promise<boolean> => {
    try {
        const currentUser = await fetchGalleryData();

        // Remove trade from trading array
        const updatedCurrentUser = {
            ...currentUser,
            trading: currentUser.trading.filter(t => t.offeredCard.id !== trade_id)
        };

        // Update user in database
        await updateUserData(updatedCurrentUser);
        return true;
    } catch (error) {
        console.error('Error declining trade:', error);
        return false;
    }
};

// Simulates sending a friend request to a user by username
export async function sendFriendRequest(username: string): Promise<boolean> {
    try {
        const currentUser = await fetchGalleryData();
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/db/findByUsername/${username}`);
        if (!response.ok) {
            throw new Error('User not found');
        }
        const targetUser = await response.json();
        
        // Create properly structured friend request
        const friendRequest: PendingFriend = {
            sending: currentUser._id,
            receiving: targetUser._id
        };
        
        const updatedTargetUser = {
            ...targetUser,
            pending_friends: [...(targetUser.pending_friends || []), friendRequest]
        };
        
        await updateUserData(updatedTargetUser);
        return true;
        
    } catch (error) {
        console.error('Error sending friend request:', error);
        return false;
    }
}

// Enumerates possible friendship statuses
export type FriendshipStatus = "friend" | "pending_outgoing" | "pending_incoming" | "none";

// Check the friendship status of a given user ID relative to the current user
export async function checkFriendshipStatus(userId: string): Promise<FriendshipStatus> {
    try {
        const currentUser = await fetchGalleryData();
        
        // Check if they're friends
        const isFriend = currentUser.friends.some(
            friendId => (typeof friendId === 'string' ? friendId : friendId.$oid) === userId
        );
        if (isFriend) return "friend";
        
        // Check for outgoing friend request
        const isOutgoingRequest = currentUser.pending_friends.some(
            request => request.receiving === userId
        );
        if (isOutgoingRequest) return "pending_outgoing";
        
        // Check for incoming friend request
        const isIncomingRequest = currentUser.pending_friends.some(
            request => request.sending === userId
        );
        if (isIncomingRequest) return "pending_incoming";
        
        return "none";
        
    } catch (error) {
        console.error('Error checking friendship status:', error);
        throw error;
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