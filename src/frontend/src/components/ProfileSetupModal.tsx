import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload } from 'lucide-react';
import { DebateStyle } from '../backend';
import { ExternalBlob } from '../backend';

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [username, setUsername] = useState('');
  const [interests, setInterests] = useState('');
  const [debateStyle, setDebateStyle] = useState<DebateStyle>(DebateStyle.civil);
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [pinterest, setPinterest] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity || !username.trim()) return;

    let avatar: ExternalBlob | undefined;
    if (avatarFile) {
      const arrayBuffer = await avatarFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      avatar = ExternalBlob.fromBytes(uint8Array);
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
      avatar,
      interests: interestsArray,
      debateStyle,
      socialMedia,
    });
  };

  if (!showProfileSetup) return null;

  return (
    <Dialog open={showProfileSetup}>
      <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to Global Activist Debate!</DialogTitle>
          <DialogDescription>Let's set up your profile to get started.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="avatar">Profile Picture</Label>
            <div className="flex items-center gap-4">
              {avatarPreview && (
                <img src={avatarPreview} alt="Avatar preview" className="h-16 w-16 rounded-full object-cover" />
              )}
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Upload Image</span>
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
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

          <Button type="submit" className="w-full" disabled={saveProfile.isPending || !username.trim()}>
            {saveProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : (
              'Create Profile'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
