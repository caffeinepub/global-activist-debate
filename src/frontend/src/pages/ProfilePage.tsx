import { useParams } from '@tanstack/react-router';
import { Principal } from '@icp-sdk/core/principal';
import { useGetUserProfile, useGetPosts } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit } from 'lucide-react';
import DebateStyleBadge from '../components/DebateStyleBadge';
import FollowButton from '../components/FollowButton';
import PostFeed from '../components/PostFeed';
import UserAvatar from '../components/UserAvatar';
import ProfileEditModal from '../components/ProfileEditModal';
import { SiFacebook, SiX, SiInstagram, SiPinterest } from 'react-icons/si';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useState } from 'react';

export default function ProfilePage() {
  const { userId } = useParams({ from: '/profile/$userId' });
  const principal = Principal.fromText(userId);
  const { data: profile, isLoading: profileLoading } = useGetUserProfile(principal);
  const { data: allPosts = [] } = useGetPosts();
  const { identity } = useInternetIdentity();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const userPosts = allPosts.filter((p) => p.author.toString() === userId);
  const isOwnProfile = identity?.getPrincipal().toString() === userId;

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
                <div className="flex flex-col items-center gap-4 w-full">
                  <UserAvatar username={profile.username} size="large" />
                  <div className="text-center">
                    <CardTitle className="text-2xl">{profile.username}</CardTitle>
                    <div className="mt-2">
                      <DebateStyleBadge style={profile.debateStyle} />
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.interests.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, idx) => (
                      <Badge key={idx} variant="secondary">
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

              <div className="pt-4 space-y-2">
                {isOwnProfile ? (
                  <Button onClick={() => setEditModalOpen(true)} className="w-full gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <FollowButton userId={principal} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Posts */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Posts by {profile.username}</CardTitle>
            </CardHeader>
            <CardContent>
              <PostFeed posts={userPosts} />
            </CardContent>
          </Card>
        </div>
      </div>

      {isOwnProfile && profile && (
        <ProfileEditModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          currentProfile={profile}
        />
      )}
    </div>
  );
}
