import React from 'react';

interface ThumbnailCanvasProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  thumbnailUrl: string;
  filter: string;
  textY: number;
  textAlign: 'left' | 'center' | 'right';
  textColor: string;
  fontFamily: string;
  title: string;
  subtitle: string;
}

export function ThumbnailCanvas({
  previewRef,
  thumbnailUrl,
  filter,
  textY,
  textAlign,
  textColor,
  fontFamily,
  title,
  subtitle
}: ThumbnailCanvasProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-900 aspect-video relative flex items-center justify-center">
       {thumbnailUrl ? (
         <div 
           ref={previewRef} 
           className="w-full h-full relative overflow-hidden bg-black flex flex-col" 
           style={{ 
             alignItems: textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center', 
             justifyContent: 'flex-start' 
           }}
         >
            {/* Background Image */}
            <img 
              src={thumbnailUrl} 
              crossOrigin="anonymous" 
              className="absolute inset-0 w-full h-full object-cover transition-all" 
              style={{ filter }}
              alt="Thumbnail Background" 
            />
            {/* Overlay Text */}
            <div 
              className="relative z-10 w-full px-12 pb-4 pt-4 shrink-0 transition-all pointer-events-none" 
              style={{ 
                 marginTop: `${textY}%`, 
                 textAlign, 
                 color: textColor, 
                 fontFamily: fontFamily === 'Inter' ? 'var(--font-sans)' : fontFamily,
                 textShadow: '0px 4px 12px rgba(0,0,0,0.8), 0px 2px 4px rgba(0,0,0,0.6)'
              }}
            >
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-tight drop-shadow-2xl">
                 {title}
              </h2>
              {subtitle && (
                <p className="text-2xl md:text-3xl font-bold mt-2 opacity-90 drop-shadow-xl">{subtitle}</p>
              )}
            </div>
         </div>
       ) : (
         <div className="text-gray-400 text-sm font-medium">Generate a background first</div>
       )}
    </div>
  );
}
