import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import ReportModal from './ReportModal';
import { ReportedContent } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface ReportButtonProps {
  reportedContent: ReportedContent;
}

export default function ReportButton({ reportedContent }: ReportButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const { identity } = useInternetIdentity();

  if (!identity) return null;

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setShowModal(true)} className="gap-2">
        <Flag className="h-4 w-4" />
      </Button>
      <ReportModal open={showModal} onOpenChange={setShowModal} reportedContent={reportedContent} />
    </>
  );
}
