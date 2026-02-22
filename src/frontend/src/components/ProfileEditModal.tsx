import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { UserProfile, DebateStyle } from '../backend';
import { Loader2 } from 'lucide-react';

interface ProfileEditModalProps {
  open: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
}

export default function ProfileEditModal({ open, onClose, currentProfile }: ProfileEditModalProps) {
  const { identity } = useInternetIdentity();
  const saveProfile = useSaveCallerUserProfile();

  const [username, setUsername] = useState('');
  const [interests, setInterests] = useState('');
  const [debateStyle, setDebateStyle] = useState<DebateStyle>(DebateStyle.civil);
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [pinterest, setPinterest] = useState('');

  useEffect(() => {
    if (currentProfile) {
      setUsername(currentProfile.username);
      setInterests(currentProfile.interests.join(', '));
      setDebateStyle(currentProfile.debateStyle);
      setFacebook(currentProfile.socialMedia?.facebook || '');
      setTwitter(currentProfile.socialMedia?.twitter || '');
      setInstagram(currentProfile.socialMedia?.instagram || '');
      setPinterest(currentProfile.socialMedia?.pinterest || '');
    }
  }, [currentProfile]);

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

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
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

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={saveProfile.isPending || !username.trim()}>
              {saveProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
