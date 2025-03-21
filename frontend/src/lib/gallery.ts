// Types for card data
export interface Card {
  creator: number;
  owner: number;
  commonName: string;
  scientificName: string;
  funFact: string;
  timeCreated: string;
  location: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  tradeStatus: boolean;
  infoLink: string;
  image: string;
  // Additional fields for detailed view
  id: string;
  family: string;
  username: string;
}

export interface GalleryResponse {
  _id: string;
  username: string;
  cards: Card[];
}

// Mock data for multiple users' galleries
const mockUsersGalleryData: Record<string, GalleryResponse> = {
  // Default user - nature_lover
  "12345": {
    "_id": "12345",
    "username": "nature_lover",
    "cards": [
      {
        "id": "card-1",
        "creator": 1,
        "owner": 1,
        "commonName": "Rose",
        "scientificName": "Rosa",
        "funFact": "Roses are one of the oldest flowers in existence, with fossil evidence showing they're 35 million years old.",
        "timeCreated": new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        "location": "Blacksburg, VA",
        "rarity": "common",
        "tradeStatus": false,
        "infoLink": "https://nature-cards-eight.vercel.app/roses",
        "image": "https://hips.hearstapps.com/hmg-prod/images/close-up-of-blossoming-rose-flower-royalty-free-image-1580853844.jpg?crop=0.668xw:1.00xh;0.248xw,0&resize=980:*",
        "family": "Rosaceae",
        "username": "rose_collector"
      },
      {
        "id": "card-2",
        "creator": 2,
        "owner": 1,
        "commonName": "Sunflower",
        "scientificName": "Helianthus annuus",
        "funFact": "Sunflowers track the sun's movement across the sky, a behavior known as heliotropism.",
        "timeCreated": new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        "location": "Richmond, VA",
        "rarity": "rare",
        "tradeStatus": false,
        "infoLink": "https://nature-cards-eight.vercel.app/sunflowers",
        "image": "https://img.freepik.com/free-photo/purple-osteospermum-daisy-flower_1373-16.jpg",
        "family": "Asteraceae",
        "username": "sunflower_fan"
      },
      {
        "id": "card-3",
        "creator": 3,
        "owner": 1,
        "commonName": "Orchid",
        "scientificName": "Orchidaceae",
        "funFact": "Orchids have the smallest seeds in the world, resembling fine dust.",
        "timeCreated": new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        "location": "Norfolk, VA",
        "rarity": "epic",
        "tradeStatus": false,
        "infoLink": "https://nature-cards-eight.vercel.app/orchids",
        "image": "https://hips.hearstapps.com/hmg-prod/images/summer-flowers-sunflower-1648478429.jpg?crop=0.534xw:1.00xh;0.416xw,0&resize=980:*",
        "family": "Orchidaceae",
        "username": "orchid_enthusiast"
      },
      {
        "id": "card-4",
        "creator": 4,
        "owner": 1,
        "commonName": "Venus Flytrap",
        "scientificName": "Dionaea muscipula",
        "funFact": "Venus flytraps can count! They only snap shut when they detect two touches within 20 seconds.",
        "timeCreated": new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        "location": "Charlottesville, VA",
        "rarity": "legendary",
        "tradeStatus": false,
        "infoLink": "https://nature-cards-eight.vercel.app/venus-flytrap",
        "image": "https://contentgrid.homedepot-static.com/hdus/en_US/DTCCOMNEW/Articles/discover-the-secret-language-of-flowers-2022-hero.jpeg",
        "family": "Droseraceae",
        "username": "carnivorous_plant_lover"
      }
    ]
  },
  // Second user - forest_explorer
  "67890": {
    "_id": "67890",
    "username": "forest_explorer",
    "cards": [
      {
        "id": "card-5",
        "creator": 5,
        "owner": 2,
        "commonName": "Giant Sequoia",
        "scientificName": "Sequoiadendron giganteum",
        "funFact": "Giant sequoias are the world's largest single trees by volume and can live for over 3,000 years.",
        "timeCreated": new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        "location": "Sierra Nevada, CA",
        "rarity": "legendary",
        "tradeStatus": false,
        "infoLink": "https://nature-cards-eight.vercel.app/sequoia",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Sequoiadendron_giganteum_at_Mariposa_Grove.jpg/800px-Sequoiadendron_giganteum_at_Mariposa_Grove.jpg",
        "family": "Cupressaceae",
        "username": "tree_enthusiast"
      },
      {
        "id": "card-6",
        "creator": 6,
        "owner": 2,
        "commonName": "Red Fox",
        "scientificName": "Vulpes vulpes",
        "funFact": "Red foxes have an excellent sense of hearing - they can hear rodents digging underground and a watch ticking from 40 yards away.",
        "timeCreated": new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        "location": "Shenandoah National Park, VA",
        "rarity": "rare",
        "tradeStatus": false,
        "infoLink": "https://nature-cards-eight.vercel.app/red-fox",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Wild_red_fox_%28Vulpes_vulpes%29.jpg/800px-Wild_red_fox_%28Vulpes_vulpes%29.jpg",
        "family": "Canidae",
        "username": "wildlife_photographer"
      }
    ]
  },
  // Third user - butterfly_collector
  "24680": {
    "_id": "24680",
    "username": "butterfly_collector",
    "cards": [
      {
        "id": "card-7",
        "creator": 7,
        "owner": 3,
        "commonName": "Monarch Butterfly",
        "scientificName": "Danaus plexippus",
        "funFact": "Monarch butterflies migrate up to 3,000 miles from the United States and Canada to Mexico every year.",
        "timeCreated": new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        "location": "Central Mexico",
        "rarity": "epic",
        "tradeStatus": false,
        "infoLink": "https://nature-cards-eight.vercel.app/monarch-butterfly",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Monarch_In_May.jpg/800px-Monarch_In_May.jpg",
        "family": "Nymphalidae",
        "username": "butterfly_watcher"
      },
      {
        "id": "card-8",
        "creator": 8,
        "owner": 3,
        "commonName": "Blue Morpho",
        "scientificName": "Morpho peleides",
        "funFact": "The brilliant blue color of the Blue Morpho's wings is not from pigment but from microscopic scales that reflect light.",
        "timeCreated": new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        "location": "Amazon Rainforest",
        "rarity": "legendary",
        "tradeStatus": false,
        "infoLink": "https://nature-cards-eight.vercel.app/blue-morpho",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Blue_morpho_butterfly.jpg/800px-Blue_morpho_butterfly.jpg",
        "family": "Nymphalidae",
        "username": "rainforest_guide"
      },
      {
        "id": "card-9",
        "creator": 9,
        "owner": 3,
        "commonName": "Tiger Swallowtail",
        "scientificName": "Papilio glaucus",
        "funFact": "Tiger swallowtails are named for the black 'tiger stripes' on their yellow wings, and their caterpillars resemble bird droppings as a defense mechanism.",
        "timeCreated": new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        "location": "Eastern United States",
        "rarity": "common",
        "tradeStatus": false,
        "infoLink": "https://nature-cards-eight.vercel.app/tiger-swallowtail",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Papilio_glaucus_female_Facing_Left_2000px.jpg/800px-Papilio_glaucus_female_Facing_Left_2000px.jpg",
        "family": "Papilionidae",
        "username": "butterfly_enthusiast"
      }
    ]
  }
};

