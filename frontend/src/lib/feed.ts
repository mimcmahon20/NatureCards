// Feed data types
export interface FeedUser {
  id: string;
  username: string;
  avatar?: string;
  cardCount: number;
}

export interface CardInPost {
  cardName: string;
  scientificName?: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  cardId: string; // References card ID in gallery data
}

export interface CardPost {
  id: string;
  user: FeedUser;
  location: string;
  timestamp: string;
  likes: number;
  comments: number;
  // Array of cards to be displayed in a scrollable row
  cards: CardInPost[];
}

export interface FeedResponse {
  posts: CardPost[];
}

// Maps rarity to star count for display
export const rarityToStars = {
  common: 1,
  rare: 2,
  epic: 3,
  legendary: 4
};

// Mock feed data
const mockFeedData: FeedResponse = {
  posts: [
    {
      id: "post-1",
      user: {
        id: "user-1",
        username: "Maguire McMahon",
        avatar: "/avatar-placeholder.png",
        cardCount: 2
      },
      location: "Blacksburg, VA",
      timestamp: "2 hours ago",
      likes: 5,
      comments: 2,
      cards: [
        {
          cardName: "Sunshine Daisy",
          scientificName: "Bellis perennis",
          image: "https://cdn.britannica.com/88/194588-050-967E8D17/plant-Japanese-maple.jpg",
          rarity: "common",
          cardId: "card-1" // References Rose in mockUsersGalleryData
        },
        {
          cardName: "Sunshine Arachne",
          scientificName: "Dahlia hybrid",
          image: "https://www.gardeningknowhow.com/wp-content/uploads/2021/07/dahlia-flowers.jpg",
          rarity: "epic",
          cardId: "card-3" // References Orchid in mockUsersGalleryData
        }
      ]
    },
    {
      id: "post-2",
      user: {
        id: "user-2",
        username: "Jane Botanist",
        avatar: "/avatar-placeholder.png",
        cardCount: 15
      },
      location: "Shenandoah Valley, VA",
      timestamp: "5 hours ago",
      likes: 8,
      comments: 3,
      cards: [
        {
          cardName: "Mountain Laurel",
          scientificName: "Kalmia latifolia",
          image: "https://extension.umd.edu/sites/extension.umd.edu/files/styles/optimized/public/2021-01/Mountain_Laurel-Kalmia_latifolia-1.jpg?itok=V_qPYh47",
          rarity: "rare",
          cardId: "card-2" // References Sunflower in mockUsersGalleryData
        },
        {
          cardName: "Eastern Redbud",
          scientificName: "Cercis canadensis",
          image: "https://www.thespruce.com/thmb/n01emtx6q3RBoqbQjIhIgNnRxZ4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/eastern-redbud-growing-profile-3269277-2-64a2cbb4cbb248959af7269da2a7f1d5.jpg",
          rarity: "common",
          cardId: "card-1"
        },
        {
          cardName: "Virginia Bluebells",
          scientificName: "Mertensia virginica",
          image: "https://www.gardenia.net/storage/app/public/uploads/images/detail/jNFGJvxuFXrkTW4KNGGAFSvgLXsWGZv5EXY76efo.webp",
          rarity: "rare",
          cardId: "card-2"
        }
      ]
    },
    {
      id: "post-3",
      user: {
        id: "user-3",
        username: "TreeHugger42",
        avatar: "/avatar-placeholder.png",
        cardCount: 7
      },
      location: "Sierra Nevada, CA",
      timestamp: "1 day ago",
      likes: 42,
      comments: 11,
      cards: [
        {
          cardName: "Giant Redwood",
          scientificName: "Sequoiadendron giganteum",
          image: "https://cdn.britannica.com/76/138676-050-D0F68361/Sequoiadendron-giganteum-Sierra-Nevada-Mountains-California.jpg",
          rarity: "legendary",
          cardId: "card-4" // References Venus Flytrap in mockUsersGalleryData
        },
        {
          cardName: "California Poppy",
          scientificName: "Eschscholzia californica",
          image: "https://calscape.org/photos/1487?srchcr=sc642a919c92bab",
          rarity: "common",
          cardId: "card-1"
        },
        {
          cardName: "Golden Yarrow",
          scientificName: "Eriophyllum confertiflorum",
          image: "https://calscape.org/photos/1487?srchcr=sc642a919c92bab",
          rarity: "rare",
          cardId: "card-2"
        },
        {
          cardName: "Sierra Gooseberry",
          scientificName: "Ribes roezlii",
          image: "https://calphotos.berkeley.edu/imgs/512x768/0000_0000/0815/0650.jpeg",
          rarity: "epic",
          cardId: "card-3"
        }
      ]
    }
  ]
};

// Function to simulate fetching feed data from backend
export async function fetchFeedData(): Promise<FeedResponse> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFeedData);
    }, 1000);
  });
}

// Function to fetch feed data for a specific user
export async function fetchUserFeedData(userId: string): Promise<FeedResponse> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter posts to only include those from the specified user
      const userPosts = mockFeedData.posts.filter(post => post.user.id === userId);
      resolve({ posts: userPosts });
    }, 1000);
  });
} 