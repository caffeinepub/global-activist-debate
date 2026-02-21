import { Post } from '../backend';
import PostCard from './PostCard';

interface PostFeedProps {
  posts: Post[];
  showPinnedFirst?: boolean;
}

export default function PostFeed({ posts, showPinnedFirst = false }: PostFeedProps) {
  const sortedPosts = showPinnedFirst
    ? [...posts].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return Number(b.timestamp - a.timestamp);
      })
    : [...posts].sort((a, b) => Number(b.timestamp - a.timestamp));

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No posts yet. Be the first to start a discussion!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedPosts.map((post) => (
        <PostCard key={post.id.toString()} post={post} />
      ))}
    </div>
  );
}
