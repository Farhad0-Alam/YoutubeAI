import json
import logging
from groq import AsyncGroq
from backend.config.settings import settings

logger = logging.getLogger(__name__)

# Initialize client
client = AsyncGroq(api_key=settings.GROQ_API_KEY)

async def generate_script(niche_config, topic, duration_minutes, style, extra_instructions):
    system_prompt = f"""You are a professional YouTube content strategist specializing in HIGH-CPM faceless channels targeting USA audiences aged 25-54.

Your scripts follow proven retention principles:
1. Hook in first 30 seconds (shocking stat or bold claim)
2. Promise value upfront
3. Pattern interrupts every 60-90 seconds
4. PAS framework: Problem -> Agitate -> Solution
5. Micro-hook at end of each scene to keep watching
6. Strong CTA in final 60 seconds

Script style: {style}
Niche tone: {niche_config.get('script_tone')}
Target duration: {duration_minutes} minutes

IMPORTANT: Respond with valid JSON only. No markdown formatting (no ```json). No explanation. Pure JSON only.
Structure:
{{
  "title": "SEO optimized YouTube title (60 chars max)",
  "description": "Full YouTube description with timestamps",
  "tags": ["tag1", "tag2"],
  "hook": "First 30 seconds hook script",
  "cta": "Final CTA script",
  "scenes": [
    {{
      "scene_number": 1,
      "duration_seconds": 45,
      "narration": "Full voiceover text for this scene",
      "text_overlay": "Short caption max 8 words",
      "visual_description": "What appears on screen",
      "search_keyword": "stock footage search term",
      "image_prompt": "Detailed Pollinations.ai image prompt",
      "transition": "fade"
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
        
        content = response.choices[0].message.content.strip()
        # Clean markdown output if the model ignored the instruction
        if content.startswith("```json"):
            content = content.replace("```json", "", 1)
        if content.endswith("```"):
            content = content[:-3]
            
        return json.loads(content.strip())
        
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
        
        content = response.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content.replace("```json", "", 1)
        if content.endswith("```"):
            content = content[:-3]
            
        return json.loads(content.strip())
        
    except Exception as e:
        logger.error(f"Groq regenerate error: {str(e)}")
        raise e
