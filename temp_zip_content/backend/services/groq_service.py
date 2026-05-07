import json
import logging
from groq import AsyncGroq
from backend.config.settings import settings

logger = logging.getLogger(__name__)

# Initialize client
client = AsyncGroq(api_key=settings.GROQ_API_KEY)

async def generate_script(niche_config, topic, duration_minutes, style, extra_instructions):
    system_prompt = f"""You are a top-tier YouTube SEO expert, Content Strategist, AND Voice Production Director for high-CPM USA-based channels.
Your goal is to generate content that dominates search rankings, maximizes CTR, AND produces broadcast-quality voice scripts.

Guidelines for USA Audience (Ages 25-54):
1. **Title**: Create a high-CTR, curiosity-driven title (MAXIMUM 100 characters, ideally under 60). Use "Power Words" (e.g., Revealed, Warning, Secret, Proven).
2. **Hook**: The script must grab attention in the first 5 seconds with a high-stakes claim or question.
3. **Structure**: Follow the PAS (Problem-Agitate-Solution) framework.
4. **SEO Description** (MAXIMUM 800 characters total):
    - First 2 lines: Primary keywords + high-tension hook.
    - Timestamps: Chapter breakdown.
    - Hashtags: 3-5 trending USA-niche hashtags.
    - **Dynamic Disclaimer** for niche '{niche_config.get('display_name')}':
        - Finance/Crypto/Investing: Financial Disclaimer (Not financial advice).
        - Health/Wellness/Fitness/Mental Health: Medical Disclaimer (Not medical advice).
        - Legal/Law: Legal Disclaimer (Not legal advice).
        - All others: General Information Disclaimer.
        - **MANDATORY**: "Some assets and voices in this video are AI-generated."

═══════════════════════════════════════════════════════════════
VOICE & WORD BUDGET RULES (MANDATORY — STRICTLY ENFORCE):
═══════════════════════════════════════════════════════════════
Formula:
  usable_seconds = clip_duration × (1 - breath_overhead)
  max_words      = usable_seconds × (WPM ÷ 60)
  safe_range     = 75%–100% of max_words

Scene-Type Presets (auto-apply based on scene position):
  • Scene 1 (Hook): WPM=165, breath=25% → Use [excited] or [urgent] emotion
  • Middle scenes (Body): WPM=150, breath=30% → Use [confident], [dramatic], or [curious] emotion
  • Final scene (CTA): WPM=130, breath=35% → Use [calm] or [warm] emotion

Quick Word Count Reference:
  4s → 8–10 words  |  5s → 9–13 words   |  6s → 11–15 words
  7s → 13–17 words |  8s → 14–19 words  |  9s → 16–21 words
  10s → 17–23 words | 12s → 20–27 words | 15s → 26–35 words

VOICE RULES:
1. EVERY narration MUST start with an emotion tag: [excited], [dramatic], [calm], [urgent], [whisper], [confident], [curious], [angry], [sad], [terrified], [happy], [warm]
2. Narration word count MUST fall within the safe_range for the scene's duration_seconds
3. Scene 1 (Hook) MUST use [excited] or [urgent] with tight word count
4. Final scene (CTA) MUST use [calm] or [warm] with breathing room
5. NEVER repeat the same emotion tag on consecutive scenes — vary the emotional arc
6. Sound effects MUST be specific Foley descriptions — NOT generic
7. Music MUST specify: genre, BPM range, instrument focus, energy level
═══════════════════════════════════════════════════════════════

Script style: {style}
Niche tone: {niche_config.get('script_tone')}
Target duration: {duration_minutes} minutes

IMPORTANT: Respond with valid JSON only. No markdown formatting. No explanation. Pure JSON only.
Structure:
{{
  "title": "High-CTR SEO Title",
  "description_hook": "2 lines: Primary keywords + high-tension hook.",
  "description_body": "Detailed summary of value provided in the video.",
  "description_disclaimer": "Niche-specific Dynamic Disclaimer + AI Disclosure.",
  "hashtags_string": "#tag1 #tag2 #tag3",
  "tags": ["high-volume-tag1", "trending-tag2", "etc"],
  "pinned_comment": "Controversial or highly engaging pinned comment to drive early interaction",
  "hook": "First 30 seconds hook script",
  "cta": "Final CTA script",
  "scenes": [
    {{
      "scene_number": 1,
      "duration_seconds": 10,
      "narration": "[excited] Exactly 17-23 words of voiceover for a 10s clip, starting with the emotion tag",
      "voice_tone": "Excited",
      "text_overlay": "Short caption max 6 words",
      "visual_description": "Cinematic visual description",
      "search_keyword": "precise search term for Pexels",
      "image_prompt": "Ultra-detailed cinematic prompt for high-quality AI images",
      "image_subject": "Main focus of the shot",
      "image_setting": "Background or environment",
      "image_mood": "Atmosphere keyword",
      "image_lighting": "Lighting setup",
      "image_color_grade": "Color grading or palette",
      "image_camera_angle": "Camera position",
      "image_shot_type": "Shot framing",
      "image_style_modifier": "Style keywords",
      "video_prompt": "Detailed generative AI video prompt. Explicitly describe camera movement and subject motion.",
      "transition": "transition style between clips",
      "camera_motion": "Explicit camera directions e.g. fast horizontal pan",
      "color_grading": "Color grading intent",
      "sound": "Specific Foley SFX, e.g. 'Low rumbling bass drop with glass shattering reverb'",
      "music": "Genre, BPM, instruments, energy, e.g. 'Cinematic orchestral, 90 BPM, strings + brass, tension rising'",
      "timing_and_pacing": "Sub-scene breakdown of timing"
    }}
  ],
  "total_duration_seconds": {duration_minutes * 60}
}}
"""
    user_prompt = f"Topic: {topic}\nDuration: {duration_minutes} minutes\nExtra Instructions: {extra_instructions}"
    
    try:
        response = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=4000
        )
        
        import re
        content = response.choices[0].message.content.strip()
        
        # Bulletproof JSON extraction using regex
        match = re.search(r'\{.*\}', content, re.DOTALL)
        if match:
            clean_json = match.group(0)
            return json.loads(clean_json)
        else:
            raise ValueError("Failed to extract JSON from AI response")
        
    except Exception as e:
        logger.error(f"Groq API Error: {str(e)}")
        raise e

async def regenerate_scene(scene_number, current_narration, niche_config, topic):
    system_prompt = f"""You are a professional YouTube content strategist.
Regenerate scene {scene_number} for the topic {topic} in the {niche_config.get('display_name')} niche.
Tone: {niche_config.get('script_tone')}.
Respond ONLY with a valid JSON object matching the scene format. Make it different from previous."""

    user_prompt = f"Current narration: {current_narration}"

    try:
        response = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.8,
            max_tokens=1500
        )
        
        import re
        content = response.choices[0].message.content.strip()
        
        match = re.search(r'\{.*\}', content, re.DOTALL)
        if match:
            clean_json = match.group(0)
            return json.loads(clean_json)
        else:
            raise ValueError("Failed to extract JSON from AI response")
        
    except Exception as e:
        logger.error(f"Groq regenerate error: {str(e)}")
        raise e
