export interface NicheConfig {
  niche_id: string;
  display_name: string;
  emoji: string;
  estimated_cpm_range: string;
  script_tone: string;
  hook_style: string;
  thumbnail_colors: {
    background: string;
    primary_text: string;
    accent: string;
    secondary: string;
  };
  thumbnail_emotion: string;
  voiceover_style: string;
  music_mood: string;
  stock_keywords: string[];
  image_prompt_style: string;
  title_formula: string;
  recommended_duration: string;
  recommended_upload_time: string;
  tier?: 'platinum' | 'gold' | 'silver' | 'bronze';
  cpm?: { min: number; max: number };
  platforms?: Record<string, { score: number; note: string }>;
  bestStyles?: string[];
  avoidStyles?: string[];
  hookFormulas?: string[];
  keywords?: string[];
  monetization?: string[];
  contentPillars?: string[];
  audience?: { age: string; intent: string; retention: string };
  competitionLevel?: string;
  recommendedDuration?: [number, number];
}

export interface SubScene {
  sub_scene_number: number;
  duration_seconds: number;
  narration: string;
  text_overlay: string;
  image_prompt: string;
  video_prompt: string;
  vfx?: string;
  sound?: string;
  music?: string;
  camera_motion?: string;
  color_grading?: string;
  emotional_arc?: string;
  
  // Detailed Image Breakdown
  image_subject?: string;
  image_setting?: string;
  image_color_grade?: string;
  image_camera_angle?: string;
  image_mood?: string;
  image_negative_prompt?: string;
  image_seed?: string;
  image_character_consistency?: string;
  image_shot_type?: string;
  image_quality?: string;
  image_lighting?: string;
  image_environment?: string;
  image_style_modifier?: string;
  image_aspect_ratio?: string;

  // Detailed Video Breakdown
  timing_and_pacing?: string;
  transition?: string;
  call_to_action_cue?: string;

  // Added missing text overlay properties for sub-scenes
  text_position?: string;
  text_animation?: string;
  
  // Allow multiple text overlays per sub-scene
  multiple_text_overlays?: {
    text: string;
    position: string;
    animation: string;
    box_style: string;
    start_time?: number;
    duration?: number;
  }[];
}

export interface Scene {
  scene_number: number;
  duration_seconds: number;
  narration: string;
  text_overlay: string;
  text_position?: string;
  text_animation?: string;
  visual_description: string;
  search_keyword: string;
  image_prompt: string;
  video_prompt?: string;
  sub_scenes?: SubScene[];
  vfx?: string;
  sound?: string;
  music?: string;
  transition: string;
  transition_duration?: number;
  media_path?: string;
  media_type?: 'video' | 'image';
  media_options?: { media_path: string; media_type: string; keyword?: string; thumbnail_url?: string }[];
  audio_volume?: number;
  brightness?: number;
  contrast?: number;
  text_customization?: {
    fontFamily?: string;
    textColor?: string;
    backgroundColor?: string;
    animationStyle?: string;
  };
  camera_motion?: string;
  color_grading?: string;
  emotional_arc?: string;
  timing_and_pacing?: string;
  call_to_action_cue?: string;
  // Image Prompt Breakdown
  image_color_grade?: string;
  image_camera_angle?: string;
  image_mood?: string;
  image_negative_prompt?: string;
  image_seed?: string;
  image_character_consistency?: string;
  image_shot_type?: string;
  image_quality?: string;
  image_lighting?: string;
  image_environment?: string;
}

export interface ScriptData {
  title: string;
  description: string;
  tags: string[];
  hook: string;
  cta: string;
  scenes: Scene[];
  total_duration_seconds: number;
  niche_config?: NicheConfig;
  aspect_ratio?: string;
}

export interface Project {
  _id: string;
  title: string;
  niche_id: string;
  topic: string;
  script_style: string;
  duration_minutes: number;
  scene_length?: number;
  ai_model?: string;
  visual_style?: string;
  voice: string;
  aspect_ratio?: string;
  status: string;
  script_data?: ScriptData;
  scenes_data?: Scene[];
  settings: any;
  created_at: string;
  updated_at: string;
}

export interface Voice {
  id: string;
  name: string;
  gender: string;
  accent: string;
  label: string;
}
