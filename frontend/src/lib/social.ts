// Types for friend data. User id is used to fetch most other data
export interface Friend {
    _id: string;
    username: string;
    profile_image: string;
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

//Simulate get of a list of all of the mock friends (AKA default user fetch)
export async function fetchMockFriendData(): Promise<Friend[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
          resolve(Object.values(mockFriendData));
        }, 1000);
      });
}

//TODO: get a specific user's friend list from backend. idk where the mockup json is and my brain feels like a wet sponge so you got this
