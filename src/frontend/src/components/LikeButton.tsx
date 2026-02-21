import { Principal } from '@icp-sdk/core/principal';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useLikePost, useUnlikePost } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { cn } from '@/lib/utils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import UserLink from './UserLink';

interface LikeButtonProps {
  postId: bigint;
  likes: Principal[];
}

export default function LikeButton({ postId, likes }: LikeButtonProps) {
  const { identity } = useInternetIdentity();
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();

  const isLiked = identity ? likes.some((p) => p.toString() === identity.getPrincipal().toString()) : false;

  const handleLike = async () => {
    if (!identity) return;

    if (isLiked) {
      await unlikePost.mutateAsync(postId);
    } else {
      await likePost.mutateAsync(postId);
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={!identity || likePost.isPending || unlikePost.isPending}
          className={cn('gap-2', isLiked && 'text-red-500')}
        >
          <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
          {likes.length}
        </Button>
      </HoverCardTrigger>
      {likes.length > 0 && (
        <HoverCardContent className="w-64">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Liked by</h4>
            <div className="space-y-1">
              {likes.slice(0, 5).map((userId) => (
                <div key={userId.toString()}>
                  <UserLink userId={userId} />
                </div>
              ))}
              {likes.length > 5 && <p className="text-xs text-muted-foreground">and {likes.length - 5} more...</p>}
            </div>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
}
