interface ProgressBarProps {
  progress: number;
  message: string;
}

export function ProgressBar({ progress, message }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-900">{message}</span>
        <span className="text-sm font-bold text-indigo-600">{progress}%</span>
      </div>
      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
