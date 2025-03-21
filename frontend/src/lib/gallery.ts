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

// Mock data for gallery
const mockGalleryData: GalleryResponse = {
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
      "image": "https://hips.hearstapps.com/hmg-prod/images/close-up-of-blossoming-rose-flower-royalty-free-image-1580853844.jpg?crop=0.668xw:1.00xh;0.248xw,0&resize=980:*",
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
      "image": "https://hips.hearstapps.com/hmg-prod/images/close-up-of-blossoming-rose-flower-royalty-free-image-1580853844.jpg?crop=0.668xw:1.00xh;0.248xw,0&resize=980:*",
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
      "image": "https://hips.hearstapps.com/hmg-prod/images/close-up-of-blossoming-rose-flower-royalty-free-image-1580853844.jpg?crop=0.668xw:1.00xh;0.248xw,0&resize=980:*",
      "family": "Droseraceae",
      "username": "carnivorous_plant_lover"
    }
  ]
};

// Function to simulate fetching gallery data from backend
export async function fetchGalleryData(): Promise<GalleryResponse> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockGalleryData);
    }, 1000);
  });
}

// Function to fetch a single card's details
export async function fetchCardDetails(cardId: string): Promise<Card | null> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const card = mockGalleryData.cards.find(card => card.id === cardId);
      resolve(card || null);
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