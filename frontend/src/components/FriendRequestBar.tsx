import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FriendRequest, handleProfileClick, handleAcceptFriend, handleDeclineFriend } from "@/lib/social";

interface FriendRequestBarProps {
  friend_request: FriendRequest;
}

export function FriendRequestBar({ friend_request }: FriendRequestBarProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="flex-1 p-4">
          <div className="flex items-center">
            <Avatar className="w-12 h-12 mr-4">
              <AvatarImage src={friend_request.profile_image} alt={friend_request.username} />
            </Avatar>
            <CardContent className="flex-1 p-0">
              <p className="font-medium">{friend_request.username}</p>
            </CardContent>
          </div>
        </div>
        <div className="flex items-center justify-end p-4 bg-gray-50 border-t sm:border-t-0 sm:border-l">
          {friend_request.sender_id == "12345" ? (
            <div className="flex flex-row gap-2">
              <Button variant="outline" size="sm" onClick={() => handleProfileClick(friend_request._id)}>
                View Profile
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleAcceptFriend(friend_request._id)}>
                Accept
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDeclineFriend(friend_request._id)}>
                Decline
              </Button>
            </div>
          ) : (
            <Button variant="disabled" size="sm">
              Friend Request Sent
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
