"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { fetchCardDetails } from "@/lib/gallery";
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
      // Fetch detailed card information for both cards
      const [sCard, rCard] = await Promise.all([
        fetchCardDetails(s_cardId),
        fetchCardDetails(r_cardId)
      ]);
      
      setSenderCard(sCard);
      setRecipientCard(rCard);
      console.log(senderCard);
      console.log(recipientCard);
    } catch (error) {
      console.error("Error fetching card details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getColors = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return { bg: "bg-amber-600", text: "text-amber-700", border: "border-amber-300" };
      case "epic":
        return { bg: "bg-purple-600", text: "text-purple-700", border: "border-purple-300" };
      case "rare":
        return { bg: "bg-blue-600", text: "text-blue-700", border: "border-blue-300" };
      case "common":
      default:
        return { bg: "bg-green-600", text: "text-green-700", border: "border-green-300" };
    }
  };

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

  const renderCardPreview = (
    name: string,
    image: string,
    colors: ReturnType<typeof getColors>,
    side: 'sender' | 'recipient'
  ) => (
    <div 
      className={`border-2 ${colors.border} rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] ${activeCardView === side ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
      onClick={() => setActiveCardView(side)}
    >
      <div className={`p-2 ${colors.bg} text-white font-medium truncate`}>
        {name}
      </div>
      <div className="relative w-full aspect-square bg-white">
        <Image
          src={image}
          alt={name}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>
    </div>
  );

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button onClick={handleOpenDrawer} variant="outline" size="sm">
          View Trade
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-6">
        <div className="mt-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-center">Trade Details</h3>
          
          {isLoading ? (
            <div className="flex justify-center my-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4 text-center">
                {isCurrentUserSender 
                  ? `You offered this trade to ${recipientUsername}`
                  : `${senderUsername} offered this trade to you`}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col">
                  <p className="text-center text-sm font-medium mb-2">
                    {isCurrentUserSender ? "Your Card" : `${senderUsername}&apos;s Card`}
                  </p>
                  {renderCardPreview(s_name, s_image, getColors(s_rarity), 'sender')}
                </div>
                
                <div className="flex flex-col">
                  <p className="text-center text-sm font-medium mb-2">
                    {isCurrentUserSender ? `${recipientUsername}&apos;s Card` : "Your Card"}
                  </p>
                  {renderCardPreview(r_name, r_image, getColors(r_rarity), 'recipient')}
                </div>
              </div>
              
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
