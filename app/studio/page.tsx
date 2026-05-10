'use client';
import { useVideoStore } from '@/store/videoStore';
import { StepWizard } from '@/components/ui/StepWizard';
import { Step0_StudioHub } from '@/components/steps/Step0_StudioHub';
import { Step1_NicheTopic } from '@/components/steps/Step1_NicheTopic';
import { Step2_HookTitle } from '@/components/steps/Step2_HookTitle';
import { Step3_ScriptEditor } from '@/components/steps/Step3_ScriptEditor';
import { Step4_StoryboardPreview } from '@/components/steps/Step4_StoryboardPreview';
import { Step5_MediaSelector } from '@/components/steps/Step5_MediaSelector';
import { Step6_BrandKit } from '@/components/steps/Step6_BrandKit';
import { Step7_ThumbnailStudio } from '@/components/steps/Step7_ThumbnailStudio';
import { Step8_RenderExport } from '@/components/steps/Step8_RenderExport';
import { Step9_PublishSchedule } from '@/components/steps/Step9_PublishSchedule';

export default function StudioPage() {
  const currentStep = useVideoStore((s) => s.currentStep);

  return (
    <div className="min-h-full pb-24 relative z-10 w-full bg-gray-50">
      {currentStep > 0 && (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <StepWizard />
        </div>
      )}

      <div className="w-full">
        {currentStep === 0 && <Step0_StudioHub />}
        
        {currentStep > 0 && (
          <div className="max-w-5xl mx-auto px-6 py-10">
            {currentStep === 1 && <Step1_NicheTopic />}
            {currentStep === 2 && <Step2_HookTitle />}
            {currentStep === 3 && <Step3_ScriptEditor />}
            {currentStep === 4 && <Step4_StoryboardPreview />}
            {(currentStep === 5 || currentStep === 6 || currentStep === 7) && <Step8_RenderExport />}
            {currentStep === 8 && <Step8_RenderExport />}
            {currentStep === 9 && <Step9_PublishSchedule />}
          </div>
        )}
      </div>
    </div>
  );
}
