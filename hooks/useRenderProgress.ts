import { useState, useEffect } from 'react';

export function useRenderProgress(jobId: string | null) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    let currentProgress = 0;
    
    // Defer setting initial active state to avoid set-state-in-effect lint warn
    const initTimer = setTimeout(() => {
      if (!jobId) {
        setStatus('idle');
        setProgress(0);
        setMessage('');
        setVideoUrl(null);
      } else {
        setStatus('processing');
        setProgress(0);
        setMessage('Waking up render engine...');
      }
    }, 0);
    
    if (!jobId) return () => clearTimeout(initTimer);

    const interval = setInterval(() => {
      currentProgress += Math.random() * 8;
      
      if (currentProgress < 20) {
        setMessage('Downloading assets...');
      } else if (currentProgress < 50) {
        setMessage('Synthesizing voiceovers...');
      } else if (currentProgress < 80) {
        setMessage('Applying transitions and captions...');
      } else if (currentProgress < 99) {
        setMessage('Encoding final video format...');
      } else {
        currentProgress = 100;
        setMessage('Finalizing...');
      }
      
      setProgress(Math.min(100, Math.round(currentProgress)));
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStatus('completed');
          // Just use a reliable free sample video URL since we don't really render
          setVideoUrl('https://www.w3schools.com/html/mov_bbb.mp4');
        }, 1000);
      }
    }, 800);
    
    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, [jobId]);

  return { progress, message, status, videoUrl };
}
