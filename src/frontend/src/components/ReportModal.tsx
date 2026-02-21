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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReportContent } from '../hooks/useQueries';
import { ReportedContent, ViolationType } from '../backend';
import { toast } from 'sonner';

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportedContent: ReportedContent;
}

export default function ReportModal({ open, onOpenChange, reportedContent }: ReportModalProps) {
  const [violationType, setViolationType] = useState<ViolationType>(ViolationType.spam);
  const [description, setDescription] = useState('');
  const reportContent = useReportContent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    await reportContent.mutateAsync({
      reportedContent,
      violationType,
      description: description.trim(),
    });

    toast.success('Report submitted successfully');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Content</DialogTitle>
          <DialogDescription>Help us maintain a safe community by reporting rule violations.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="violationType">Violation Type</Label>
            <Select value={violationType} onValueChange={(value) => setViolationType(value as ViolationType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ViolationType.spam}>Spam</SelectItem>
                <SelectItem value={ViolationType.harassment}>Harassment</SelectItem>
                <SelectItem value={ViolationType.inappropriateContent}>Inappropriate Content</SelectItem>
                <SelectItem value={ViolationType.other}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the violation..."
              rows={4}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!description.trim() || reportContent.isPending}>
              {reportContent.isPending ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
