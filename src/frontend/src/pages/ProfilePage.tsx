import { useParams } from '@tanstack/react-router';
import { Principal } from '@icp-sdk/core/principal';
import { useGetUserProfile, useGetPosts } from '../hooks/useQueries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import DebateStyleBadge from '../components/DebateStyleBadge';
import FollowButton from '../components/FollowButton';
import PostFeed from '../components/PostFeed';
import { SiFacebook, SiX, SiInstagram, SiPinterest } from 'react-icons/si';

export default function ProfilePage() {
  const { userId } = useParams({ from: '/profile/$userId' });
  const principal = Principal.fromText(userId);
  const { data: profile, isLoading: profileLoading } = useGetUserProfile(principal);
  const { data: allPosts = [] } = useGetPosts();

  const userPosts = allPosts.filter((p) => p.author.toString() === userId);

  if (profileLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Profile not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    {profile.avatar && <AvatarImage src={profile.avatar.getDirectURL()} />}
                    <AvatarFallback className="text-2xl">{profile.username[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{profile.username}</CardTitle>
                    <DebateStyleBadge style={profile.debateStyle} />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FollowButton userId={principal} />

              {profile.interests.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, i) => (
                      <Badge key={i} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.socialMedia && (
                <div>
                  <h3 className="font-semibold mb-2">Social Media</h3>
                  <div className="flex gap-3">
                    {profile.socialMedia.facebook && (
                      <a
                        href={profile.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <SiFacebook className="h-5 w-5" />
                      </a>
                    )}
                    {profile.socialMedia.twitter && (
                      <a
                        href={profile.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <SiX className="h-5 w-5" />
                      </a>
                    )}
                    {profile.socialMedia.instagram && (
                      <a
                        href={profile.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <SiInstagram className="h-5 w-5" />
                      </a>
                    )}
                    {profile.socialMedia.pinterest && (
                      <a
                        href={profile.socialMedia.pinterest}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <SiPinterest className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Posts */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold">Posts by {profile.username}</h2>
          <PostFeed posts={userPosts} />
        </div>
      </div>
    </div>
  );
}
