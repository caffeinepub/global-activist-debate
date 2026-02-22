import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { DebateStyle, AvatarCustomization, AvatarColorType, AvatarStyleType } from '../backend';
import AvatarBuilder from './AvatarBuilder';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface ProfileEditModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileEditModal({ open, onClose }: ProfileEditModalProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [username, setUsername] = useState('');
  const [interests, setInterests] = useState('');
  const [debateStyle, setDebateStyle] = useState<DebateStyle>(DebateStyle.civil);
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [pinterest, setPinterest] = useState('');
  const [avatar, setAvatar] = useState<AvatarCustomization>({
    skinTone: {
      colorId: BigInt(1),
      colorType: AvatarColorType.skinToneLevel,
    },
    hairType: {
      id: BigInt(1),
      styleType: AvatarStyleType.hair,
    },
    eyewear: undefined,
    clothing: undefined,
  });

  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username);
      setInterests(userProfile.interests.join(', '));
      setDebateStyle(userProfile.debateStyle);
      setFacebook(userProfile.socialMedia?.facebook || '');
      setTwitter(userProfile.socialMedia?.twitter || '');
      setInstagram(userProfile.socialMedia?.instagram || '');
      setPinterest(userProfile.socialMedia?.pinterest || '');
      setAvatar(userProfile.avatar);
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity || !username.trim()) return;

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
      avatar,
      interests: interestsArray,
      debateStyle,
      socialMedia,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
          <DialogDescription>Update your activist profile information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your activist name"
              required
            />
          </div>

          <div>
            <Label>Customize Your Avatar</Label>
            <AvatarBuilder value={avatar} onChange={setAvatar} />
          </div>

          <div>
            <Label htmlFor="interests">Activist Interests (comma-separated)</Label>
            <Textarea
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Climate change, human rights, education..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="debateStyle">Debate Style *</Label>
            <Select value={debateStyle} onValueChange={(value) => setDebateStyle(value as DebateStyle)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DebateStyle.civil}>Civil - Respectful discussion</SelectItem>
                <SelectItem value={DebateStyle.aggressive}>Aggressive - Heated debate</SelectItem>
                <SelectItem value={DebateStyle.creative}>Creative - Artistic expression</SelectItem>
                <SelectItem value={DebateStyle.random}>Random - Mix it up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Social Media (Optional)</Label>
            <Input
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="Facebook URL"
              type="url"
            />
            <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="Twitter/X URL" type="url" />
            <Input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="Instagram URL"
              type="url"
            />
            <Input
              value={pinterest}
              onChange={(e) => setPinterest(e.target.value)}
              placeholder="Pinterest URL"
              type="url"
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={saveProfile.isPending || !username.trim()}>
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
