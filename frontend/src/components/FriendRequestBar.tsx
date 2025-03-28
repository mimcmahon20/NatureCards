import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Friend, FriendRequest, handleProfileClick, handleAcceptFriend, handleDeclineFriend } from "@/lib/social";

interface FriendRequestBarProps {
  friend_request: FriendRequest;
}

export function FriendRequestBar({ friend_request }: FriendRequestBarProps) {
  return (
    <Card className="flex items-center p-4">
      <Avatar className="w-12 h-12 mr-4">
        <AvatarImage src={friend_request.profile_image} alt={friend_request.username} />
      </Avatar>
      <CardContent className="flex-1">
        <p className="font-medium">{friend_request.username}</p>
      </CardContent>
      {friend_request.sender_id == "12345" ? ( //TODO: replace "12345" default with check for logged in user ID
        <div>
          <Button variant="outline" size="sm" onClick={() => handleProfileClick(friend_request._id)}>
            View Profile
          </Button>
          <Button variant="outline" size="sm" style={{ marginLeft: '12px' }} onClick={() => handleAcceptFriend(friend_request._id)}>
            Accept Friend Request
          </Button>
          <Button variant="outline" size="sm" style={{ marginLeft: '12px' }} onClick={() => handleDeclineFriend(friend_request._id)}>
            Decline Friend Request
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
