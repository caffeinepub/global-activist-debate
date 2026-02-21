import { Principal } from '@icp-sdk/core/principal';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus } from 'lucide-react';
import { useFollowUser, useUnfollowUser, useGetFollowing } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface FollowButtonProps {
  userId: Principal;
}

export default function FollowButton({ userId }: FollowButtonProps) {
  const { identity } = useInternetIdentity();
  const { data: following = [] } = useGetFollowing();
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  if (!identity || userId.toString() === identity.getPrincipal().toString()) {
    return null;
  }

  const isFollowing = following.some((p) => p.toString() === userId.toString());

  const handleFollow = async () => {
    if (isFollowing) {
      await unfollowUser.mutateAsync(userId);
    } else {
      await followUser.mutateAsync(userId);
    }
  };

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      size="sm"
      onClick={handleFollow}
      disabled={followUser.isPending || unfollowUser.isPending}
      className="gap-2"
    >
      {isFollowing ? (
        <>
          <UserMinus className="h-4 w-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
}
