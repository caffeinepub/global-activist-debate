import { Conversation } from '../backend';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import UserLink from './UserLink';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: bigint | null;
  onSelect: (id: bigint) => void;
}

export default function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const { identity } = useInternetIdentity();

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No conversations yet. Start a new one!</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conv) => {
        const otherParticipants = conv.participants.filter(
          (p) => p.toString() !== identity?.getPrincipal().toString()
        );
        const lastMessage = conv.messages[conv.messages.length - 1];

        return (
          <Button
            key={conv.id.toString()}
            variant="ghost"
            className={cn(
              'w-full justify-start p-4 h-auto rounded-none',
              selectedId === conv.id && 'bg-accent'
            )}
            onClick={() => onSelect(conv.id)}
          >
            <div className="text-left space-y-1 w-full">
              <div className="flex items-center gap-2 flex-wrap">
                {otherParticipants.slice(0, 2).map((p) => (
                  <UserLink key={p.toString()} userId={p} showAvatar={false} />
                ))}
                {otherParticipants.length > 2 && (
                  <span className="text-xs text-muted-foreground">+{otherParticipants.length - 2} more</span>
                )}
              </div>
              {lastMessage && (
                <p className="text-xs text-muted-foreground truncate">{lastMessage.content}</p>
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );
}
