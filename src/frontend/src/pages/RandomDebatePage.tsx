import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import DebateStyleSelector from '../components/DebateStyleSelector';
import { useState } from 'react';
import { DebateStyle } from '../backend';

export default function RandomDebatePage() {
  const { identity } = useInternetIdentity();
  const [selectedStyle, setSelectedStyle] = useState<DebateStyle>(DebateStyle.civil);
  const [isWaiting, setIsWaiting] = useState(false);

  if (!identity) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please log in to find a debate partner.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleOptIn = () => {
    setIsWaiting(true);
    // Note: Backend matching logic would be implemented here
    // For now, this is a UI placeholder
  };

  return (
    <div className="container py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3">
            <Shuffle className="h-8 w-8" />
            Random Debate Matching
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Get matched with a random activist for a debate! Select your preferred debate style and we'll find you a
            partner.
          </p>

          <DebateStyleSelector selected={selectedStyle} onSelect={setSelectedStyle} />

          {!isWaiting ? (
            <Button onClick={handleOptIn} size="lg" className="w-full gap-2">
              <Shuffle className="h-5 w-5" />
              Find Debate Partner
            </Button>
          ) : (
            <div className="text-center space-y-4">
              <div className="animate-pulse">
                <Shuffle className="h-12 w-12 mx-auto text-primary" />
              </div>
              <p className="font-semibold">Searching for a debate partner...</p>
              <Button variant="outline" onClick={() => setIsWaiting(false)}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
