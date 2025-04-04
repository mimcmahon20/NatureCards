"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, CheckCircle, XCircle, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Card as CardType } from "@/types";
import { handleAcceptTrade, handleDeclineTrade, TradeRequest } from "@/lib/social";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useToast } from '@/components/ui/toast';
import { mockFetchCardDetails } from "@/lib/mock-trade-data";

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
  s_rarity,
  s_cardId,

  r_name,
  r_image,
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
  const [tradeStatus, setTradeStatus] = useState<'pending' | 'accepted' | 'declined'>('pending');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toast = useToast();

  // Check if current user is the sender (using placeholder "12345" as user ID)
  const isCurrentUserSender = senderId === "12345";

  const handleOpenDrawer = async () => {
    setDrawerOpen(true);
    setIsLoading(true);
    
    try {
      // Use mockFetchCardDetails for testing instead of real API
      const [sCard, rCard] = await Promise.all([
        mockFetchCardDetails(s_cardId),
        mockFetchCardDetails(r_cardId)
      ]);
      
      setSenderCard(sCard);
      console.log(senderCard);
      setRecipientCard(rCard);
      console.log(recipientCard);
    } catch (error) {
      console.error("Error fetching card details:", error);
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

  // Function to render a single card preview
  const renderCardPreview = (
    name: string,
    image: string,
    colors: ReturnType<typeof getColors>,
    side: 'sender' | 'recipient'
  ) => (
    <div 
      className={`rounded-lg border-2 ${colors.border} overflow-hidden cursor-pointer hover:shadow-md transition-shadow shadow-lg w-[120px] sm:w-[160px]`}
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

  const acceptTrade = async () => {
    if (tradeActionLoading) return;
    
    setTradeActionLoading(true);
    
    try {
      // Create a trade request object from our props
      const tradeRequest: TradeRequest = {
        _id: tradeId,
        sender_id: senderId,
        recipient_id: recipientId,
        sender_username: senderUsername,
        recipient_username: recipientUsername,
        profile_image: '', // Not used in this flow
        sender_card_id: s_cardId,
        recipient_card_id: r_cardId
      };
      
      // Call the API to accept the trade
      const success = await handleAcceptTrade(tradeRequest);
      
      if (success) {
        // Update local state
        setTradeStatus('accepted');
        
        // Show success toast
        toast.open(
          <div>
            <div className="font-medium">Trade Accepted</div>
            <div className="text-sm">
              The trade has been completed successfully!
            </div>
          </div>,
          { variant: "success", duration: 5000 }
        );
        
        // Notify parent component
        if (onTradeComplete) {
          onTradeComplete(tradeId, 'accepted');
        }
        
        // Close drawer after a short delay
        setTimeout(() => {
          setDrawerOpen(false);
        }, 1500);
      } else {
        // Show error toast
        toast.open(
          <div>
            <div className="font-medium">Error</div>
            <div className="text-sm">
              There was a problem completing the trade. Please try again.
            </div>
          </div>,
          { variant: "destructive", duration: 5000 }
        );
      }
    } catch (error) {
      console.error("Error accepting trade:", error);
      
      // Show error toast
      toast.open(
        <div>
          <div className="font-medium">Error</div>
          <div className="text-sm">
            An unexpected error occurred. Please try again later.
          </div>
        </div>,
        { variant: "destructive", duration: 5000 }
      );
    } finally {
      setTradeActionLoading(false);
    }
  };

  const declineTrade = async () => {
    if (tradeActionLoading) return;
    
    setTradeActionLoading(true);
    
    try {
      // Call the API to decline the trade
      const success = await handleDeclineTrade(tradeId);
      
      if (success) {
        // Update local state
        setTradeStatus('declined');
        
        // Show success toast
        toast.open(
          <div>
            <div className="font-medium">Trade Declined</div>
            <div className="text-sm">
              You&apos;ve declined this trade request.
            </div>
          </div>,
          { variant: "default", duration: 5000 }
        );
        
        // Notify parent component
        if (onTradeComplete) {
          onTradeComplete(tradeId, 'declined');
        }
        
        // Close drawer after a short delay
        setTimeout(() => {
          setDrawerOpen(false);
        }, 1500);
      } else {
        // Show error toast
        toast.open(
          <div>
            <div className="font-medium">Error</div>
            <div className="text-sm">
              There was a problem declining the trade. Please try again.
            </div>
          </div>,
          { variant: "destructive", duration: 5000 }
        );
      }
    } catch (error) {
      console.error("Error declining trade:", error);
      
      // Show error toast
      toast.open(
        <div>
          <div className="font-medium">Error</div>
          <div className="text-sm">
            An unexpected error occurred. Please try again later.
          </div>
        </div>,
        { variant: "destructive", duration: 5000 }
      );
    } finally {
      setTradeActionLoading(false);
    }
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button onClick={handleOpenDrawer} variant="outline" size="sm">
          View Trade
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-2 sm:px-4 pb-6">
        <div className="mt-4 sm:mt-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-2 sm:mb-4 text-center">Trade Details</h3>
          
          {isLoading ? (
            <div className="flex justify-center my-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-1 sm:gap-4 mb-4 w-full place-items-center">
                <div className="flex flex-col items-center w-full">
                  <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 truncate max-w-[120px] sm:max-w-[160px] text-center">
                    {isCurrentUserSender ? "Your Card" : `${senderUsername}'s Card`}
                  </p>
                  {renderCardPreview(s_name, s_image, getColors(s_rarity), 'sender')}
                </div>
                
                <div className="flex flex-col gap-1 text-gray-400 px-1">
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>

                <div className="flex flex-col items-center w-full">
                  <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 truncate max-w-[120px] sm:max-w-[160px] text-center">
                    {isCurrentUserSender ? `${recipientUsername}'s Card` : "Your Card"}
                  </p>
                  {renderCardPreview(r_name, r_image, getColors(r_rarity), 'recipient')}
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4 text-center">
                {isCurrentUserSender 
                  ? `You offered this trade to ${recipientUsername}`
                  : `${senderUsername} offered this trade to you`}
              </p>
              
              {/* Actions only show if user is recipient and trade is still pending */}
              {!isCurrentUserSender && tradeStatus === 'pending' && (
                <div className="flex justify-center gap-3 mb-4">
                  <Button 
                    onClick={acceptTrade} 
                    className="gap-1" 
                    disabled={tradeActionLoading}
                  >
                    {tradeActionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Accept Trade
                  </Button>
                  <Button 
                    onClick={declineTrade} 
                    variant="outline" 
                    className="text-red-500 gap-1 border-red-200 hover:border-red-300 hover:text-red-600"
                    disabled={tradeActionLoading}
                  >
                    {tradeActionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    Decline
                  </Button>
                </div>
              )}
              
              {/* Status message for completed trades */}
              {tradeStatus === 'accepted' && (
                <div className="text-center text-green-600 font-medium flex items-center justify-center gap-1 mb-4">
                  <CheckCircle className="h-4 w-4" />
                  Trade accepted successfully!
                </div>
              )}
              
              {tradeStatus === 'declined' && (
                <div className="text-center text-gray-500 flex items-center justify-center gap-1 mb-4">
                  <XCircle className="h-4 w-4" />
                  Trade declined
                </div>
              )}
            </>
          )}
          
          <div className="flex justify-center mt-2">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
