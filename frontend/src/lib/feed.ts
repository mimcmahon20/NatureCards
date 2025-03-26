// Import types from the types directory
import { CardInPost, FeedUser, CardPost, FeedResponse, rarityToStars } from '@/types';
import { getUserById, getAllUsers, generateFeedForUser } from './mock-db';
import { createPostFromUserCards } from './feed-adapter';

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
      // Get the first user as the "current" user
      const allUsers = getAllUsers();
      const currentUser = allUsers[0];
      
      // Get user's feed data
      const feedCards = generateFeedForUser(currentUser._id);
      
      // Group cards by user to create posts
      const userCardMap = new Map();
      
      // First add the current user's cards
      userCardMap.set(currentUser._id, []);
      
      // Then add cards from friends
      feedCards.forEach(card => {
        if (!userCardMap.has(card.owner)) {
          userCardMap.set(card.owner, []);
        }
        userCardMap.get(card.owner).push(card);
      });
      
      // Create posts from grouped cards
      const posts: CardPost[] = [];
      
      // Convert Map entries to array to fix iteration issue
      Array.from(userCardMap.entries()).forEach(([userId, cards]) => {
        if (cards.length > 0) {
          const user = getUserById(userId);
          if (user) {
            const location = cards[0].location || 'Unknown location';
            const timestamp = userId === currentUser._id ? 
              'Just now' : 
              `${Math.floor(Math.random() * 24)} hours ago`;
            
            posts.push(createPostFromUserCards(user, location, timestamp));
          }
        }
      });
      
      resolve({ posts });
    }, 1000);
  });
}

// Function to fetch feed data for a specific user
export async function fetchUserFeedData(userId: string): Promise<FeedResponse> {
  // Simulate network delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = getUserById(userId);
      
      if (!user) {
        reject(new Error(`User with ID ${userId} not found`));
        return;
      }
      
      // Get the user's feed
      const feedCards = generateFeedForUser(userId);
      
      // Create a single post for simplicity
      const post = createPostFromUserCards(
        user, 
        user.cards.length > 0 ? user.cards[0].location || 'Unknown' : 'Unknown',
        'Just now'
      );
      
      resolve({ posts: [post] });
    }, 1000);
  });
} 