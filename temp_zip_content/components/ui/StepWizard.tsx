import { useVideoStore } from '../../store/videoStore';
import { Check } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function StepWizard() {
  const currentStep = useVideoStore((s) => s.currentStep);
  const highestStep = useVideoStore((s) => s.highestStep);
  const setStep = useVideoStore((s) => s.setStep);
  const router = useRouter();
  const pathname = usePathname();
  
  const steps = [
    "Niche & Topic",
    "Hook & Title",
    "Script Editor",
    "Storyboard",
    "Media Dashboard",
    "Brand Kit",
    "Thumbnail",
    "Render",
    "Publish & Schedule"
  ];

  return (
    <div className="w-full px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 w-full h-[2px] bg-gray-100 -z-10 -translate-y-1/2" />
        <div 
          className="absolute left-0 top-1/2 h-[2px] bg-indigo-600 -z-10 -translate-y-1/2 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isClickable = stepNum <= highestStep && !isCurrent;

          return (
            <div 
              key={step} 
              className={`flex flex-col items-center bg-white px-2 ${isClickable ? 'cursor-pointer hover:opacity-80' : ''}`}
              onClick={() => {
                if (isClickable) {
                  setStep(stepNum);
                  if (pathname !== '/') {
                    router.push('/');
                  }
                }
              }}
            >
              <div 
                className={`w-8 h-8 rounded-full flex justify-center items-center text-sm font-semibold mb-2 transition-colors ${
                  isCompleted 
                  ? 'bg-indigo-600 text-white' 
                  : isCurrent
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-50'
                  : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span className={`text-xs font-medium ${isCurrent ? 'text-indigo-900' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
