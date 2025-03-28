// Import types from the types directory
import { CardPost, FeedResponse, Card } from '@/types';
import { getUserById, getAllUsers, generateFeedForUser } from './mock-db';
import { createPostFromUserCards } from './feed-adapter';

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
      const userCardMap = new Map<string, Card[]>();
      
      // First add the current user's cards
      userCardMap.set(currentUser._id, []);
      
      // Then add cards from friends
      feedCards.forEach(card => {
        if (!userCardMap.has(card.owner)) {
          userCardMap.set(card.owner, []);
        }
        userCardMap.get(card.owner)?.push(card);
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
      
      // Get the user's feed but don't use it directly
      // Instead we create a single post from the user's basic info
      generateFeedForUser(userId); // Call this but don't store result to avoid linter warning
      
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