"""
Unified AI Service — Routes to modularized AI brain components.
This file serves as a facade for the new backend/services/ai/ structure.
"""

from backend.services.ai.base import extract_json, logger
from backend.services.ai.prompts import (
    get_model_prompt_rules,
    build_system_prompt,
    build_user_prompt,
    YOUTUBE_POLICY_BLOCK,
    VISUAL_STORYTELLING_BLOCK,
    AUDIO_PRODUCTION_BLOCK
)
from backend.services.ai.providers import (
    call_groq,
    call_openai,
    call_gemini,
    call_claude,
    call_grok,
    PROVIDER_MAP
)
from backend.services.ai.script_service import generate_with_model, rewrite_scene_content
from backend.services.ai.idea_service import generate_ideas
from backend.services.ai.thumbnail_service import generate_thumbnail_prompts
