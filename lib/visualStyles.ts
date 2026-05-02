export const STYLE_MAP: Record<string, { id: string, label: string, colorGrade: string, cameraStyle: string, negativePrompt?: string, seedPrompt?: string }> = {
  cinematic: {
    id: 'cinematic',
    label: 'Cinematic',
    colorGrade: 'blue & green arc, teal and orange',
    cameraStyle: 'cinematic photography, dramatic lighting, shallow depth of field, 8K',
    negativePrompt: '--no text, watermarks, ugly, blurry, cartoon, anime, flat design',
    seedPrompt: '--seed 42 --cw 100'
  },
  ghibli: {
    id: 'ghibli',
    label: 'Ghibli / Anime',
    colorGrade: 'warm sunlight, vivid soft colors',
    cameraStyle: 'Studio Ghibli style, soft watercolor background, detailed foreground, hand-drawn',
    negativePrompt: '--no 3d, photorealistic, photography, ugly, watermark',
    seedPrompt: '--seed 42 --cw 100 --niji 6'
  },
  webcomic: {
    id: 'webcomic',
    label: 'Webcomic',
    colorGrade: 'vibrant flat colors, cell shaded',
    cameraStyle: 'Webtoon style, korean webcomic, dynamic perspective, sharp lines',
    negativePrompt: '--no 3d, photorealistic, photography, ugly',
    seedPrompt: '--seed 42 --cw 100 --niji 6'
  },
  watercolor: {
    id: 'watercolor',
    label: 'Watercolor',
    colorGrade: 'pastel, soft, muted colors',
    cameraStyle: 'watercolor painting, loose strokes, whimsical, natural lighting, expressive',
    negativePrompt: '--no 3d, realistic, sharp edges, digital art feel',
    seedPrompt: '--seed 42'
  },
  retro: {
    id: 'retro',
    label: 'Retro',
    colorGrade: 'faded, vintage, warm sepia tinted',
    cameraStyle: '1980s vintage anime/photography, vhs aesthetic, film grain, slight lens distortion',
    negativePrompt: '--no modern, crisp, 4k, ultra detailed, hyperrealistic',
    seedPrompt: '--seed 42'
  },
  '3d_render': {
    id: '3d_render',
    label: '3D Render',
    colorGrade: 'vibrant, high contrast, studio lighting',
    cameraStyle: '3D render, blender octane render, studio lighting, photorealistic materials, 8K',
    negativePrompt: '--no 2d, illustration, drawing, painting, ugly',
    seedPrompt: '--seed 42'
  },
  whiteboard: {
    id: 'whiteboard',
    label: 'Whiteboard',
    colorGrade: 'black on white, minimal colors',
    cameraStyle: 'whiteboard animation style, hand-drawn markers, black on white, educational illustration',
    negativePrompt: '--no photorealistic, 3d, complex shading, gradients',
    seedPrompt: '--seed 42'
  },
  paper_craft: {
    id: 'paper_craft',
    label: 'Paper Craft',
    colorGrade: 'vibrant solid colors, construction paper',
    cameraStyle: 'papercraft 3d, stop motion style, textured paper, studio lighting, macro photography',
    negativePrompt: '--no 2d, drawing, painting, realism, ugly',
    seedPrompt: '--seed 42'
  },
  pov: {
    id: 'pov',
    label: 'POV',
    colorGrade: 'naturalistic, raw, slight action cam look',
    cameraStyle: 'first person view, GoPro footage, wide angle lens, immersive perspective, photorealistic',
    negativePrompt: '--no third person, illustration, painting, drawing',
    seedPrompt: '--seed 42'
  },
  dark_noir: {
    id: 'dark_noir',
    label: 'Dark / Noir',
    colorGrade: 'high contrast black and white, deep shadows',
    cameraStyle: 'dark noir photography, dramatic shadow, moody atmosphere, film grain',
    negativePrompt: '--no vibrant colors, cheerful, bright, illustration',
    seedPrompt: '--seed 42'
  },
  infographic: {
    id: 'infographic',
    label: 'Infographic',
    colorGrade: 'clean, corporate blue and white',
    cameraStyle: 'flat design infographic, clean icons, data visualization, minimal, professional, white background',
    negativePrompt: '--no photorealistic, messy, clutter, 3d, detailed backgrounds',
    seedPrompt: '' // No characters needed, usually
  },
  stock_footage: {
    id: 'stock_footage',
    label: 'Stock Footage',
    colorGrade: 'neutral, clean, commercial',
    cameraStyle: 'commercial stock footage, high quality, generic, well-lit, professional photography, 4k',
    negativePrompt: '--no stylized, artistic, anime, illustration, drawing',
    seedPrompt: ''
  },
  pixel_art: {
    id: 'pixel_art',
    label: 'Pixel Art',
    colorGrade: '16-bit color palette, vibrant',
    cameraStyle: '16-bit pixel art, retro video game style, crisp pixels, isometric or 2d perspective',
    negativePrompt: '--no photorealistic, 3d, high resolution, soft gradients',
    seedPrompt: '--seed 42'
  },
  motion_graphic: {
    id: 'motion_graphic',
    label: 'Motion Graphic',
    colorGrade: 'vibrant flat colors, modern',
    cameraStyle: 'modern motion graphics style, geometric shapes, clean vectors, minimal flat design',
    negativePrompt: '--no photorealistic, textured, grungy, messy',
    seedPrompt: ''
  },
  documentary: {
    id: 'documentary',
    label: 'Documentary',
    colorGrade: 'realistic, grounded, maybe slightly desaturated',
    cameraStyle: 'news documentary footage, realistic, handheld camera feel, natural lighting, sharp',
    negativePrompt: '--no stylized, cartoon, 3d render, fantasy',
    seedPrompt: '--seed 42'
  },
  minimalist: {
    id: 'minimalist',
    label: 'Minimalist',
    colorGrade: 'monochrome with single accent color, lots of negative space',
    cameraStyle: 'minimalist design, lots of negative space, simple shapes, elegant, clean background',
    negativePrompt: '--no clutter, heavy details, messy, chaotic',
    seedPrompt: ''
  }
};

export function getStyleInfo(styleId: string) {
  return STYLE_MAP[styleId] || STYLE_MAP['cinematic'];
}

export function buildImagePromptDetails(styleId: string) {
  const style = getStyleInfo(styleId);
  return {
    cameraStyle: style.cameraStyle,
    colorGrade: style.colorGrade,
    negativePrompt: style.negativePrompt || '--no text, watermarks, ugly, blurry',
    seedPrompt: style.seedPrompt || ''
  };
}
