import { toast } from "sonner";

export async function compileAndDownloadVideo(scenes: any[], aspectRatio: string = "16:9") {
  return new Promise<void>(async (resolve, reject) => {
    toast.info("Initializing Video Compiler...");

    let width = 1280;
    let height = 720;
    if (aspectRatio === "9:16") {
      width = 720;
      height = 1280;
    } else if (aspectRatio === "1:1") {
      width = 1080;
      height = 1080;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      toast.error("Canvas not supported");
      return reject();
    }

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const dest = audioCtx.createMediaStreamDestination();
    
    // Capture stream from canvas
    const videoStream = canvas.captureStream(30); // 30 FPS
    
    // Merge audio and video tracks
    const tracks = [...videoStream.getVideoTracks(), ...dest.stream.getAudioTracks()];
    const combinedStream = new MediaStream(tracks);

    // Setup MediaRecorder
    let options = { mimeType: 'video/webm;codecs=vp9,opus' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: 'video/webm;codecs=vp8,vorbis' };
    }
    
    const mediaRecorder = new MediaRecorder(combinedStream, options);
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `exported_video_${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Video Exported Successfully!");
      resolve();
    };

    mediaRecorder.start();
    
    toast.loading("Rendering Video Frames...", { id: "render_toast" });

    let stopRecording = false;

    for (let i = 0; i < scenes.length; i++) {
      if (stopRecording) break;
      const scene = scenes[i];
      const durationMs = (scene.duration_seconds || 15) * 1000;
      
      // Load visual
      const visualElement = await loadVisual(scene);
      
      // Load Audio via Web Audio API so we can pipe it into the stream
      let audioNode: AudioBufferSourceNode | null = null;
      if (scene.audio_url) {
        try {
          const resp = await fetch(scene.audio_url);
          const arrayBuffer = await resp.arrayBuffer();
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
          audioNode = audioCtx.createBufferSource();
          audioNode.buffer = audioBuffer;
          audioNode.connect(dest);
          audioNode.start();
        } catch (e) {
          console.warn("Could not load audio track for scene", i);
        }
      }

      // Render loop for this scene
      const start = Date.now();
      while (Date.now() - start < durationMs) {
        if (visualElement instanceof HTMLVideoElement) {
           ctx.drawImage(visualElement, 0, 0, width, height);
        } else if (visualElement instanceof HTMLImageElement) {
           ctx.drawImage(visualElement, 0, 0, width, height);
        } else {
           // Fallback to black screen
           ctx.fillStyle = "black";
           ctx.fillRect(0, 0, width, height);
        }
        
        // Render Text Overlay removed
        
        // Wait till next frame (~30fps)
        await new Promise(r => setTimeout(r, 1000 / 30));
      }

      if (audioNode) {
        audioNode.stop();
      }
    }

    mediaRecorder.stop();
    toast.dismiss("render_toast");
  });
}

function loadVisual(scene: any): Promise<HTMLImageElement | HTMLVideoElement | null> {
  return new Promise((resolve) => {
    if (!scene.media_path) return resolve(null);
    
    if (scene.media_type === 'video') {
      const vid = document.createElement("video");
      vid.crossOrigin = "anonymous";
      vid.muted = true;
      vid.loop = true;
      vid.playsInline = true;
      vid.onloadeddata = () => {
         vid.play().catch(() => {});
         resolve(vid);
      };
      vid.onerror = () => resolve(null);
      vid.src = scene.media_path;
    } else {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = scene.media_path;
    }
  });
}
