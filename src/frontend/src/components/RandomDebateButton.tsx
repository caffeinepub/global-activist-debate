import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';

export default function RandomDebateButton() {
  const navigate = useNavigate();

  return (
    <Button
      size="lg"
      onClick={() => navigate({ to: '/random-debate' })}
      className="w-full sm:w-auto gap-2 bg-gradient-to-r from-activist-blue to-activist-green hover:opacity-90 transition-opacity"
    >
      <Shuffle className="h-5 w-5" />
      Find Random Debate Partner
    </Button>
  );
}
