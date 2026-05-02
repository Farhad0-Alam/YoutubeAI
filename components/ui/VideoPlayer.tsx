export function VideoPlayer({ url }: { url: string }) {
  return (
    <div className="w-full aspect-video bg-black relative overflow-hidden rounded-xl shadow-sm border border-gray-200">
      <video 
        src={url} 
        controls 
        autoPlay 
        className="w-full h-full object-contain"
      />
    </div>
  );
}
