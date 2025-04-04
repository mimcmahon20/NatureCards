import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FriendRequest, handleProfileClick, handleAcceptFriend, handleDeclineFriend } from "@/lib/social";

interface FriendRequestBarProps {
  friend_request: FriendRequest;
}

export function FriendRequestBar({ friend_request }: FriendRequestBarProps) {
  return (
    <Card className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4">
      <div className="flex items-center w-full">
        <Avatar className="w-12 h-12 mr-4">
          <AvatarImage src={friend_request.profile_image} alt={friend_request.username} />
        </Avatar>
        <CardContent className="flex-1 p-0">
          <p className="font-medium">{friend_request.username}</p>
        </CardContent>
      </div>
      {friend_request.sender_id == "12345" ? (
        <div className="flex flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => handleProfileClick(friend_request._id)}>
            View Profile
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => handleAcceptFriend(friend_request._id)}>
            Accept
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => handleDeclineFriend(friend_request._id)}>
            Decline
          </Button>
        </div>
      ) : (
        <Button variant="disabled" size="sm">
          Friend Request Sent
        </Button>
      )
      }
    </Card>
  );
}
