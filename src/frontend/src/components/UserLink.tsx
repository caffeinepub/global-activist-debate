import { Principal } from '@icp-sdk/core/principal';
import { useNavigate } from '@tanstack/react-router';
import { useGetUserProfile } from '../hooks/useQueries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface UserLinkProps {
  userId: Principal;
  showAvatar?: boolean;
}

export default function UserLink({ userId, showAvatar = true }: UserLinkProps) {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useGetUserProfile(userId);

  if (isLoading) {
    return <Skeleton className="h-5 w-24" />;
  }

  const displayName = profile?.username || userId.toString().slice(0, 8) + '...';

  return (
    <button
      onClick={() => navigate({ to: '/profile/$userId', params: { userId: userId.toString() } })}
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      {showAvatar && (
        <Avatar className="h-6 w-6">
          {profile?.avatar && <AvatarImage src={profile.avatar.getDirectURL()} />}
          <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      <span className="font-semibold text-sm">{displayName}</span>
    </button>
  );
}
