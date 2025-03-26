"use client";

import { Card } from "@/components/ui/card";
import { MapPin, Camera, Upload, Users, Search, Plus } from "lucide-react";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Temporary type for friends
type Friend = {
  id: string;
  name: string;
  avatar: string;
};

export default function Home() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [team, setTeam] = useState<{ name: string; members: number } | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
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
        <label htmlFor="uploadInput">
          <Card className="w-36 sm:w-48 h-36 sm:h-48 flex flex-col items-center justify-center gap-2 sm:gap-4 hover:bg-slate-100 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 sm:w-12 sm:h-12" />
            <h2 className="text-sm sm:text-xl font-semibold text-center">
              Upload Picture
            </h2>
          </Card>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageCapture}
          className="hidden"
          id="uploadInput"
        />

        <label htmlFor="cameraInput">
          <Card className="w-36 sm:w-48 h-36 sm:h-48 flex flex-col items-center justify-center gap-2 sm:gap-4 hover:bg-slate-100 transition-colors cursor-pointer">
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

      {capturedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full mx-4">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={() => setCapturedImage(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
