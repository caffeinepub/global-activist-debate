import { Conversation } from '../backend';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSendMessage } from '../hooks/useQueries';
import UserLink from './UserLink';
import DebateStyleBadge from './DebateStyleBadge';
import { useGetUserProfile } from '../hooks/useQueries';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MessageThreadProps {
  conversation: Conversation;
}

export default function MessageThread({ conversation }: MessageThreadProps) {
  const [messageContent, setMessageContent] = useState('');
  const sendMessage = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;

    await sendMessage.mutateAsync({
      conversationId: conversation.id,
      content: messageContent.trim(),
    });
    setMessageContent('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Participants:</span>
          {conversation.participants.map((p) => (
            <MessageParticipant key={p.toString()} userId={p} />
          ))}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {conversation.messages.map((message) => {
            const timestamp = new Date(Number(message.timestamp) / 1000000);
            return (
              <div key={message.id.toString()} className="space-y-1">
                <div className="flex items-center gap-2">
                  <UserLink userId={message.author} />
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(timestamp, { addSuffix: true })}
                  </span>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t space-y-2">
        <Textarea
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type your message..."
          rows={3}
        />
        <Button type="submit" disabled={!messageContent.trim() || sendMessage.isPending}>
          {sendMessage.isPending ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  );
}

function MessageParticipant({ userId }: { userId: any }) {
  const { data: profile } = useGetUserProfile(userId);

  return (
    <div className="flex items-center gap-2">
      <UserLink userId={userId} />
      {profile && <DebateStyleBadge style={profile.debateStyle} />}
    </div>
  );
}
