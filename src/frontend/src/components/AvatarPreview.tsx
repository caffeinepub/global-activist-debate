import { AvatarCustomization, AvatarStyleType } from '../backend';

interface AvatarPreviewProps {
  avatar: AvatarCustomization;
  size?: 'small' | 'medium' | 'large';
}

const skinToneColors: Record<number, string> = {
  1: '#FFE0BD',
  2: '#F1C27D',
  3: '#C68642',
  4: '#8D5524',
  5: '#5C3317',
};

const hairColors: Record<number, string> = {
  1: '#000000',
  2: '#4A2511',
  3: '#F5D76E',
  4: '#A52A2A',
  5: '#808080',
  6: '#0066CC',
  7: '#800080',
};

export default function AvatarPreview({ avatar, size = 'medium' }: AvatarPreviewProps) {
  const sizeMap = {
    small: 40,
    medium: 80,
    large: 160,
  };

  const svgSize = sizeMap[size];
  const skinColor = skinToneColors[Number(avatar.skinTone.colorId)] || skinToneColors[1];
  const hairStyleId = Number(avatar.hairType.id);
  const hairColor = hairColors[1]; // Default hair color

  const renderHair = () => {
    switch (hairStyleId) {
      case 1: // Short
        return (
          <path
            d="M30 25 Q30 15, 40 15 Q50 15, 50 25 Z"
            fill={hairColor}
          />
        );
      case 2: // Long
        return (
          <path
            d="M25 25 Q25 10, 40 10 Q55 10, 55 25 L55 50 Q55 55, 50 55 L30 55 Q25 55, 25 50 Z"
            fill={hairColor}
          />
        );
      case 3: // Curly
        return (
          <>
            <circle cx="30" cy="20" r="5" fill={hairColor} />
            <circle cx="40" cy="15" r="6" fill={hairColor} />
            <circle cx="50" cy="20" r="5" fill={hairColor} />
          </>
        );
      case 4: // Bald
        return null;
      case 5: // Ponytail
        return (
          <>
            <path d="M30 25 Q30 15, 40 15 Q50 15, 50 25 Z" fill={hairColor} />
            <ellipse cx="40" cy="55" rx="8" ry="15" fill={hairColor} />
          </>
        );
      default:
        return (
          <path
            d="M30 25 Q30 15, 40 15 Q50 15, 50 25 Z"
            fill={hairColor}
          />
        );
    }
  };

  const renderEyewear = () => {
    if (!avatar.eyewear) return null;
    const eyewearId = Number(avatar.eyewear.id);

    switch (eyewearId) {
      case 1: // Glasses
        return (
          <g>
            <rect x="28" y="35" width="10" height="6" fill="none" stroke="#333" strokeWidth="1.5" rx="2" />
            <rect x="42" y="35" width="10" height="6" fill="none" stroke="#333" strokeWidth="1.5" rx="2" />
            <line x1="38" y1="38" x2="42" y2="38" stroke="#333" strokeWidth="1.5" />
          </g>
        );
      case 2: // Sunglasses
        return (
          <g>
            <rect x="28" y="35" width="10" height="6" fill="#222" stroke="#000" strokeWidth="1.5" rx="2" />
            <rect x="42" y="35" width="10" height="6" fill="#222" stroke="#000" strokeWidth="1.5" rx="2" />
            <line x1="38" y1="38" x2="42" y2="38" stroke="#000" strokeWidth="1.5" />
          </g>
        );
      case 3: // Monocle
        return (
          <circle cx="33" cy="38" r="5" fill="none" stroke="#333" strokeWidth="1.5" />
        );
      default:
        return null;
    }
  };

  const renderClothing = () => {
    if (!avatar.clothing) return null;
    const clothingId = Number(avatar.clothing.id);

    switch (clothingId) {
      case 1: // T-Shirt
        return (
          <path
            d="M25 60 L25 75 L55 75 L55 60"
            fill="#4A90E2"
            stroke="#333"
            strokeWidth="1"
          />
        );
      case 2: // Hoodie
        return (
          <>
            <path d="M25 60 L25 75 L55 75 L55 60" fill="#666" stroke="#333" strokeWidth="1" />
            <path d="M30 60 Q40 55, 50 60" fill="none" stroke="#333" strokeWidth="1" />
          </>
        );
      case 3: // Suit
        return (
          <>
            <path d="M25 60 L25 75 L55 75 L55 60" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
            <line x1="40" y1="60" x2="40" y2="75" stroke="#fff" strokeWidth="1" />
          </>
        );
      case 4: // Cape
        return (
          <path
            d="M20 65 Q20 55, 25 60 L25 75 L55 75 L55 60 Q60 55, 60 65"
            fill="#DC143C"
            stroke="#333"
            strokeWidth="1"
          />
        );
      default:
        return null;
    }
  };

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox="0 0 80 80"
      className="rounded-full bg-gradient-to-br from-background to-muted"
    >
      {/* Hair (back layer) */}
      {renderHair()}

      {/* Head */}
      <circle cx="40" cy="40" r="18" fill={skinColor} stroke="#333" strokeWidth="1.5" />

      {/* Eyes */}
      <circle cx="33" cy="38" r="2" fill="#000" />
      <circle cx="47" cy="38" r="2" fill="#000" />

      {/* Nose */}
      <line x1="40" y1="40" x2="40" y2="45" stroke="#333" strokeWidth="1" />

      {/* Mouth */}
      <path d="M35 48 Q40 51, 45 48" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />

      {/* Eyewear */}
      {renderEyewear()}

      {/* Clothing */}
      {renderClothing()}
    </svg>
  );
}
