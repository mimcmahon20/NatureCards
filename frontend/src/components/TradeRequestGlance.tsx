"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { Star, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { fetchCardDetails } from "@/lib/gallery";
import { Card as CardType } from "@/types";
import { CardDetailed } from "./CardDetailed";
import { handleAcceptTrade, handleDeclineTrade, TradeRequest } from "@/lib/social";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { rarityToStars } from '@/types';
import { useToast } from '@/components/ui/toast';

// s_ = sender card, r_ = recipient card. 
// The end user can own either the s_ or r_ card depending on who sent the trade request.
interface TradeRequestCardGlanceProps {
  // Sender card details
  s_name: string;
  s_image: string;
  s_rating: number;
  s_rarity: "common" | "rare" | "epic" | "legendary";
  s_cardId: string;

  // Recipient card details
  r_name: string;
  r_image: string;
  r_rating: number;
  r_rarity: "common" | "rare" | "epic" | "legendary";
  r_cardId: string;
  
  // Trade data
  tradeId: string;
  senderId: string;
  recipientId: string;
  senderUsername: string;
  recipientUsername: string;
  
  // Callback when trade is completed (accepted or declined)
  onTradeComplete?: (tradeId: string, status: 'accepted' | 'declined') => void;
}

export function TradeRequestGlance({
  s_name,
  s_image,
  s_rating,
  s_rarity,
  s_cardId,

  r_name,
  r_image,
  r_rating,
  r_rarity,
  r_cardId,

  tradeId,
  senderId,
  recipientId,
  senderUsername,
  recipientUsername,

  onTradeComplete,
}: TradeRequestCardGlanceProps) {
  const [senderCard, setSenderCard] = useState<CardType | null>(null);
  const [recipientCard, setRecipientCard] = useState<CardType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCardView, setActiveCardView] = useState<'sender' | 'recipient' | null>(null);
  const [tradeActionLoading, setTradeActionLoading] = useState(false);
  const [tradeStatus, setTradeStatus] = useState<'pending' | 'accepted' | 'declined' | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toast = useToast();

  // Determine if the current user is the sender (for conditionally showing accept/decline buttons)
  const isUserSender = senderId === "12345"; // Replace with actual user ID in a real implementation

  // Fetch card details when drawer is opened
  const handleOpenDrawer = async () => {
    setIsLoading(true);
    setActiveCardView('sender'); // Default to showing sender card first
    
    try {
      // Fetch sender card details
      const senderCardDetails = await fetchCardDetails(s_cardId);
      setSenderCard(senderCardDetails);
      
      // Fetch recipient card details
      const recipientCardDetails = await fetchCardDetails(r_cardId);
      setRecipientCard(recipientCardDetails);
    } catch (error) {
      console.error('Error fetching card details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine colors based on rarity
  const getColors = (rarity: string) => {
    switch (rarity) {
      case "common":
        return {
          border: "border-[#1a4e8c]", // Blue border
          bg: "bg-[#d8e6f3]", // Light blue background
          star: "text-[#1a4e8c]", // Blue stars
          header: "bg-[#d8e6f3]", // Light blue header
          rarityLevel: 1, // 1 star filled
        };
      case "rare":
        return {
          border: "border-[#2e7d32]", // Green border
          bg: "bg-[#e8f5e9]", // Light green background
          star: "text-[#2e7d32]", // Green stars
          header: "bg-[#e8f5e9]", // Light green header
          rarityLevel: 2, // 2 stars filled
        };
      case "epic":
        return {
          border: "border-[#6a4c93]", // Purple border
          bg: "bg-[#e7e0f4]", // Light purple background
          star: "text-[#6a4c93]", // Purple stars
          header: "bg-[#e7e0f4]", // Light purple header
          rarityLevel: 3, // 3 stars filled
        };
      case "legendary":
        return {
          border: "border-[#8b5a2b]", // Brown/gold border
          bg: "bg-[#f9f3e0]", // Light cream/gold background
          star: "text-[#8b5a2b]", // Brown/gold stars
          header: "bg-[#f9f3e0]", // Light cream/gold header
          rarityLevel: 4, // 4 stars filled
        };
      default:
        return {
          border: "border-gray-300",
          bg: "bg-gray-50",
          star: "text-gray-400",
          header: "bg-gray-50",
          rarityLevel: 0,
        };
    }
  };

  const s_colors = getColors(s_rarity);
  const r_colors = getColors(r_rarity);

  // Function to render a single card preview
  const renderCardPreview = (
    name: string,
    image: string,
    colors: ReturnType<typeof getColors>,
    side: 'sender' | 'recipient'
  ) => (
    <div 
      className={`rounded-lg border-2 ${colors.border} overflow-hidden cursor-pointer hover:shadow-md transition-shadow shadow-lg w-full max-w-[180px]`}
      onClick={() => setActiveCardView(side)}
    >
      <div className={`p-1 sm:p-2 ${colors.border} ${colors.header}`}>
        <h3 className="text-sm font-semibold truncate">{name}</h3>
      </div>
      <div className="relative aspect-square">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 180px"
          className={`object-cover border-t-2 border-b-2 ${colors.border}`}
        />
      </div>
      <div className={`flex justify-center p-1 ${colors.bg}`}>
        {[1, 2, 3, 4].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${colors.star} ${
              star <= colors.rarityLevel
                ? "fill-current"
                : "fill-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );

  // Function to handle accepting a trade
  const acceptTrade = async () => {
    if (tradeActionLoading) return;
    
    setTradeActionLoading(true);
    
    try {
      // Create trade request object from props
      const tradeRequest: TradeRequest = {
        _id: tradeId,
        sender_id: senderId,
        recipient_id: recipientId,
        sender_username: senderUsername,
        recipient_username: recipientUsername,
        profile_image: s_image, // Using sender image as profile image
        sender_card_id: s_cardId,
        recipient_card_id: r_cardId
      };
      
      const success = await handleAcceptTrade(tradeRequest);
      
      if (success) {
        setTradeStatus('accepted');
        
        // If onTradeComplete callback is provided, call it
        if (onTradeComplete) {
          onTradeComplete(tradeId, 'accepted');
        }
        
        // Show toast notification
        toast.open(
          <div>
            <div className="font-medium">Trade Accepted</div>
            <div className="text-sm text-green-700">
              You've successfully accepted the trade with {senderUsername}
            </div>
          </div>,
          { variant: 'success', duration: 5000 }
        );
        
        // Close drawer after a short delay
        setTimeout(() => {
          setDrawerOpen(false);
        }, 3000);
      } else {
        // Handle failure case
        console.error("Failed to accept trade");
        
        // Show error toast
        toast.open(
          <div>
            <div className="font-medium">Trade Failed</div>
            <div className="text-sm">
              There was an error accepting the trade. Please try again.
            </div>
          </div>,
          { variant: 'destructive', duration: 5000 }
        );
      }
    } catch (error) {
      console.error("Error accepting trade:", error);
      
      // Show error toast
      toast.open(
        <div>
          <div className="font-medium">Trade Failed</div>
          <div className="text-sm">
            There was an error accepting the trade. Please try again.
          </div>
        </div>,
        { variant: 'destructive', duration: 5000 }
      );
    } finally {
      setTradeActionLoading(false);
    }
  };
  
  // Function to handle declining a trade
  const declineTrade = async () => {
    if (tradeActionLoading) return;
    
    setTradeActionLoading(true);
    
    try {
      const success = await handleDeclineTrade(tradeId);
      
      if (success) {
        setTradeStatus('declined');
        
        // If onTradeComplete callback is provided, call it
        if (onTradeComplete) {
          onTradeComplete(tradeId, 'declined');
        }
        
        // Show toast notification
        toast.open(
          <div>
            <div className="font-medium">Trade Declined</div>
            <div className="text-sm text-red-700">
              You've declined the trade with {senderUsername}
            </div>
          </div>,
          { variant: 'destructive', duration: 5000 }
        );
        
        // Close drawer after a short delay
        setTimeout(() => {
          setDrawerOpen(false);
        }, 3000);
      } else {
        // Handle failure case
        console.error("Failed to decline trade");
        
        // Show error toast
        toast.open(
          <div>
            <div className="font-medium">Action Failed</div>
            <div className="text-sm">
              There was an error declining the trade. Please try again.
            </div>
          </div>,
          { variant: 'destructive', duration: 5000 }
        );
      }
    } catch (error) {
      console.error("Error declining trade:", error);
      
      // Show error toast
      toast.open(
        <div>
          <div className="font-medium">Action Failed</div>
          <div className="text-sm">
            There was an error declining the trade. Please try again.
          </div>
        </div>,
        { variant: 'destructive', duration: 5000 }
      );
    } finally {
      setTradeActionLoading(false);
    }
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={(open) => {
      setDrawerOpen(open);
      if (open) handleOpenDrawer();
      if (!open) {
        setActiveCardView(null);
        // Reset trade status if drawer is closed
        if (tradeStatus === 'accepted' || tradeStatus === 'declined') {
          setTradeStatus(null);
        }
      }
    }}>
      <DrawerTrigger asChild>
        <div className="flex flex-col items-center border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
          <h3 className="text-md font-semibold mb-4">Trade Offer</h3>
          <div className="flex items-center justify-center gap-6 mb-2">
            {renderCardPreview(s_name, s_image, s_colors, 'sender')}
            <div className="text-lg font-bold">↔</div>
            {renderCardPreview(r_name, r_image, r_colors, 'recipient')}
          </div>
          <p className="text-sm text-gray-500 mt-2">Click to view details</p>
        </div>
      </DrawerTrigger>
      
      <DrawerContent className="min-h-[60vh] max-h-[90vh]">
        <div className="overflow-y-auto px-4 pb-8 h-full">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700"></div>
            </div>
          ) : (
            <div className="relative max-w-lg mx-auto pt-10">
              <DrawerClose className="absolute top-0 right-0 p-2 rounded-full bg-gray-100 hover:bg-gray-200 z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span className="sr-only">Close</span>
              </DrawerClose>
              
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Trade Details</h2>
                
                {/* Trade action status message */}
                {tradeStatus === 'accepted' && (
                  <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center justify-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Trade accepted successfully! Cards have been exchanged.</span>
                  </div>
                )}
                
                {tradeStatus === 'declined' && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center justify-center gap-2">
                    <XCircle className="h-5 w-5" />
                    <span>Trade declined. No cards were exchanged.</span>
                  </div>
                )}
                
                {/* Only show buttons if not the sender and trade is still pending */}
                {!isUserSender && tradeStatus === null && (
                  <div className="flex justify-center mt-4 space-x-3">
                    <Button 
                      onClick={acceptTrade}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={tradeActionLoading}
                    >
                      {tradeActionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Accept Trade
                    </Button>
                    <Button 
                      onClick={declineTrade}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={tradeActionLoading}
                    >
                      {tradeActionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Decline Trade
                    </Button>
                  </div>
                )}
                
                {/* Trade direction explanation */}
                <p className="text-sm text-gray-500 mt-4">
                  {isUserSender 
                    ? `You are offering your card to ${recipientUsername}` 
                    : `${senderUsername} is offering their card to you`}
                </p>
                
                <div className="flex justify-center mt-6 space-x-4">
                  <button
                    className={`px-4 py-2 rounded-md ${activeCardView === 'sender' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100'}`}
                    onClick={() => setActiveCardView('sender')}
                  >
                    {isUserSender ? 'Your Card' : `${senderUsername}'s Card`}
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md ${activeCardView === 'recipient' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100'}`}
                    onClick={() => setActiveCardView('recipient')}
                  >
                    {isUserSender ? `${recipientUsername}'s Card` : 'Your Card'}
                  </button>
                </div>
              </div>
              
              <div className="mt-6">
                {activeCardView === 'sender' && (
                  <div className="card-display">
                    {senderCard ? (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="relative h-64 w-full">
                          <Image
                            src={senderCard.image}
                            alt={senderCard.commonName}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 500px"
                            priority
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-bold">{senderCard.commonName}</h3>
                          <p className="text-sm text-gray-500">{senderCard.scientificName}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-sm font-medium mr-2">Rarity:</span>
                            <div className="flex">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <Star 
                                  key={i}
                                  className="h-4 w-4 text-yellow-400 fill-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-2 text-sm">{senderCard.funFact}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
                        <p>Loading card details...</p>
                      </div>
                    )}
                  </div>
                )}
                
                {activeCardView === 'recipient' && (
                  <div className="card-display">
                    {recipientCard ? (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="relative h-64 w-full">
                          <Image
                            src={recipientCard.image}
                            alt={recipientCard.commonName}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 500px"
                            priority
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-bold">{recipientCard.commonName}</h3>
                          <p className="text-sm text-gray-500">{recipientCard.scientificName}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-sm font-medium mr-2">Rarity:</span>
                            <div className="flex">
                              {Array.from({ length: 4 }).map((_, i) => (
                                <Star 
                                  key={i}
                                  className="h-4 w-4 text-yellow-400 fill-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-2 text-sm">{recipientCard.funFact}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
                        <p>Loading card details...</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
