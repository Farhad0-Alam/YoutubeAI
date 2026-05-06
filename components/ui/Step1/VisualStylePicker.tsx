import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const VISUAL_STYLES = [
  { id: 'cinematic', name: 'Cinematic', description: 'YouTube #1', icon: '🎥' },
  { id: 'ghibli', name: 'Ghibli / Anime', description: 'TikTok viral', icon: '🌸' },
  { id: 'webcomic', name: 'Webcomic', description: 'Storytelling', icon: '📖' },
  { id: 'watercolor', name: 'Watercolor', description: 'Lifestyle', icon: '🎨' },
  { id: 'retro', name: 'Retro', description: 'Nostalgia', icon: '📺' },
  { id: '3d_render', name: '3D Render', description: 'Premium', icon: '🧊' },
  { id: 'whiteboard', name: 'Whiteboard', description: 'Education', icon: '✏️' },
  { id: 'paper_craft', name: 'Paper Craft', description: 'Creative', icon: '✂️' },
  { id: 'pov', name: 'POV', description: 'Immersive', icon: '👁️' },
  { id: 'dark_noir', name: 'Dark / Noir', description: 'Drama', icon: '🌑' },
  { id: 'infographic', name: 'Infographic', description: 'Data driven', icon: '📊' },
  { id: 'stock_footage', name: 'Stock Footage', description: 'Faceless', icon: '🎞️' },
  { id: 'pixel_art', name: 'Pixel Art', description: 'Gaming, retro tech', icon: '👾' },
  { id: 'motion_graphic', name: 'Motion Graphic', description: 'Corporate, explainers', icon: '📐' },
  { id: 'documentary', name: 'Documentary', description: 'True story, news style', icon: '📰' },
  { id: 'minimalist', name: 'Minimalist', description: 'Finance, productivity', icon: '✨' },
];

interface VisualStylePickerProps {
  selectedStyle: string;
  onSelect: (styleId: string) => void;
}

export function VisualStylePicker({ selectedStyle, onSelect }: VisualStylePickerProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {VISUAL_STYLES.map(style => {
        const isSelected = selectedStyle === style.id;
        return (
          <div
            key={style.id}
            onClick={() => onSelect(style.id)}
            className={`relative cursor-pointer rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-200 ${
              isSelected 
                ? 'border-2 border-indigo-600 bg-indigo-50/30 shadow-sm' 
                : 'border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
            }`}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 text-indigo-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
            <div className="text-3xl mb-3">{style.icon}</div>
            <div className="font-bold text-sm text-gray-900 mb-1">{style.name}</div>
            <div className="text-[11px] text-gray-500">{style.description}</div>
          </div>
        );
      })}
    </div>
  );
}
