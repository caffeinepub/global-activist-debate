import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';
import { useCreatePost } from '../hooks/useQueries';
import { SectionType } from '../backend';
import { ExternalBlob } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface CreatePostFormProps {
  section: SectionType;
}

export default function CreatePostForm({ section }: CreatePostFormProps) {
  const { identity } = useInternetIdentity();
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const createPost = useCreatePost();

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    let media: ExternalBlob | null = null;
    if (mediaFile) {
      const arrayBuffer = await mediaFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      media = ExternalBlob.fromBytes(uint8Array);
    }

    await createPost.mutateAsync({
      content: content.trim(),
      media,
      section,
    });

    setContent('');
    setMediaFile(null);
    setMediaPreview(null);
  };

  if (!identity) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Please log in to create posts.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label>Media (Optional)</Label>
            {mediaPreview && (
              <div className="mb-2">
                <img src={mediaPreview} alt="Preview" className="rounded-lg max-h-48 object-cover" />
              </div>
            )}
            <label htmlFor="media-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors w-fit">
                <Upload className="h-4 w-4" />
                <span className="text-sm">Upload Image</span>
              </div>
              <input id="media-upload" type="file" accept="image/*" onChange={handleMediaChange} className="hidden" />
            </label>
          </div>

          <Button type="submit" disabled={!content.trim() || createPost.isPending}>
            {createPost.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              'Post'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
