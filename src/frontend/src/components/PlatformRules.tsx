import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, MessageCircle, Shield, ThumbsUp } from 'lucide-react';

export default function PlatformRules() {
  const rules = [
    {
      icon: Shield,
      title: 'No Personal Attacks',
      description: 'Attack ideas, not people. Keep discussions focused on topics.',
      color: 'text-activist-blue',
    },
    {
      icon: MessageCircle,
      title: 'Opinions Only',
      description: 'Express your views without insulting individuals.',
      color: 'text-activist-green',
    },
    {
      icon: ThumbsUp,
      title: 'Civil Debates',
      description: 'Respectful tone, no cursing in civil debate sections.',
      color: 'text-activist-blue',
    },
    {
      icon: AlertCircle,
      title: 'Aggressive Debates',
      description: 'Cursing allowed about topics, never about individuals.',
      color: 'text-activist-orange',
    },
  ];

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-2xl">Platform Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule, index) => (
            <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
              <rule.icon className={cn('h-6 w-6 flex-shrink-0 mt-0.5', rule.color)} />
              <div>
                <h4 className="font-semibold mb-1">{rule.title}</h4>
                <p className="text-sm text-muted-foreground">{rule.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
