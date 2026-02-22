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
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface StartConversationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function StartConversationModal({ open, onOpenChange }: StartConversationModalProps) {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const [usernameInput, setUsernameInput] = useState('');
  const [conversationType, setConversationType] = useState<ConversationType>(ConversationType.direct);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const startConversation = useStartConversation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity || !usernameInput.trim() || !actor) return;

    setIsLookingUp(true);
    try {
      // Look up the username to get the Principal ID
      const userId = await actor.findUserIdByUsername(usernameInput.trim());
      
      if (!userId) {
        toast.error('Username not found. Please check the username and try again.');
        setIsLookingUp(false);
        return;
      }

      const participants = [identity.getPrincipal(), userId];

      await startConversation.mutateAsync({
        participants,
        convType: conversationType,
      });

      toast.success('Conversation started!');
      setUsernameInput('');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error starting conversation:', error);
      if (error.message?.includes('not found') || error.message?.includes('Username')) {
        toast.error('Username not found. Please check the username and try again.');
      } else {
        toast.error('Failed to start conversation. Please try again.');
      }
    } finally {
      setIsLookingUp(false);
    }
  };

  const isSubmitting = isLookingUp || startConversation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
          <DialogDescription>Enter the username of the person you want to message.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter username..."
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="type">Conversation Type</Label>
            <Select
              value={conversationType}
              onValueChange={(value) => setConversationType(value as ConversationType)}
              disabled={isSubmitting}
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!usernameInput.trim() || isSubmitting || !actor}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Starting...' : 'Start Conversation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
