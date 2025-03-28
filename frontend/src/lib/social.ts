import { Card } from "@/lib/gallery";
import { fetchCardDetails, GalleryResponse } from "@/lib/gallery";

// Types for friend data. User id is used to fetch most other data
export interface Friend {
    _id: string;
    username: string;
    profile_image: string;
}

// Types for friend data. User id is used to fetch most other data
export interface FriendRequest {
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
    //First user; nature_lover. First 2 users test this user receiving requests.
    "12345": {
        "sender_id": "12345",
        "recipient_id": "11111",
        "username": "Nature Lover",
        "profile_image": "https://hips.hearstapps.com/hmg-prod/images/close-up-of-blossoming-rose-flower-royalty-free-image-1580853844.jpg?crop=0.668xw:1.00xh;0.248xw,0&resize=980:*"
    },
    //Second user; forest_explorer
    "67890": {
        "sender_id": "67890",
        "recipient_id": "11111",
        "username": "Forest Explorer",
        "profile_image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Wild_red_fox_%28Vulpes_vulpes%29.jpg/800px-Wild_red_fox_%28Vulpes_vulpes%29.jpg"
    },
    //Third user; moth_photographer. Test if THIS user sent the request.
    "24680": {
        "sender_id": "11111",
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
export const handleAcceptTrade = async (trade_request: TradeRequest) => {
    const recipient_gallery = await getUserGallery(trade_request.recipient_id);
    console.log("Accept trade request logic here");

    //Exchange recipient/sender card arrays
    delete (recipient_gallery.cards as Record<string, any>)[trade_request.recipient_card_id];

    //TODO: send card data to other user. For now it just banishes this card to the void.
    //Backend connection required for that.

    //Remove trade request from both users
    delete mockTradeRequestData[trade_request._id];

    //TODO: remove trade request from other user. Backend connection required.
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
export const handleDeclineTrade = (trade_id: string) => {
    console.log("Decline trade request logic here");

    //Remove trade request from both users
}