import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from backend.config.settings import settings
from moviepy.editor import VideoFileClip, ImageClip, AudioFileClip, CompositeVideoClip, concatenate_videoclips

def create_caption_clip(text, duration):
    """Creates a Pillow rendered caption clip"""
    img = Image.new('RGBA', (1920, 1080), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    
    # Draw bottom bar
    d.rectangle([(0, 950), (1920, 1080)], fill=(0, 0, 0, 190))
    
    # Robust Font Loading (Windows & Linux support)
    font_paths = [
        "C:\\Windows\\Fonts\\arialbd.ttf",       # Windows Bold
        "C:\\Windows\\Fonts\\segoeuib.ttf",      # Windows Segoe UI Bold
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", # Linux
        "f:/YoutubeAI/backend/assets/fonts/Montserrat-Bold.ttf" # Local project path
    ]
    
    fnt = None
    for path in font_paths:
        if os.path.exists(path):
            try:
                fnt = ImageFont.truetype(path, 48)
                break
            except:
                continue
    
    if not fnt:
        fnt = ImageFont.load_default()
        
    # Center text
    bbox = d.textbbox((0, 0), text, font=fnt)
    w = bbox[2] - bbox[0]
    x = (1920 - w) / 2
    d.text((x, 980), text, font=fnt, fill=(255, 255, 255))
    
    # Convert PIL to MoviePy clip
    frame = np.array(img)
    return ImageClip(frame).set_duration(duration)

def zoom_in_effect(clip, zoom_ratio=0.05):
    """Ken Burns effect for images"""
    def effect(get_frame, t):
        img = Image.fromarray(get_frame(t))
        base_size = img.size
        new_size = [
            int(base_size[0] * (1 + (zoom_ratio * t / clip.duration))),
            int(base_size[1] * (1 + (zoom_ratio * t / clip.duration)))
        ]
        img = img.resize(new_size, Image.Resampling.LANCZOS)
        x = int((new_size[0] - base_size[0]) / 2)
        y = int((new_size[1] - base_size[1]) / 2)
        img = img.crop((x, y, base_size[0] + x, base_size[1] + y))
        return np.array(img)
    
    return clip.fl(effect)

async def render_video(project_id, scenes_data, audio_data, progress_callback=None):
    """Main rendering loop"""
    final_clips = []
    
    for i, scene in enumerate(scenes_data):
        if progress_callback:
            await progress_callback("rendering", int((i / len(scenes_data)) * 50) + 30, f"Rendering scene {i+1} of {len(scenes_data)}")
        
        # Audio
        audio_clip = AudioFileClip(audio_data[i]["file_path"])
        duration = audio_clip.duration
        
        # Footage
        is_video = scene["media_path"].endswith(".mp4")
        if is_video:
            vid_clip = VideoFileClip(scene["media_path"])
            # loop and trim
            vid_clip = vid_clip.loop(duration=duration)
            vid_clip = vid_clip.resize((1920, 1080))
            vid_clip = vid_clip.set_audio(audio_clip)
            base_clip = vid_clip
        else:
            img_clip = ImageClip(scene["media_path"]).set_duration(duration)
            img_clip = img_clip.resize((1920, 1080))
            img_clip = zoom_in_effect(img_clip)
            img_clip = img_clip.set_audio(audio_clip)
            base_clip = img_clip
            
        # Add caption
        caption = create_caption_clip(scene.get("text_overlay", ""), duration)
        scene_clip = CompositeVideoClip([base_clip, caption])
        
        # Transitions
        if scene.get("transition") == "fade" and i > 0:
            scene_clip = scene_clip.fadein(0.5)
            
        final_clips.append(scene_clip)
        
    if progress_callback:
        await progress_callback("encoding", 85, "Encoding final MP4...")
        
    final_video = concatenate_videoclips(final_clips, method="compose")
    out_path = os.path.join(settings.VIDEOS_DIR, f"{project_id}.mp4")
    
    # Write file
    final_video.write_videofile(
        out_path,
        fps=30,
        codec="libx264",
        audio_codec="aac",
        preset="fast",
        threads=2
    )
    
    return out_path, os.path.getsize(out_path) / (1024 * 1024)
