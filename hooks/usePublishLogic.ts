import { useVideoStore } from '../store/videoStore';

export function usePublishLogic() {
  const { setStep } = useVideoStore();

  const handleFinishProject = () => {
    // Reset state or redirect to dashboard
    setStep(1);
  };

  return {
    setStep,
    handleFinishProject
  };
}
