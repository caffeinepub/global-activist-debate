import { DebateStyle } from '../backend';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DebateStyleSelectorProps {
  selected: DebateStyle;
  onSelect: (style: DebateStyle) => void;
}

export default function DebateStyleSelector({ selected, onSelect }: DebateStyleSelectorProps) {
  const styles = [
    {
      value: DebateStyle.civil,
      label: 'Civil',
      description: 'Respectful, thoughtful discussion',
      icon: '/assets/generated/civil-icon.dim_128x128.png',
      color: 'border-activist-blue',
    },
    {
      value: DebateStyle.aggressive,
      label: 'Aggressive',
      description: 'Heated, passionate debate',
      icon: '/assets/generated/aggressive-icon.dim_128x128.png',
      color: 'border-activist-orange',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {styles.map((style) => (
        <Card
          key={style.value}
          className={cn(
            'cursor-pointer transition-all hover:shadow-md',
            selected === style.value && `border-2 ${style.color}`
          )}
          onClick={() => onSelect(style.value)}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <img src={style.icon} alt={style.label} className="h-12 w-12" />
            <div>
              <h3 className="font-semibold">{style.label}</h3>
              <p className="text-sm text-muted-foreground">{style.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
