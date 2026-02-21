import { Badge } from '@/components/ui/badge';
import { DebateStyle } from '../backend';

interface DebateStyleBadgeProps {
  style: DebateStyle;
}

export default function DebateStyleBadge({ style }: DebateStyleBadgeProps) {
  const getStyleConfig = () => {
    switch (style) {
      case DebateStyle.civil:
        return { label: 'Civil', className: 'bg-activist-blue text-white' };
      case DebateStyle.aggressive:
        return { label: 'Aggressive', className: 'bg-activist-orange text-white' };
      case DebateStyle.creative:
        return { label: 'Creative', className: 'bg-activist-green text-white' };
      case DebateStyle.random:
        return { label: 'Random', className: 'bg-purple-500 text-white' };
    }
  };

  const config = getStyleConfig();

  return <Badge className={config.className}>{config.label}</Badge>;
}
