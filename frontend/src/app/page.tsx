"use client";

import { Card } from "@/components/ui/card";
import { Camera, Upload, Users, Search, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { identifyPlant } from "@/lib/plant-id";
import { convertToJpegBase64 } from "@/lib/image-utils";
import { CardDetailed } from "@/components/CardDetailed";
import Image from "next/image";
import { UploadButton } from "@/lib/utils";
import { userState, updateUserData, fetchUserGalleryData } from "@/lib/gallery";
import { Card as CardType } from "@/types";

// Temporary type for friends
type Friend = {
  id: string;
  name: string;
  avatar: string;
};

export default function Home() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [team, setTeam] = useState<{ name: string; members: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [identifiedPlant, setIdentifiedPlant] = useState<{
    id: string;
    name: string;
    image: string;
    rating: number;
    rarity: "common" | "rare" | "epic" | "legendary";
    commonName: string;
    scientificName: string;
    family: string;
    funFact: string;
    timePosted: string;
    location: string;
    username: string;
  } | null>(null);
  const [showIdentificationDrawer, setShowIdentificationDrawer] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Add state to track if UploadThing is working
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // Temporary mock data
  const mockFriends: Friend[] = [
    { id: "1", name: "Alex Smith", avatar: "AS" },
    { id: "2", name: "Jamie Lee", avatar: "JL" },
    { id: "3", name: "Chris Wong", avatar: "CW" },
    { id: "4", name: "Taylor Swift", avatar: "TS" },
  ];

  const filteredFriends = mockFriends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add mock invitations data
  const mockInvitations = [
    { id: "1", teamName: "Nature Explorers", invitedBy: "Alex Smith" },
    { id: "2", teamName: "Bird Watchers", invitedBy: "Jamie Lee" },
    { id: "3", teamName: "Plant Lovers", invitedBy: "Chris Wong" },
  ];

  // Determine rarity based on probability
  const determineRarity = (probability: number): "common" | "uncommon" | "rare" | "epic" | "legendary" => {
    if (probability > 0.95) return "legendary";
    if (probability > 0.9) return "epic";
    if (probability > 0.8) return "rare";
    if (probability > 0.7) return "uncommon";
    return "common";
  };

  // Determine star rating based on rarity
  const getRatingFromRarity = (rarity: string): number => {
    switch (rarity) {
      case "legendary": return 4;
      case "epic": return 3;
      case "rare": return 2;
      case "uncommon": return 1;
      default: return 1;
    }
  };

  // Add a new function to fetch an image as a Blob from a URL
  const fetchImageAsBlob = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    return await response.blob();
  };

  // Modified function to handle images from URL
  const handleImageFromUrl = async (imageUrl: string) => {
    setErrorMessage(null);
    
    try {
      // Show preview and start identification
      setCapturedImage(imageUrl);
      setIsIdentifying(true);
      
      // Fetch the image from URL and convert to blob
      const imageBlob = await fetchImageAsBlob(imageUrl);
      
      // Convert blob to File object
      const imageFile = new File([imageBlob], "uploaded-image.jpg", { type: "image/jpeg" });
      
      // Convert to base64 using existing utility
      const base64Image = await convertToJpegBase64(imageFile);
      
      // Call the Plant.id API using existing function
      const plantIdResponse = await identifyPlant(base64Image);
      
      // Process results using existing logic
      const topResult = plantIdResponse.result.classification.suggestions[0];
      
      if (!topResult) {
        throw new Error("No plant identification results found");
      }
      
      // Determine rarity based on confidence
      const rarity = determineRarity(topResult.probability);
      
      // Extract the first sentence from description for fun fact
      const getFirstSentence = (text: string | undefined): string => {
        if (!text) return "This plant was identified using AI technology!";
        
        // Match for a sentence ending with period, question mark, or exclamation point
        const sentenceMatch = text.match(/^.*?[.!?](?:\s|$)/);
        return sentenceMatch ? sentenceMatch[0].trim() : text.substring(0, 100) + "...";
      };
      
      // Generate a unique ID for the plant
      const plantId = `plant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create plant details object for CardDetailed
      const plantDetails = {
        id: plantId,
        name: topResult.name,
        image: imageUrl,
        rating: getRatingFromRarity(rarity),
        rarity: rarity === "uncommon" ? "rare" : rarity as "common" | "rare" | "epic" | "legendary",
        commonName: topResult.name,
        scientificName: topResult.details?.taxonomy?.genus 
          ? `${topResult.details.taxonomy.genus} sp.`
          : topResult.name,
        family: topResult.details?.taxonomy?.family || "Unknown",
        funFact: getFirstSentence(topResult.details?.description?.value) || 
          "This plant was identified using AI technology! No additional information is available.",
        timePosted: new Date().toLocaleDateString(),
        location: "Your location",
        username: "You"
      };
      
      console.log('Identified plant (from URL):', plantDetails);
      
      // Set the identified plant
      setIdentifiedPlant(plantDetails);
      
      // Open the drawer to show results
      setShowIdentificationDrawer(true);
    } catch (error) {
      console.error("Error during plant identification:", error);
      setErrorMessage("Failed to identify plant. Please try again.");
    } finally {
      setIsIdentifying(false);
    }
  };

  // Add a function to handle direct image upload and storage in localStorage
  const handleDirectImageUpload = async (file: File) => {
    try {
      setIsIdentifying(true);
      
      // Create URL for preview
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      
      // Convert to base64 (for both preview and upload)
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // Get base64 result
          const base64String = reader.result as string;
          
          // Process base64 for Plant.id API
          const base64Data = base64String.split(',')[1]; // Remove data URL prefix
          
          // Call Plant.id API
          const plantIdResponse = await identifyPlant(base64Data);
          
          // Process response (similar to handleImageFromUrl)
          const topResult = plantIdResponse.result.classification.suggestions[0];
          
          if (!topResult) {
            throw new Error("No plant identification results found");
          }
          
          // Store the base64 image in localStorage (only in development mode)
          if (process.env.NODE_ENV === 'development') {
            try {
              // Use a random ID as the key
              const imageKey = `plant_image_${Date.now()}`;
              localStorage.setItem(imageKey, base64String);
              console.log('Image stored in localStorage with key:', imageKey);
            } catch (error) {
              console.warn('Failed to store image in localStorage:', error);
            }
          }
          
          // Continue with the plant identification logic
          const rarity = determineRarity(topResult.probability);
          
          // Extract the first sentence from description for fun fact
          const getFirstSentence = (text: string | undefined): string => {
            if (!text) return "This plant was identified using AI technology!";
            
            const sentenceMatch = text.match(/^.*?[.!?](?:\s|$)/);
            return sentenceMatch ? sentenceMatch[0].trim() : text.substring(0, 100) + "...";
          };
          
          // Generate a unique ID for the plant
          const plantId = `plant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          // Create plant details object - matching format expected by CardDetailed component
          const plantDetails = {
            id: plantId,
            name: topResult.name,
            image: base64String, // Use base64 directly for development
            rating: getRatingFromRarity(rarity),
            rarity: rarity === "uncommon" ? "rare" : rarity,
            commonName: topResult.name,
            scientificName: topResult.details?.taxonomy?.genus 
              ? `${topResult.details.taxonomy.genus} sp.`
              : topResult.name,
            family: topResult.details?.taxonomy?.family || "Unknown",
            funFact: getFirstSentence(topResult.details?.description?.value) || 
              "This plant was identified using AI technology! No additional information is available.",
            timePosted: new Date().toLocaleDateString(),
            location: "Your location",
            username: "You"
          };
          
          console.log('Identified plant:', plantDetails);
          
          // Set the identified plant
          setIdentifiedPlant(plantDetails);
          
          // Open the drawer to show results
          setShowIdentificationDrawer(true);
        } catch (error) {
          console.error("Error during plant identification:", error);
          setErrorMessage("Failed to identify plant. Please try again.");
        } finally {
          setIsIdentifying(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error handling direct image upload:", error);
      setErrorMessage("Failed to process image. Please try again.");
      setIsIdentifying(false);
    }
  };

  // Modified handleImageCapture to use direct upload if useLocalStorage is true
  const handleImageCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      try {
        if (useLocalStorage) {
          // Use direct upload method
          await handleDirectImageUpload(file);
        } else {
          // Use the original method
          const imageUrl = URL.createObjectURL(file);
          await handleImageFromUrl(imageUrl);
        }
      } catch (error) {
        console.error("Error handling captured image:", error);
        setErrorMessage("Failed to process image. Please try again.");
        setIsIdentifying(false);
      }
    }
  };

  // Add a new function to save the identified plant as a card
  const saveCardToCollection = async () => {
    if (!identifiedPlant) return;
    
    try {
      setIsSavingCard(true);
      
      // Check if user is logged in
      if (!userState.userId) {
        throw new Error('Please log in to save cards to your collection');
      }
      
      // Get current user data
      const userData = await fetchUserGalleryData(userState.userId);
      
      // Create a new card from the identified plant
      // Ensure it matches the backend schema exactly
      const newCard: CardType = {
        creator: userState.userId,
        owner: userState.userId,
        commonName: identifiedPlant.commonName,
        scientificName: identifiedPlant.scientificName,
        funFact: identifiedPlant.funFact,
        timeCreated: new Date().toISOString(),
        location: identifiedPlant.location || 'Your location',
        rarity: identifiedPlant.rarity === 'rare' ? 'uncommon' : identifiedPlant.rarity,
        tradeStatus: false,
        infoLink: '',
        image: identifiedPlant.image, // Use the uploaded image URL
        family: identifiedPlant.family
      };
      
      console.log('Saving new card:', newCard);
      
      // Add the new card to the user's collection
      const updatedCards = [...userData.cards, newCard];
      
      // Update the user data with the new card
      const result = await updateUserData({
        _id: userData._id,
        username: userData.username,
        cards: updatedCards
      });
      
      console.log('Update result:', result);
      
      // Close the drawer and show success message
      setShowIdentificationDrawer(false);
      
      // Show success alert with view collection option
      if (confirm("Card successfully added to your collection! Would you like to view your collection?")) {
        // Redirect to gallery page
        window.location.href = '/gallery';
      }
      
    } catch (error) {
      console.error('Error saving card:', error);
      alert(error instanceof Error ? error.message : "Failed to save card");
    } finally {
      setIsSavingCard(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
      <div className="mb-8 text-center">
        {team ? (
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-bold">{team.name}</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              {team.members} team members
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 bg-transparent px-8 rounded-lg">
            <div className="flex flex-col gap-3 w-full max-w-[200px]">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    size="lg"
                    className="w-full bg-yellow-950 text-white hover:bg-yellow-950/80"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Team
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[96vh] flex justify-center items-center w-full">
                  <div className="p-4 w-full sm:w-1/3 flex flex-col h-full">
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="teamName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Team Name
                        </label>
                        <Input id="teamName" placeholder="Enter team name..." />
                      </div>

                      <div>
                        <label
                          htmlFor="searchFriends"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Add Team Members
                        </label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                          <Input
                            id="searchFriends"
                            placeholder="Search friends..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto mt-4">
                      {filteredFriends.map((friend) => (
                        <div
                          key={friend.id}
                          className="flex items-center justify-between py-3 border-b"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              {friend.avatar}
                            </div>
                            <span className="font-medium">{friend.name}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <Button className="w-full" size="lg">
                        Create Team
                      </Button>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>

              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    size="lg"
                    className="w-full bg-green-800 text-white hover:bg-green-800/80"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Join Team
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[96vh] flex justify-center items-center w-full">
                  <div className="p-4 w-full sm:w-1/3 flex flex-col h-full">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Team Invitations
                        </label>
                        <div className="flex-1 overflow-y-auto">
                          {mockInvitations.map((invitation) => (
                            <div
                              key={invitation.id}
                              className="flex items-center justify-between py-3 border-b"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {invitation.teamName}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Invited by {invitation.invitedBy}
                                </span>
                              </div>
                              <Button
                                onClick={() =>
                                  setTeam({
                                    name: invitation.teamName,
                                    members: 4,
                                  })
                                }
                                variant="default"
                                size="sm"
                              >
                                Accept
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-md mb-8 px-4">
        <div className="h-px bg-gray-200" />
      </div>

      <div className="flex items-center justify-center gap-3 sm:gap-6">
        <div className="w-36 sm:w-48 h-36 sm:h-48 cursor-pointer">
          <UploadButton
            endpoint="plantImageUploader"
            onClientUploadComplete={(res) => {
              if (res && res.length > 0) {
                // Get the URL of the uploaded file
                const uploadedFileUrl = res[0].url;
                
                if (uploadedFileUrl) {
                  // Process the uploaded image with our identification logic
                  handleImageFromUrl(uploadedFileUrl);
                } else {
                  setErrorMessage("Upload completed but no file URL was returned.");
                }
              }
            }}
            onUploadError={(error: Error) => {
              console.error("Upload error details:", error);
              // Display more detailed error information
              setErrorMessage(`Upload failed: ${error.message || 'Unknown error'}`);
              // Show alert with the error to make debugging easier
              alert(`Upload error: ${error.message || 'Unknown error'}\n\nCheck browser console for more details.`);
            }}
            appearance={{
              container: "w-full h-full",
              button: "w-full h-full p-0 m-0 bg-transparent hover:bg-transparent border-none shadow-none focus:ring-0 focus:ring-offset-0"
            }}
            content={{
              button({ ready }) {
                if (ready) return (
                  <div className="w-36 sm:w-48 h-36 sm:h-48 cursor-pointer">
                  <Card className="w-full h-full flex flex-col items-center justify-center gap-2 sm:gap-4 hover:bg-slate-100 transition-colors p-4">
                    <Upload className="w-8 h-8 sm:w-12 sm:h-12" />
                    <h2 className="text-sm sm:text-xl font-semibold text-center">
                      Upload Picture
                    </h2>
                  </Card>
                  </div>
                );
                return (
                  <Card className="w-full h-full flex flex-col items-center justify-center gap-2 sm:gap-4 hover:bg-slate-100 transition-colors p-4">
                    <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 animate-spin" />
                    <h2 className="text-sm sm:text-xl font-semibold text-center">
                      Loading...
                    </h2>
                  </Card>
                );
              },
              allowedContent() {
                return null;
              }
            }}
          />
        </div>

        <label htmlFor="cameraInput" className="w-36 sm:w-48 h-36 sm:h-48 cursor-pointer">
          <Card className="w-full h-full flex flex-col items-center justify-center gap-2 sm:gap-4 hover:bg-slate-100 transition-colors p-4">
            <Camera className="w-8 h-8 sm:w-12 sm:h-12" />
            <h2 className="text-sm sm:text-xl font-semibold text-center">
              Take Picture
            </h2>
          </Card>
        </label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageCapture}
          className="hidden"
          id="cameraInput"
        />
      </div>

      {/* Plant Identification Drawer */}
      <Drawer open={showIdentificationDrawer} onOpenChange={setShowIdentificationDrawer}>
        <DrawerContent className="min-h-[70vh] max-h-[90vh]">
          <div className="p-4 overflow-y-auto">
            {identifiedPlant && (
              <div className="max-w-md mx-auto">
                <h2 className="text-xl font-bold mb-4 text-center">Identified Plant</h2>
                <CardDetailed plant={identifiedPlant} />
                <div className="mt-4 flex justify-center">
                  <Button 
                    onClick={() => setShowIdentificationDrawer(false)}
                    className="mx-2"
                  >
                    Close
                  </Button>
                  <Button 
                    className="mx-2 bg-green-600 hover:bg-green-700"
                    onClick={saveCardToCollection}
                    disabled={isSavingCard}
                  >
                    {isSavingCard ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Add to Collection'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {capturedImage && isIdentifying && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4 text-center">
            <div className="relative w-full aspect-square max-h-[400px] rounded-lg mb-4 overflow-hidden">
              <Image
                src={capturedImage}
                alt="Captured"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                priority
                className="object-contain"
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <p className="text-lg font-medium">Identifying plant...</p>
            </div>
          </div>
        </div>
      )}

      {capturedImage && errorMessage && !isIdentifying && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full mx-4">
            <div className="relative w-full aspect-square max-h-[400px] rounded-lg mb-4 overflow-hidden">
              <Image
                src={capturedImage}
                alt="Captured"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                priority
                className="object-contain"
              />
            </div>
            <div className="text-center mb-4">
              <p className="text-red-500">{errorMessage}</p>
            </div>
            <button
              onClick={() => {
                setCapturedImage(null);
                setErrorMessage(null);
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add a mode toggle button for developers */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-2 right-2 z-10">
          <Button
            onClick={() => setUseLocalStorage(!useLocalStorage)}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {useLocalStorage ? "Using: Local Storage" : "Using: UploadThing"}
          </Button>
        </div>
      )}
    </div>
  );
}
