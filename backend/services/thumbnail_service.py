import os
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
from backend.config.settings import settings

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

async def generate_thumbnail(title, subtitle, niche_config, bg_image_path, project_id):
    """Generates the thumbnail using Pillow"""
    try:
        # Load and resize background
        bg = Image.open(bg_image_path).convert("RGBA")
        bg = bg.resize((1280, 720))

        # Add generic dark gradient overlay
        overlay = Image.new("RGBA", (1280, 720), (0, 0, 0, 0))
        draw_overlay = ImageDraw.Draw(overlay)
        
        # Gradient simulation (top to bottom)
        for y in range(720):
            alpha = int(255 * (0.3 + (y / 720) * 0.4))
            draw_overlay.line([(0, y), (1280, y)], fill=(0, 0, 0, alpha))
            
        bg = Image.alpha_composite(bg, overlay)

        draw = ImageDraw.Draw(bg)
        
        try:
            font_title = ImageFont.truetype("/fonts/Montserrat-Bold.ttf", 85)
            font_subtitle = ImageFont.truetype("/fonts/Montserrat-Bold.ttf", 45)
        except:
            font_title = ImageFont.load_default()
            font_subtitle = ImageFont.load_default()

        # Config colors
        colors = niche_config.get("thumbnail_colors", {})
        primary = colors.get("primary_text", "#FFFFFF")
        accent = colors.get("accent", "#F5B400")
        
        # Draw text (centered)
        title_lines = [title[i:i+18] for i in range(0, len(title), 18)]
        y_offset = 300
        
        # Draw drop shadow and text
        for line in title_lines:
            # Shadow
            draw.text((103, y_offset+3), line, font=font_title, fill=hex_to_rgb("#000000"))
            # Text
            draw.text((100, y_offset), line, font=font_title, fill=hex_to_rgb(primary))
            y_offset += 90
            
        # Draw subtitle
        y_offset += 20
        draw.text((103, y_offset+2), subtitle, font=font_subtitle, fill=hex_to_rgb("#000000"))
        draw.text((100, y_offset), subtitle, font=font_subtitle, fill=hex_to_rgb(accent))

        # Output
        final_rgb = bg.convert("RGB")
        out_path = os.path.join(settings.THUMBNAILS_DIR, f"{project_id}.png")
        final_rgb.save(out_path, format="PNG")
        
        return out_path
    except Exception as e:
        print(f"Thumbnail generation failed: {e}")
        return None
