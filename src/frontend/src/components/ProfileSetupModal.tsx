import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { DebateStyle } from '../backend';
import { Loader2 } from 'lucide-react';

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const { identity } = useInternetIdentity();
  const saveProfile = useSaveCallerUserProfile();

  const [username, setUsername] = useState('');
  const [interests, setInterests] = useState('');
  const [debateStyle, setDebateStyle] = useState<DebateStyle>(DebateStyle.civil);
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [pinterest, setPinterest] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity || !username.trim()) {
      return;
    }

    const interestsArray = interests
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const socialMedia =
      facebook || twitter || instagram || pinterest
        ? {
            facebook: facebook || undefined,
            twitter: twitter || undefined,
            instagram: instagram || undefined,
            pinterest: pinterest || undefined,
          }
        : undefined;

    await saveProfile.mutateAsync({
      id: identity.getPrincipal(),
      username: username.trim(),
      interests: interestsArray,
      debateStyle,
      socialMedia,
    });
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Welcome! Set Up Your Profile</DialogTitle>
          <DialogDescription>Tell us about yourself to get started on the platform.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <Label htmlFor="interests">Interests (comma-separated)</Label>
              <Textarea
                id="interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g., Climate Change, Human Rights, Education"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="debateStyle">Debate Style</Label>
              <Select value={debateStyle} onValueChange={(value) => setDebateStyle(value as DebateStyle)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DebateStyle.civil}>Civil</SelectItem>
                  <SelectItem value={DebateStyle.aggressive}>Aggressive</SelectItem>
                  <SelectItem value={DebateStyle.creative}>Creative</SelectItem>
                  <SelectItem value={DebateStyle.random}>Random</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Social Media Links (optional)</Label>
              <Input
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="Facebook URL"
              />
              <Input
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="Twitter/X URL"
              />
              <Input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Instagram URL"
              />
              <Input
                value={pinterest}
                onChange={(e) => setPinterest(e.target.value)}
                placeholder="Pinterest URL"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={saveProfile.isPending || !username.trim()}>
            {saveProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Profile
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
