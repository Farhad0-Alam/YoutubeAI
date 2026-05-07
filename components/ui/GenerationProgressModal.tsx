import React from 'react';
import { Loader2, Sparkles, BrainCircuit, Rocket } from 'lucide-react';

interface GenerationProgressModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  steps: string[];
  currentStep: number;
}

export function GenerationProgressModal({ isOpen, title, subtitle, steps, currentStep }: GenerationProgressModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-25 scale-150"></div>
            <div className="relative bg-indigo-600 p-5 rounded-full shadow-lg shadow-indigo-200">
              {currentStep === 0 ? (
                <BrainCircuit className="w-8 h-8 text-white animate-pulse" />
              ) : currentStep === steps.length - 1 ? (
                <Rocket className="w-8 h-8 text-white animate-bounce" />
              ) : (
                <Sparkles className="w-8 h-8 text-white animate-spin-slow" />
              )}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-500 text-sm mb-8">{subtitle}</p>

          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-4 text-left">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  idx < currentStep 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : idx === currentStep 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-400'
                }`}>
                  {idx < currentStep ? '✓' : idx + 1}
                </div>
                <span className={`text-sm font-semibold transition-colors ${
                  idx === currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step}
                </span>
                {idx === currentStep && (
                  <Loader2 className="w-4 h-4 text-indigo-600 animate-spin ml-auto" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
