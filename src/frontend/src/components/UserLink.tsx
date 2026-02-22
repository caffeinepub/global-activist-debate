import { Link } from '@tanstack/react-router';
import { Principal } from '@icp-sdk/core/principal';
import { useGetUserProfile } from '../hooks/useQueries';
import UserAvatar from './UserAvatar';
import { Skeleton } from '@/components/ui/skeleton';

interface UserLinkProps {
  userId: Principal;
  showAvatar?: boolean;
}

export default function UserLink({ userId, showAvatar = true }: UserLinkProps) {
  const { data: profile, isLoading } = useGetUserProfile(userId);

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-2">
        {showAvatar && <Skeleton className="h-8 w-8 rounded-full" />}
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  if (!profile) {
    return (
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        {showAvatar && <div className="h-8 w-8 rounded-full bg-muted" />}
        <span>Unknown User</span>
      </span>
    );
  }

  return (
    <Link
      to="/profile/$userId"
      params={{ userId: userId.toString() }}
      className="inline-flex items-center gap-2 hover:underline font-medium"
    >
      {showAvatar && <UserAvatar username={profile.username} size="small" />}
      <span>{profile.username}</span>
    </Link>
  );
}
