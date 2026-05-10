import { useVideoStore } from '../../store/videoStore';
import { Check, X, ChevronLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function StepWizard() {
  const currentStep = useVideoStore((s) => s.currentStep);
  const highestStep = useVideoStore((s) => s.highestStep);
  const setStep = useVideoStore((s) => s.setStep);
  
  const steps = [
    "Niche & Topic",
    "Hook & Title",
    "Script Editor",
    "Storyboard",
    "Media Dashboard",
    "Brand Kit",
    "Thumbnail Studio",
    "Render",
    "Publish & Schedule"
  ];

  if (currentStep === 0) return null;
  
  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6">
        {/* Exit Action */}
        <button 
          onClick={() => setStep(0)}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-xl transition-all group border border-slate-100"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Hub</span>
        </button>

        <div className="h-10 w-[1px] bg-slate-100 flex-shrink-0" />

        <div className="flex-1 flex items-center justify-between relative min-w-[800px] py-2">
          <div className="absolute left-0 top-1/2 w-full h-[2px] bg-gray-100 -z-10 -translate-y-1/2" />
          <div 
            className="absolute left-0 top-1/2 h-[2px] bg-indigo-600 -z-10 -translate-y-1/2 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, idx) => {
            const displayStepNum = idx + 1;
            // Map display step to internal step number
            let stepNum = displayStepNum;

            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            const isClickable = stepNum <= highestStep && !isCurrent;

            return (
              <div 
                key={step} 
                className={`flex flex-col items-center bg-white px-3 ${isClickable ? 'cursor-pointer hover:opacity-80' : ''}`}
                onClick={() => isClickable && setStep(stepNum)}
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
                  {isCompleted ? <Check className="w-4 h-4" /> : displayStepNum}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-tighter ${isCurrent ? 'text-indigo-900' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
