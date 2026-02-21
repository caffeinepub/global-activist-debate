import { Post } from '../backend';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAddReply } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import UserLink from './UserLink';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import ReportButton from './ReportButton';

interface ReplySectionProps {
  post: Post;
}

export default function ReplySection({ post }: ReplySectionProps) {
  const { identity } = useInternetIdentity();
  const [replyContent, setReplyContent] = useState('');
  const addReply = useAddReply();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    await addReply.mutateAsync({ postId: post.id, content: replyContent.trim() });
    setReplyContent('');
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      {post.replies.length > 0 && (
        <div className="space-y-3">
          {post.replies.map((reply) => {
            const timestamp = new Date(Number(reply.timestamp) / 1000000);
            return (
              <div key={reply.id.toString()} className="bg-muted/30 rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <UserLink userId={reply.author} />
                    <span className="text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <ReportButton reportedContent={{ __kind__: 'reply', reply: reply.id }} />
                </div>
                <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
              </div>
            );
          })}
        </div>
      )}

      {identity && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            rows={3}
          />
          <Button type="submit" size="sm" disabled={!replyContent.trim() || addReply.isPending}>
            {addReply.isPending ? 'Posting...' : 'Post Reply'}
          </Button>
        </form>
      )}
    </div>
  );
}