// Function to simulate fetching gallery data from backend (no user specified - returns default user)
export async function fetchGalleryData(): Promise<GalleryResponse> {
  // Simulate network delay and return default user
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsersGalleryData["12345"]);
    }, 1000);
  });
}

// Function to fetch gallery data for a specific user ID
export async function fetchUserGalleryData(userId: string): Promise<GalleryResponse> {
  // Simulate network delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if the user exists in our mock data
      if (mockUsersGalleryData[userId]) {
        resolve(mockUsersGalleryData[userId]);
      } else {
        // If user not found, return the default user data
        console.warn(`User ID ${userId} not found, returning default user gallery`);
        resolve(mockUsersGalleryData["12345"]);
      }
    }, 1000);
  });
}

// Function to fetch a single card's details
export async function fetchCardDetails(cardId: string): Promise<Card | null> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Search for the card across all users
      for (const userId in mockUsersGalleryData) {
        const card = mockUsersGalleryData[userId].cards.find(card => card.id === cardId);
        if (card) {
          resolve(card);
          return;
        }
      }
      resolve(null);
    }, 500);
  });
}

// Function to sort cards by different criteria
export type SortOption = "name" | "date" | "rarity";

export function sortCards(cards: Card[], sortBy: SortOption): Card[] {
  const sortedCards = [...cards];
  
  switch(sortBy) {
    case "name":
      return sortedCards.sort((a, b) => a.commonName.localeCompare(b.commonName));
    case "date":
      return sortedCards.sort((a, b) => new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime());
    case "rarity":
      // Define rarity order
      const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
      return sortedCards.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
    default:
      return sortedCards;
  }
} 