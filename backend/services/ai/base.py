import json
import re
import logging

logger = logging.getLogger(__name__)

def extract_json(text: str) -> dict:
    """Bulletproof JSON extraction — handles markdown fences and extra text."""
    # Look for the last { ... } block in case there's preamble
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            # Try to fix common issues like trailing commas if needed
            pass
    raise ValueError(f"No JSON found in AI response: {text[:300]}")
