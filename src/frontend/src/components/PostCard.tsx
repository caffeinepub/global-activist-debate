import { Post, SectionType } from '../backend';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pin, MessageSquare } from 'lucide-react';
import UserLink from './UserLink';
import LikeButton from './LikeButton';
import { formatDistanceToNow } from 'date-fns';
import ReplySection from './ReplySection';
import ReportButton from './ReportButton';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [showReplies, setShowReplies] = useState(false);

  const getSectionBadge = () => {
    switch (post.section) {
      case SectionType.civilDebate:
        return <Badge className="bg-activist-blue text-white">Civil Debate</Badge>;
      case SectionType.aggressiveDebate:
        return <Badge className="bg-activist-orange text-white">Aggressive Debate</Badge>;
      case SectionType.quotesPoems:
        return <Badge className="bg-activist-green text-white">Quotes & Poems</Badge>;
      case SectionType.randomDebates:
        return <Badge variant="secondary">Random Debates</Badge>;
    }
  };

  const timestamp = new Date(Number(post.timestamp) / 1000000);

  return (
    <Card className={post.pinned ? 'border-2 border-primary' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <UserLink userId={post.author} />
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{formatDistanceToNow(timestamp, { addSuffix: true })}</span>
              {getSectionBadge()}
              {post.pinned && (
                <Badge variant="outline" className="gap-1">
                  <Pin className="h-3 w-3" />
                  Pinned
                </Badge>
              )}
            </div>
          </div>
          <ReportButton reportedContent={{ __kind__: 'post', post: post.id }} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.media && (
          <img
            src={post.media.getDirectURL()}
            alt="Post media"
            className="rounded-lg max-h-96 w-full object-cover"
          />
        )}
        <div className="flex items-center gap-4 pt-2">
          <LikeButton postId={post.id} likes={post.likes} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplies(!showReplies)}
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}
          </Button>
        </div>
        {showReplies && <ReplySection post={post} />}
      </CardContent>
    </Card>
  );
}
