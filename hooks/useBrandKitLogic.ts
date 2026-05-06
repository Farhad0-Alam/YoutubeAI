import { useVideoStore } from '../store/videoStore';

export function useBrandKitLogic() {
  const { setStep } = useVideoStore();

  const handleUpgrade = () => {
    // Placeholder for future billing/upgrade logic
    console.log("Upgrade requested");
  };

  return {
    setStep,
    handleUpgrade
  };
}
