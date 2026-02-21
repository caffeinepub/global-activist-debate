import { useState } from 'react';
import { useGetMyConversations } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ConversationList from '../components/ConversationList';
import MessageThread from '../components/MessageThread';
import StartConversationModal from '../components/StartConversationModal';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function MessagingPage() {
  const { identity } = useInternetIdentity();
  const { data: conversations = [], isLoading } = useGetMyConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<bigint | null>(null);
  const [showStartModal, setShowStartModal] = useState(false);

  if (!identity) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please log in to access messages.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Activist Debates</h1>
        <Button onClick={() => setShowStartModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Conversation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        {/* Conversation List */}
        <div className="md:col-span-1 overflow-y-auto border rounded-lg">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              selectedId={selectedConversationId}
              onSelect={setSelectedConversationId}
            />
          )}
        </div>

        {/* Message Thread */}
        <div className="md:col-span-2 border rounded-lg">
          {selectedConversation ? (
            <MessageThread conversation={selectedConversation} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>

      <StartConversationModal open={showStartModal} onOpenChange={setShowStartModal} />
    </div>
  );
}
