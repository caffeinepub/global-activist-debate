import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStartConversation } from '../hooks/useQueries';
import { ConversationType } from '../backend';
import { Principal } from '@icp-sdk/core/principal';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

interface StartConversationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function StartConversationModal({ open, onOpenChange }: StartConversationModalProps) {
  const { identity } = useInternetIdentity();
  const [participantInput, setParticipantInput] = useState('');
  const [conversationType, setConversationType] = useState<ConversationType>(ConversationType.direct);
  const startConversation = useStartConversation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity || !participantInput.trim()) return;

    try {
      const otherPrincipal = Principal.fromText(participantInput.trim());
      const participants = [identity.getPrincipal(), otherPrincipal];

      await startConversation.mutateAsync({
        participants,
        convType: conversationType,
      });

      toast.success('Conversation started!');
      setParticipantInput('');
      onOpenChange(false);
    } catch (error) {
      toast.error('Invalid principal ID');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
          <DialogDescription>Enter the principal ID of the user you want to message.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="participant">User Principal ID</Label>
            <Input
              id="participant"
              value={participantInput}
              onChange={(e) => setParticipantInput(e.target.value)}
              placeholder="Enter principal ID..."
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Conversation Type</Label>
            <Select
              value={conversationType}
              onValueChange={(value) => setConversationType(value as ConversationType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ConversationType.direct}>Direct (1-on-1)</SelectItem>
                <SelectItem value={ConversationType.group}>Group</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!participantInput.trim() || startConversation.isPending}>
              {startConversation.isPending ? 'Starting...' : 'Start Conversation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
