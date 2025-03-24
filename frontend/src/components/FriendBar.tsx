import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Friend } from "@/lib/social";

interface FriendBarProps {
  friend: Friend;
}

export function FriendBar({ friend }: FriendBar) {
  return (
    <Card className="flex items-center p-4">
      <Avatar className="w-12 h-12 mr-4">
        <AvatarImage src={friend.profile_image} alt={friend.username} />
      </Avatar>
      <CardContent className="flex-1">
        <p className="font-medium">{friend.username}</p>
      </CardContent>
      <Button variant="outline" size="sm">
        View Profile
      </Button>
    </Card>
  );
}
