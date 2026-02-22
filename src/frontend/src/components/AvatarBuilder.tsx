import { useState } from 'react';
import { AvatarCustomization, AvatarColorChoice, AvatarStyleChoice, AvatarColorType, AvatarStyleType } from '../backend';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import AvatarPreview from './AvatarPreview';

interface AvatarBuilderProps {
  value: AvatarCustomization;
  onChange: (avatar: AvatarCustomization) => void;
}

const skinTones = [
  { id: 1, name: 'Light', color: '#FFE0BD' },
  { id: 2, name: 'Light Medium', color: '#F1C27D' },
  { id: 3, name: 'Medium', color: '#C68642' },
  { id: 4, name: 'Medium Dark', color: '#8D5524' },
  { id: 5, name: 'Dark', color: '#5C3317' },
];

const hairStyles = [
  { id: 1, name: 'Short', icon: '✂️' },
  { id: 2, name: 'Long', icon: '💇' },
  { id: 3, name: 'Curly', icon: '🌀' },
  { id: 4, name: 'Bald', icon: '🥚' },
  { id: 5, name: 'Ponytail', icon: '🎀' },
];

const hairColors = [
  { id: 1, name: 'Black', color: '#000000' },
  { id: 2, name: 'Brown', color: '#4A2511' },
  { id: 3, name: 'Blonde', color: '#F5D76E' },
  { id: 4, name: 'Red', color: '#A52A2A' },
  { id: 5, name: 'Gray', color: '#808080' },
  { id: 6, name: 'Blue', color: '#0066CC' },
  { id: 7, name: 'Purple', color: '#800080' },
];

const eyewearOptions = [
  { id: 0, name: 'None', icon: '👁️' },
  { id: 1, name: 'Glasses', icon: '👓' },
  { id: 2, name: 'Sunglasses', icon: '🕶️' },
  { id: 3, name: 'Monocle', icon: '🧐' },
];

const clothingOptions = [
  { id: 0, name: 'None', icon: '👕' },
  { id: 1, name: 'T-Shirt', icon: '👕' },
  { id: 2, name: 'Hoodie', icon: '🧥' },
  { id: 3, name: 'Suit', icon: '🤵' },
  { id: 4, name: 'Cape', icon: '🦸' },
];

export default function AvatarBuilder({ value, onChange }: AvatarBuilderProps) {
  const [hairColor, setHairColor] = useState<number>(1);

  const handleSkinToneChange = (colorId: number) => {
    const newSkinTone: AvatarColorChoice = {
      colorId: BigInt(colorId),
      colorType: AvatarColorType.skinToneLevel,
    };
    onChange({ ...value, skinTone: newSkinTone });
  };

  const handleHairStyleChange = (styleId: number) => {
    const newHairType: AvatarStyleChoice = {
      id: BigInt(styleId),
      styleType: AvatarStyleType.hair,
    };
    onChange({ ...value, hairType: newHairType });
  };

  const handleHairColorChange = (colorId: number) => {
    setHairColor(colorId);
  };

  const handleEyewearChange = (styleId: number) => {
    if (styleId === 0) {
      onChange({ ...value, eyewear: undefined });
    } else {
      const newEyewear: AvatarStyleChoice = {
        id: BigInt(styleId),
        styleType: AvatarStyleType.glasses,
      };
      onChange({ ...value, eyewear: newEyewear });
    }
  };

  const handleClothingChange = (styleId: number) => {
    if (styleId === 0) {
      onChange({ ...value, clothing: undefined });
    } else {
      const newClothing: AvatarStyleChoice = {
        id: BigInt(styleId),
        styleType: AvatarStyleType.shirt,
      };
      onChange({ ...value, clothing: newClothing });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <AvatarPreview avatar={value} size="large" />
      </div>

      <Tabs defaultValue="skin" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="skin">Skin</TabsTrigger>
          <TabsTrigger value="hair">Hair</TabsTrigger>
          <TabsTrigger value="accessories">Accessories</TabsTrigger>
          <TabsTrigger value="clothing">Clothing</TabsTrigger>
        </TabsList>

        <TabsContent value="skin" className="space-y-4">
          <Label>Skin Tone</Label>
          <div className="grid grid-cols-5 gap-3">
            {skinTones.map((tone) => (
              <button
                key={tone.id}
                onClick={() => handleSkinToneChange(tone.id)}
                className={`aspect-square rounded-full border-4 transition-all hover:scale-110 ${
                  Number(value.skinTone.colorId) === tone.id ? 'border-primary ring-2 ring-primary' : 'border-border'
                }`}
                style={{ backgroundColor: tone.color }}
                title={tone.name}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hair" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>Hair Style</Label>
              <div className="grid grid-cols-5 gap-3 mt-2">
                {hairStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleHairStyleChange(style.id)}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center text-3xl transition-all hover:scale-105 ${
                      Number(value.hairType.id) === style.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background'
                    }`}
                    title={style.name}
                  >
                    {style.icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Hair Color</Label>
              <div className="grid grid-cols-7 gap-3 mt-2">
                {hairColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleHairColorChange(color.id)}
                    className={`aspect-square rounded-full border-4 transition-all hover:scale-110 ${
                      hairColor === color.id ? 'border-primary ring-2 ring-primary' : 'border-border'
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="accessories" className="space-y-4">
          <Label>Eyewear</Label>
          <div className="grid grid-cols-4 gap-3">
            {eyewearOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleEyewearChange(option.id)}
                className={`aspect-square rounded-lg border-2 flex items-center justify-center text-3xl transition-all hover:scale-105 ${
                  (option.id === 0 && !value.eyewear) || (value.eyewear && Number(value.eyewear.id) === option.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background'
                }`}
                title={option.name}
              >
                {option.icon}
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="clothing" className="space-y-4">
          <Label>Clothing Style</Label>
          <div className="grid grid-cols-5 gap-3">
            {clothingOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleClothingChange(option.id)}
                className={`aspect-square rounded-lg border-2 flex items-center justify-center text-3xl transition-all hover:scale-105 ${
                  (option.id === 0 && !value.clothing) || (value.clothing && Number(value.clothing.id) === option.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background'
                }`}
                title={option.name}
              >
                {option.icon}
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
