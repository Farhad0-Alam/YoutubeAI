export function ThumbnailPreview({ url }: { url: string }) {
  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-[#2a2a2a] relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={url} 
        alt="Thumbnail Preview" 
        className="w-full h-full object-cover"
      />
    </div>
  );
}
