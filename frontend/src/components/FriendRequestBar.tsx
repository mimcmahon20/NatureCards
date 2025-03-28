import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Friend, handleProfileClick, handleAcceptFriend, handleDeclineFriend } from "@/lib/social";

interface FriendRequestBarProps {
  friend: Friend;
}

export function FriendRequestBar({ friend }: FriendRequestBarProps) {
  return (
    <Card className="flex items-center p-4">
      <Avatar className="w-12 h-12 mr-4">
        <AvatarImage src={friend.profile_image} alt={friend.username} />
      </Avatar>
      <CardContent className="flex-1">
        <p className="font-medium">{friend.username}</p>
      </CardContent>
      <Button variant="outline" size="sm" onClick={() => handleProfileClick(friend._id)}>
        View Profile
      </Button>
      <Button variant="outline" size="sm" style={{ marginLeft: '12px' }} onClick={() => handleAcceptFriend(friend._id)}>
        Accept Friend Request
      </Button>
      <Button variant="outline" size="sm" style={{ marginLeft: '12px' }} onClick={() => handleDeclineFriend(friend._id)}>
        Decline Friend Request
      </Button>
    </Card>
  );
}
