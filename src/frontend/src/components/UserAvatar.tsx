import { useMemo } from 'react';

interface UserAvatarProps {
  username: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function UserAvatar({ username, size = 'medium', className = '' }: UserAvatarProps) {
  const sizeClasses = {
    small: 'h-8 w-8 text-sm',
    medium: 'h-10 w-10 text-base',
    large: 'h-32 w-32 text-5xl',
  };

  // Generate consistent color based on username
  const backgroundColor = useMemo(() => {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // amber
      '#EF4444', // red
      '#8B5CF6', // violet
      '#EC4899', // pink
      '#14B8A6', // teal
      '#F97316', // orange
      '#6366F1', // indigo
      '#84CC16', // lime
    ];

    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }, [username]);

  const firstLetter = username.charAt(0).toUpperCase();

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white ${className}`}
      style={{ backgroundColor }}
    >
      {firstLetter}
    </div>
  );
}
