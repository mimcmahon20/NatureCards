/**
 * API Adapter
 * 
 * This module handles data conversion between backend MongoDB format and frontend type format
 * It helps standardize data access across the application
 */

import { Card, User, GalleryResponse, ObjectId } from '@/types';
import { getUserById as getMockUserById, getCardById, generateMockId } from './mock-db';

/**
 * Convert snake_case MongoDB card fields to camelCase for frontend use
 */
export function convertCardFromDB(dbCard: any): Card {
  return {
    creator: dbCard.creator.$oid || dbCard.creator,
    owner: dbCard.owner.$oid || dbCard.owner,
    commonName: dbCard.common_name,
    scientificName: dbCard.scientific_name,
    funFact: dbCard.fun_fact,
    timeCreated: dbCard.time_created.$date || dbCard.time_created,
    location: dbCard.location,
    rarity: dbCard.rarity,
    tradeStatus: dbCard.trade_status,
    infoLink: dbCard.info_link,
    image: dbCard.image_link,
    id: dbCard._id?.$oid || dbCard._id || generateCardId(),
    // These fields may be added later in the frontend
    family: dbCard.family || '',
    username: dbCard.username || ''
  };
}

/**
 * Convert camelCase frontend card to snake_case for MongoDB storage
 */
export function convertCardToDB(card: Card): any {
  return {
    creator: card.creator,
    owner: card.owner,
    common_name: card.commonName,
    scientific_name: card.scientificName,
    fun_fact: card.funFact,
    time_created: card.timeCreated,
    location: card.location,
    rarity: card.rarity,
    trade_status: card.tradeStatus,
    info_link: card.infoLink,
    image_link: card.image
  };
}

/**
 * Convert a MongoDB user document to our frontend User type
 */
export function convertUserFromDB(dbUser: any): User {
  return {
    _id: dbUser._id.$oid || dbUser._id,
    username: dbUser.username,
    email: dbUser.email,
    cards: dbUser.cards?.map(convertCardFromDB) || [],
    pendingFriends: dbUser.pending_friends?.map((pf: any) => ({
      sending: pf.sending.$oid || pf.sending,
      receiving: pf.receiving.$oid || pf.receiving
    })) || [],
    friends: dbUser.friends?.map((f: any) => f.$oid || f) || [],
    trading: dbUser.trading?.map((t: any) => ({
      offeredCard: convertCardFromDB(t.offeredCard),
      requestedCard: convertCardFromDB(t.requestedCard)
    })) || []
  };
}

/**
 * Convert a MongoDB user document to a GalleryResponse for the gallery view
 */
export function convertUserToGalleryResponse(dbUser: any): GalleryResponse {
  return {
    _id: dbUser._id.$oid || dbUser._id,
    username: dbUser.username,
    cards: dbUser.cards?.map(convertCardFromDB) || []
  };
}

/**
 * Generate a unique ID for a card if one doesn't exist
 */
function generateCardId(): string {
  return `card-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * Fetch a user by their ObjectId
 */
export async function fetchUserById(userId: ObjectId): Promise<User> {
  try {
    // Mock implementation using our mock database
    const user = getMockUserById(userId);
    
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

/**
 * Fetch a user's gallery data by their ObjectId
 */
export async function fetchUserGallery(userId: ObjectId): Promise<GalleryResponse> {
  try {
    // TODO: Replace with actual API call
    // This is a mock implementation
    const response = await fetch(`/api/users/${userId}/gallery`);
    if (!response.ok) {
      throw new Error(`Failed to fetch gallery: ${response.statusText}`);
    }
    const userData = await response.json();
    return convertUserToGalleryResponse(userData);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    throw error;
  }
} 