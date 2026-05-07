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

    const scenesToProcess = [];
    for (const scene of scenes) {
      if (scene.sub_scenes && scene.sub_scenes.length > 0) {
        for (const sub of scene.sub_scenes) {
          scenesToProcess.push({
            ...sub,
            // Inherit audio/media from parent if missing in sub
            audio_url: sub.audio_url || scene.audio_url,
            media_path: sub.media_path || scene.media_path,
            media_type: sub.media_type || scene.media_type,
            call_to_action_cue: sub.call_to_action_cue || (sub === scene.sub_scenes[scene.sub_scenes.length - 1] ? scene.call_to_action_cue : null)
          });
        }
      } else {
        scenesToProcess.push(scene);
      }
    }

    for (let i = 0; i < scenesToProcess.length; i++) {
      if (stopRecording) break;
      const part = scenesToProcess[i];
      const durationMs = (part.duration_seconds || 5) * 1000;
      
      // Load visual
      const visualElement = await loadVisual(part);
      
      // Load Audio via Web Audio API
      let audioNode: AudioBufferSourceNode | null = null;
      if (part.audio_url) {
        try {
          const resp = await fetch(part.audio_url);
          const arrayBuffer = await resp.arrayBuffer();
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
          audioNode = audioCtx.createBufferSource();
          audioNode.buffer = audioBuffer;
          audioNode.connect(dest);
          audioNode.start();
        } catch (e) {
          console.warn("Could not load audio track for part", i);
        }
      }

      // Render loop for this part
      const start = Date.now();
      while (Date.now() - start < durationMs) {
        ctx.clearRect(0, 0, width, height); // Clear frame
        
        if (visualElement instanceof HTMLVideoElement) {
           ctx.drawImage(visualElement, 0, 0, width, height);
        } else if (visualElement instanceof HTMLImageElement) {
           ctx.drawImage(visualElement, 0, 0, width, height);
        } else {
           ctx.fillStyle = "black";
           ctx.fillRect(0, 0, width, height);
        }
        
        // Render CTA if present on the last frame/part
        if (part.call_to_action_cue && i === scenesToProcess.length - 1) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.fillRect(0, height - 80, width, 80);
          ctx.fillStyle = "white";
          ctx.font = "bold 40px Arial";
          ctx.textAlign = "center";
          ctx.fillText(part.call_to_action_cue, width / 2, height - 30);
        }
        
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
