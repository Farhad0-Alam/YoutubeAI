import { GoogleGenerativeAI } from "@google/generative-ai";

function createGeminiClient() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Add NEXT_PUBLIC_GEMINI_API_KEY to .env or switch to OpenAI/Ollama.");
  }

  return new GoogleGenerativeAI(apiKey);
}

export const api = {
  createProject: async (data: any) => {
    // Generate mock project ID instead of db
    return {
      _id: `proj_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      ...data,
      created_at: new Date().toISOString()
    };
  },

  async generateHooksAndTitles(data: {
    niche_id: string;
    topic: string;
    llm_model?: string;
    ollama_url?: string;
    ollama_model?: string;
  }) {
    const prompt = `You are an elite YouTube content strategist. The user wants to make a video about: "${data.topic}".
Generate exactly 5 viral, highly-clickable YouTube Hook & Title pairs for this topic. 
The hooks MUST be emotionally gripping, controversial, or highly curiosity-driven, avoiding generic AI-sounding intros. It must sound like a real, passionate human creator.
Respond with valid JSON only. No markdown formatting (no \`\`\`json). Pure JSON only.
Structure:
{
  "ideas": [
    {
      "title": "SEO optimized, purely viral YouTube title here",
      "hook": "The first 5 seconds script that instantly grabs attention and sparks deep emotion or curiosity"
    }
  ]
}`;

    let responseText = "";
    const openAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
    const qwenKey = process.env.NEXT_PUBLIC_QWEN_API_KEY || "";
    const requestedModel = data.llm_model || "gemini";

    if (requestedModel === "ollama" && data.ollama_url) {
      const ollamaEndpoint = data.ollama_url.endsWith('/') ? `${data.ollama_url}api/chat` : `${data.ollama_url}/api/chat`;
      const response = await fetch(ollamaEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: data.ollama_model || "qwen2.5:14b",
          messages: [
            { role: "system", content: "You are a helpful JSON generation assistant. Always return valid raw JSON based on the user's prompt without backticks or markdown." },
            { role: "user", content: prompt }
          ],
          stream: false,
          format: "json"
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama Hooks Generation Failed: ${await response.text()}`);
      }

      const resData = await response.json();
      responseText = resData.message?.content || "{}";

    } else if (requestedModel === "qwen") {
      const response = await fetch("/api/qwen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          key: qwenKey,
          payload: {
            messages: [
              { role: "system", content: "You are a helpful JSON generation assistant. Always return valid raw JSON without markdown." },
              { role: "user", content: prompt }
            ]
          }
        })
      });
      if (!response.ok) throw new Error("Qwen Hooks Generation Failed");
      const resData = await response.json();
      responseText = resData.choices?.[0]?.message?.content || "{}";
    } else if (requestedModel === "openai") {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          key: openAIKey,
          payload: {
            messages: [
              { role: "system", content: "You are a helpful JSON generation assistant. Always return valid raw JSON without markdown." },
              { role: "user", content: prompt }
            ]
          }
        })
      });

      if (!response.ok) throw new Error("OpenAI Hooks Generation Failed");
      const resData = await response.json();
      responseText = resData.choices?.[0]?.message?.content || "{}";
    } else {
      try {
        const ai = createGeminiClient();
        const model = ai.getGenerativeModel({ 
          model: "gemini-2.0-flash",
          generationConfig: {
            temperature: 0.8,
            responseMimeType: "application/json",
          }
        });
        const result = await model.generateContent(prompt);
        responseText = result.response.text() || "{}";
      } catch (err: any) {
        if (err?.status === 429 || err?.message?.includes("exceeded") || err?.status === "RESOURCE_EXHAUSTED") {
          throw new Error("Gemini API Quota Exceeded. Please try again later or switch to OpenAI/Ollama in settings.");
        }
        throw new Error(err?.message || "Failed to generate content with Gemini API.");
      }
    }

    try {
      let cleanText = responseText;
      if (cleanText.includes("\`\`\`")) {
        cleanText = cleanText.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
      }
      return JSON.parse(cleanText);
    } catch (e) {
      console.error("Parse Error on AI Response:", responseText);
      throw new Error("Failed to parse AI response into JSON");
    }
  },

  async generateScript(data: {
    niche_id: string;
    topic: string;
    duration_minutes: number;
    script_style: string;
    extra_instructions?: string;
    llm_model?: string;
  }) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    try {
      const response = await fetch(`${backendUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche_id: data.niche_id,
          topic: data.topic,
          duration_minutes: data.duration_minutes,
          script_style: data.script_style,
          extra_instructions: data.extra_instructions || "",
          llm_model: data.llm_model || "groq"
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Script Generation Failed (${response.status}): ${errText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error("Backend Script Generation Error:", error);
      throw new Error(error.message || "Failed to generate script via backend");
    }
  },

  async generateSubScenePrompts(data: {
    narration: string;
    visual_description: string;
    search_keyword: string;
    duration_seconds: number;
    scene_number: number;
    visual_style?: string;
    aspect_ratio?: string;
    ai_model?: string;
    llm_model?: string;
    chunk_interval?: number;
    topic?: string;
    hook?: string;
    title?: string;
  }) {
    const interval = data.chunk_interval || 2;
    const numSubScenes = Math.max(1, Math.ceil(data.duration_seconds / interval));
    const subDuration = Math.round(data.duration_seconds / numSubScenes);
    const aiTool = data.ai_model || 'seedance2.0';
    const style = data.visual_style || 'cinematic';
    const ratio = data.aspect_ratio || '16:9';

    const prompt = `You are an elite cinematic visual director for AI video production.

PROJECT OVERVIEW:
- Topic: ${data.topic || 'N/A'}
- Title: ${data.title || 'N/A'}
- Hook: ${data.hook || 'N/A'}

SCENE CONTEXT:
- Scene Number: ${data.scene_number}
- Duration: ${data.duration_seconds}s
- Visual Style: ${style}
- Target AI Tool: ${aiTool} (optimize prompts for this tool)
- Aspect Ratio: ${ratio}
- Sub-scenes needed: ${numSubScenes} (each ~${subDuration}s)

FULL SCENE NARRATION:
"${data.narration}"

VISUAL DESCRIPTION:
"${data.visual_description}"

KEYWORDS: ${data.search_keyword}

TASK: Split this scene into exactly ${numSubScenes} sub-scenes for AI video production.

RULES:
1. SPLIT the narration evenly — each sub-scene gets 1-2 sentences from the narration IN ORDER
2. Image prompts must be hyper-detailed, cinematic, production-ready for ${aiTool}. Include: subject, environment, lighting, lens, camera angle, color palette, mood, and style modifiers
3. Video prompts must specify EXACT camera movement (slow zoom-in, pan left, dolly forward, etc.) and subject motion/animation
4. Use PROGRESSIVE camera angles across sub-scenes: wide establishing, medium shot, close-up, detail/macro
5. Each sub-scene must show a DIFFERENT visual moment — never repeat the same composition
6. Maintain character/subject consistency across all sub-scenes
7. VFX, sound, music should PROGRESS and BUILD across sub-scenes

Respond with valid JSON only. No markdown. Structure:
{
  "sub_scenes": [
    {
      "sub_scene_number": 1,
      "duration_seconds": ${subDuration},
      "narration": "First portion of the narration (1-2 sentences)",
      "text_overlay": "Short 3-6 word caption",
      "image_prompt": "Hyper-detailed cinematic image prompt...",
      "image_subject": "Main focus of the shot",
      "image_setting": "Background or environment",
      "image_mood": "Atmosphere keyword",
      "image_lighting": "Lighting setup",
      "image_color_grade": "Color grading or palette",
      "image_camera_angle": "Camera position",
      "image_shot_type": "Shot framing",
      "image_style_modifier": "Style keywords",
      "image_aspect_ratio": "e.g. --ar 16:9",
      "image_seed": "Static integer seed (keep consistent)",
      "image_quality": "Rendering params (e.g. --q 2 --style raw)",
      "image_character_consistency": "Character ref weights (e.g. --cw 100)",
      "image_negative_prompt": "Unwanted elements (e.g. --no text, watermarks)",
      "video_prompt": "Camera: [exact movement]. Subject: [exact action]. Include explicit instructions for any integrated AI audio/voice (e.g., Grok, Veo 3.1, Seedance) to be highly expressive, emotional, and human-like to ensure YouTube monetization safety.",
      "vfx": "Specific VFX for this moment",
      "sound": "Specific Foley/SFX (e.g., heavy bass impact, digital glitch, cinematic whoosh)",
      "music": "Music track style and pacing (e.g., suspenseful dark synth, fast-paced phonk)",
      "camera_motion": "Exact camera direction",
      "color_grading": "Color palette and grade",
      "emotional_arc": "Emotion at this moment",
      "timing_and_pacing": "Sub-scene timing details",
      "transition": "Transition style to next sub-scene",
      "call_to_action_cue": "Any CTA details"
    }
  ]
}`;

    let responseText = "";
    const openAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
    const requestedModel = data.llm_model || "gemini";

    if (requestedModel === "openai") {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          key: openAIKey,
          payload: {
            messages: [
              { role: "system", content: "You are a cinematic visual director. Return valid JSON only." },
              { role: "user", content: prompt }
            ]
          }
        })
      });
      if (!response.ok) throw new Error("OpenAI sub-scene generation failed");
      const resData = await response.json();
      responseText = resData.choices?.[0]?.message?.content || "{}";
    } else {
      try {
        const ai = createGeminiClient();
        const model = ai.getGenerativeModel({ 
          model: "gemini-2.0-flash",
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          }
        });
        const result = await model.generateContent(prompt);
        responseText = result.response.text() || "{}";
      } catch (err: any) {
        if (err?.status === 429 || err?.message?.includes("exceeded") || err?.status === "RESOURCE_EXHAUSTED") {
          throw new Error("Gemini API Quota Exceeded.");
        }
        throw new Error(err?.message || "Failed to generate sub-scene prompts.");
      }
    }

    try {
      let cleanText = responseText;
      if (cleanText.includes("\`\`\`")) {
        cleanText = cleanText.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
      }
      return JSON.parse(cleanText);
    } catch (e) {
      console.error("Parse Error:", responseText);
      throw new Error("Failed to parse sub-scene prompts");
    }
  },

  async generateViralEngineContent(data: {
    topic: string;
    niche: string;
    runtime: number;
    aspectRatio: string;
    targetAudience?: string;
    visualStyle?: string;
    sceneLength?: number;
    llm_model?: string;
    systemPrompt: string;
  }) {
    const prompt = `User Request:
Topic: ${data.topic}
Niche: ${data.niche}
Target Audience: ${data.targetAudience || 'General Audience'}
Visual Style: ${data.visualStyle || 'Match Niche Standard'}
Target Scene Length: ${data.sceneLength || 5} seconds
Runtime: ${data.runtime} minutes
Aspect Ratio: ${data.aspectRatio}

INSTRUCTIONS: 
You are the CREATORSTUDIO MASTER VIRAL ENGINE.
Do NOT wait for the user to type 'start' or 'Next'.
Immediately generate ALL blocks for the requested runtime, followed by the YOUTUBE DOMINATION PACKAGE.
Adhere strictly to the Output Format specified in your system instructions. Produce the complete output now.`;

    const openAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
    const requestedModel = data.llm_model || "gemini";
    let responseText = "";

    if (requestedModel === "openai") {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          key: openAIKey,
          payload: {
            messages: [
              { role: "system", content: data.systemPrompt },
              { role: "user", content: prompt }
            ]
          }
        })
      });
      if (!response.ok) throw new Error("OpenAI Engine Generation Failed");
      const resData = await response.json();
      responseText = resData.choices?.[0]?.message?.content || "";
    } else {
      try {
        const ai = createGeminiClient();
        const model = ai.getGenerativeModel({ 
          model: "gemini-2.0-flash",
          generationConfig: {
            temperature: 0.7
          }
        });
        const result = await model.generateContent(data.systemPrompt + "\n\n" + prompt);
        responseText = result.response.text() || "";
      } catch (err: any) {
        if (err?.status === 429 || err?.message?.includes("exceeded") || err?.status === "RESOURCE_EXHAUSTED") {
          throw new Error("Gemini API Quota Exceeded. Please try again later or switch to OpenAI/Ollama in settings.");
        }
        throw new Error(err?.message || "Failed to generate content with Gemini API.");
      }
    }

    return { output: responseText };
  },

  async fetchMedia(data: { niche_id: string; scenes: any[]; media_preference?: "video" | "image" | "auto"; aspect_ratio?: string }) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    try {
      const response = await fetch(`${backendUrl}/api/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche_id: data.niche_id,
          scenes: data.scenes.map(s => ({
            scene_number: s.scene_number,
            duration_seconds: s.duration_seconds || 10,
            search_keyword: s.search_keyword || "",
            image_prompt: s.image_prompt || ""
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Backend Media Fetch Failed");
      }

      const backendData = await response.json();
      
      // Merge results back into original scenes array
      const mergedScenes = data.scenes.map(scene => {
        const matchingResult = backendData.scenes?.find((r: any) => r.scene_number === scene.scene_number);
        if (matchingResult) {
          return {
            ...scene,
            media_path: matchingResult.media_path,
            media_type: matchingResult.media_type,
            media_options: [matchingResult]
          };
        }
        return scene;
      });

      return { scenes: mergedScenes };
    } catch (error) {
      console.error("Media Error:", error);
      throw error;
    }
  },

  async generateTTS(data: any) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    try {
      const response = await fetch(`${backendUrl}/api/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voice: "en-US-AriaNeural", // default Edge-TTS voice
          scenes: data.scenes.map((s: any) => ({
            scene_number: s.scene_number,
            narration: s.narration
          }))
        })
      });

      if (!response.ok) throw new Error("Backend TTS Failed");
      
      const result = await response.json();
      
      // Map file_paths to URLs by extracting the filename
      const audioFiles = result.audio_files.map((file: any) => {
        // file.file_path might be an absolute path (e.g. C:\Users\...\temp\scene_1_audio.mp3)
        // Extract just the filename to match the /temp static mount in FastAPI
        const filename = file.file_path.split('\\').pop().split('/').pop();
        return {
          scene_number: file.scene_number,
          url: `${backendUrl}/temp/${filename}`
        };
      });
      
      return { audio_files: audioFiles };
    } catch (e) {
      console.error("Backend TTS Error:", e);
      throw e;
    }
  },

  async getVoices() {
    return [
      { id: "alloy", name: "Alloy", gender: "Neutral", accent: "American", label: "Neutral" },
      { id: "echo", name: "Echo", gender: "Male", accent: "American", label: "Mellow" },
      { id: "fable", name: "Fable", gender: "Male", accent: "British", label: "Expressive" },
      { id: "onyx", name: "Onyx", gender: "Male", accent: "American", label: "Deep" },
      { id: "nova", name: "Nova", gender: "Female", accent: "American", label: "Professional" },
      { id: "shimmer", name: "Shimmer", gender: "Female", accent: "American", label: "Clear" }
    ];
  },

  async generateThumbnail(data: { title?: string; subtitle?: string; background_prompt: string }) {
    const openAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
    const promptParams = `Create a professional YouTube thumbnail background. Art direction style: ${data.background_prompt}. Make it high contrast, vibrant, suitable for adding text over it later. Do NOT include any text or words inside the image.`;

    try {
      const req = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "image",
          key: openAIKey,
          payload: { prompt: promptParams, size: "1792x1024" }
        })
      });
      if (req.ok) {
        const resData = await req.json();
        if (resData.data && resData.data.length > 0 && resData.data[0].url) {
          return { thumbnail_url: resData.data[0].url };
        }
      }
    } catch (e) {
      console.warn("OpenAI Thumbnail generation failed, falling back to pollinations...", e);
    }

    // Generate a background using pollinations fallback
    const seed = Math.floor(Math.random() * 99999);
    const p = encodeURIComponent(promptParams);
    return {
      thumbnail_url: `https://image.pollinations.ai/prompt/${p}?width=1280&height=720&nologo=true&seed=${seed}`
    };
  },

  async generateImage(data: { prompt: string }) {
    const openAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
    if (!openAIKey) throw new Error("OPENAI_API_KEY is not set for image generation");

    const req = await fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "image",
        key: openAIKey,
        payload: { prompt: data.prompt, size: "1024x1024" }
      })
    });
    
    if (!req.ok) throw new Error("Image generation failed");
    const resData = await req.json();
    if (resData.data && resData.data.length > 0 && resData.data[0].url) {
      return resData.data[0].url;
    }
    throw new Error("No image URL returned");
  },

  async generateSEOPackage(data: { script: string; title: string; niche: string; llm_model?: string }) {
    const prompt = `You are an elite YouTube SEO strategist. Based on the following video script, generate a complete, highly-optimized YouTube metadata package.
    
    Topic: ${data.title}
    Niche: ${data.niche}
    
    Script:
    ${data.script.substring(0, 3000)} // Truncated for safety

    Requirements:
    1. 3 highly clickable, emotional, or curiosity-driven titles (max 60 chars each).
    2. A keyword-rich description (first 2 lines must hook the viewer, include relevant links placeholders, and end with a call to action). DO NOT INCLUDE TIMESTAMPS in the description body (we will auto-generate them).
    3. Generate enough viral tags so that their combined length (comma-separated) is strictly between 450 and 500 characters.
    4. 1 highly engaging or controversial pinned comment to drive early interaction.

    Respond with valid JSON only. No markdown. Structure:
    {
      "titles": ["Title 1", "Title 2", "Title 3"],
      "description": "Full description here...",
      "tags": ["tag1", "tag2", "tag3"],
      "pinned_comment": "The comment text here..."
    }`;

    let responseText = "";
    const openAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
    const requestedModel = data.llm_model || "gemini";

    if (requestedModel === "openai") {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          key: openAIKey,
          payload: {
            messages: [
              { role: "system", content: "You are an elite YouTube SEO strategist. Return valid JSON only." },
              { role: "user", content: prompt }
            ]
          }
        })
      });
      if (!response.ok) throw new Error("OpenAI SEO generation failed");
      const resData = await response.json();
      responseText = resData.choices?.[0]?.message?.content || "{}";
    } else {
      try {
        const ai = createGeminiClient();
        const model = ai.getGenerativeModel({ 
          model: "gemini-2.0-flash",
          generationConfig: {
            temperature: 0.8,
            responseMimeType: "application/json",
          }
        });
        const result = await model.generateContent(prompt);
        responseText = result.response.text() || "{}";
      } catch (err: any) {
        throw new Error("Failed to generate SEO with Gemini API.");
      }
    }

    try {
      let cleanText = responseText;
      if (cleanText.includes("\`\`\`")) {
        cleanText = cleanText.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
      }
      return JSON.parse(cleanText);
    } catch (e) {
      console.error("Parse Error:", responseText);
      throw new Error("Failed to parse SEO prompts");
    }
  },

  async renderVideo(data: any) {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    try {
      const response = await fetch(`${backendUrl}/api/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: data.project_id || `proj_${Date.now()}`,
          scenes: data.scenes.map((s: any) => ({
            scene_number: s.scene_number,
            media_path: s.media_path,
            text_overlay: s.text_overlay || "",
            transition: "fade"
          })),
          audio_files: data.audio_files || [],
          resolution: "1080p",
          caption_style: "default",
          add_music: false,
          music_mood: "neutral"
        })
      });

      if (!response.ok) throw new Error("Backend Render Failed");
      return await response.json();
    } catch (e) {
      console.error("Render error:", e);
      throw e;
    }
  }
};
