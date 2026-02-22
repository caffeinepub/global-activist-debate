import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, X } from 'lucide-react';
import { useCreatePost } from '../hooks/useQueries';
import { SectionType } from '../backend';
import { ExternalBlob } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

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

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
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

      // Clear form on success
      setContent('');
      setMediaFile(null);
      setMediaPreview(null);

      // Show success toast
      toast.success('Post created successfully!', {
        description: 'Your post has been published to the feed.',
      });

      // Optional: Scroll to top to see the new post
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    }
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
              <div className="mb-2 relative">
                <img src={mediaPreview} alt="Preview" className="rounded-lg max-h-48 object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={clearMedia}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {!mediaPreview && (
              <label htmlFor="media-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors w-fit">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Upload Image</span>
                </div>
                <input id="media-upload" type="file" accept="image/*" onChange={handleMediaChange} className="hidden" />
              </label>
            )}
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
