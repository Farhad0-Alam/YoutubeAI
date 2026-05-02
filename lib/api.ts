import { GoogleGenAI } from "@google/genai";

function createGeminiClient() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Add NEXT_PUBLIC_GEMINI_API_KEY to .env or switch to OpenAI/Ollama.");
  }

  return new GoogleGenAI({ apiKey });
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
Respond with valid JSON only. No markdown formatting (no \`\`\`json). Pure JSON only.
Structure:
{
  "ideas": [
    {
      "title": "SEO optimized, purely viral YouTube title here",
      "hook": "The first 5 seconds script that instantly grabs attention"
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
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            temperature: 0.8,
            responseMimeType: "application/json",
          }
        });
        responseText = response.text || "{}";
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
    scene_length?: number;
    script_style: string;
    visual_style?: string;
    niche_config?: any;
    aspect_ratio?: string;
    llm_model?: string;
    ollama_url?: string;
    ollama_model?: string;
  }) {
    const durationSeconds = Math.round(data.duration_minutes * 60);
    const targetSceneLength = data.scene_length || 15;
    const minWords = Math.max(20, Math.round((durationSeconds / 60) * 130));
    const maxWords = Math.max(30, Math.round((durationSeconds / 60) * 170));
    const sceneCount = Math.max(1, Math.round(durationSeconds / targetSceneLength)); // fallback to 1
    const prompt = `You are an elite YouTube content strategist. Write a highly detailed, compelling video script.
Topic: ${data.topic}
Target Duration: ${durationSeconds} seconds
Visual Style: ${data.visual_style || 'Match Niche Standard'}

CRITICAL INSTRUCTION: To successfully produce a full ${durationSeconds} second video, you absolutely MUST generate exactly ${sceneCount} separate, highly-meaningful scenes in the JSON array.
EACH SCENE represents roughly ${targetSceneLength} seconds of video. To maintain the storytelling pace and ensure the voiceover fits perfectly into ${targetSceneLength} seconds, the "narration" for EACH SCENE MUST contain exactly between ${Math.round(targetSceneLength * (25 / 15))} and ${Math.round(targetSceneLength * (33 / 15))} words.
DO NOT summarize. Give me the FULL exact long-form narration, scene by scene. The script must be incredibly deep, meaningful, and engaging.

IMPORTANT: Respond with valid JSON only. No markdown formatting (no \`\`\`json). Pure JSON only.
Structure:
{
  "title": "SEO optimized YouTube title",
  "description": "Full YouTube description",
  "tags": ["tag1", "tag2"],
  "hook": "First hook script",
  "cta": "Final CTA script",
  "scenes": [
    {
      "scene_number": 1,
      "duration_seconds": ${targetSceneLength},
      "narration": "Full voiceover paragraph for this specific block...",
      "text_overlay": "Short caption max 8 words",
      "visual_description": "Extremely detailed description of the exact visuals needed",
      "vfx": "Special effects layers or filters (e.g. film grain, bloom, slow motion)",
      "sound": "Sound design elements like whooshes, heartbeats, or specific foley",
      "music": "Music description (e.g. Piano D2, light shaker, tension building)",
      "search_keyword": "comma-separated list of at least 5 highly specific keywords for Capcut Media Library video search. Each keyword MUST be 1 to 3 words long. (e.g. 'futuristic city, night driving, neon glowing, city traffic, fast car')",
      "image_prompt": "Detailed generative AI image prompt. Combine subject, environment, lighting, lens, and all components below into a single cohesive string, ending with params like --ar 16:9",
      "image_color_grade": "Specific color palette or grading (e.g., cinematic teal and orange, desaturated, high contrast)",
      "image_camera_angle": "Camera angle and position (e.g., eye level, low angle, overhead, drone shot)",
      "image_mood": "Primary emotion or atmospheric keyword (e.g., intense, melancholic, ethereal, gritty)",
      "image_negative_prompt": "Unwanted elements to exclude (e.g., --no text, watermarks, ugly)",
      "image_seed": "A static integer seed for cross-scene consistency (e.g., --seed 847290)",
      "image_character_consistency": "Character reference weights if applicable (e.g., --cw 100)",
      "image_shot_type": "Framing of the subject (e.g., extreme close up, medium shot, wide establishing shot)",
      "image_quality": "Rendering quality parameters (e.g., --q 2 --style raw)",
      "image_lighting": "Specific lighting setup (e.g., dramatic low light, volumetric rays, soft studio box)",
      "image_environment": "Background and setting details (e.g., cluttered desk, neon-lit alleyway, minimalist room)",
      "video_prompt": "Detailed generative AI video prompt for the FULL scene. Explicitly describe camera movement (e.g., Pan left, Slow Zoom) and character/subject motion. Use this when generating the entire scene as one clip.",
      "transition": "transition style between clips",
      "camera_motion": "Explicit camera directions e.g. fast horizontal pan, static push-in, slow cinematic zoom",
      "color_grading": "Color grading intent e.g. cool blue tones for rejection scene, warm green tones for approval. HIGH contrast. LUT: cyberpunk preset.",
      "emotional_arc": "Emotional progression for this scene e.g. Fear -> Curiosity. Scene 1 triggers anxiety...",
      "timing_and_pacing": "Sub-scene breakdown of timing e.g. Duration 8-12s. Pan 1.5s. Cut to user 0.5s. Rhythm: fast -> slow -> pause.",
      "call_to_action_cue": "Specific CTA instructions for this scene e.g. 'No CTA in this scene — pure hook', or 'CTA appears in final scene with Link in bio'."
    }
  ],
  "total_duration_seconds": ${durationSeconds}
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
        throw new Error(`Ollama Script Generation Failed: ${await response.text()}. Have you started Ollama locally and set OLLAMA_ORIGINS="*" ?`);
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
              { role: "system", content: "You are a helpful JSON generation assistant. Always return valid raw JSON based on the user's prompt without backticks or markdown." },
              { role: "user", content: prompt }
            ]
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Qwen Script Generation Failed: ${await response.text()}`);
      }

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
              { role: "system", content: "You are a helpful JSON generation assistant. Always return valid raw JSON based on the user's prompt without backticks or markdown." },
              { role: "user", content: prompt }
            ]
          }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI Script Generation Failed: ${await response.text()}`);
      }

      const resData = await response.json();
      responseText = resData.choices?.[0]?.message?.content || "{}";

    } else {
      try {
        // Use Gemini API as fallback or if specifically requested
        const ai = createGeminiClient();
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            temperature: 0.7,
            responseMimeType: "application/json",
          }
        });
        responseText = response.text || "{}";
      } catch (err: any) {
        if (err?.status === 429 || err?.message?.includes("exceeded") || err?.status === "RESOURCE_EXHAUSTED") {
          throw new Error("Gemini API Quota Exceeded. Please try again later or switch to OpenAI/Ollama in settings.");
        }
        throw new Error(err?.message || "Failed to generate script with Gemini API.");
      }
    }

    try {
      let cleanText = responseText;
      // Strip markdown code block formatting if the model still surrounds it
      if (cleanText.includes("```")) {
        cleanText = cleanText.replace(/```json/gi, '').replace(/```/g, '').trim();
      }
      const result = JSON.parse(cleanText);
      return result;
    } catch (e) {
      console.error("Parse Error on AI Response:", responseText);
      throw new Error("Failed to parse AI response into JSON");
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
  }) {
    const numSubScenes = Math.max(1, Math.ceil(data.duration_seconds / 4));
    const subDuration = Math.round(data.duration_seconds / numSubScenes);
    const aiTool = data.ai_model || 'seedance2.0';
    const style = data.visual_style || 'cinematic';
    const ratio = data.aspect_ratio || '16:9';

    const prompt = `You are an elite cinematic visual director for AI video production.

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
      "video_prompt": "Camera: [exact movement]. Subject: [exact action].",
      "vfx": "Specific VFX for this moment",
      "sound": "Sound design elements",
      "music": "Music description",
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
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: { temperature: 0.7, responseMimeType: "application/json" }
        });
        responseText = response.text || "{}";
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
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: data.systemPrompt + "\n\n" + prompt,
          config: {
            temperature: 0.7
          }
        });
        responseText = response.text || "";
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
    const pexelsKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
    const openAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
    const pref = data.media_preference || "auto";

    let openAISize = "1792x1024";
    if (data.aspect_ratio === "9:16") {
      openAISize = "1024x1792";
    } else if (data.aspect_ratio === "1:1") {
      openAISize = "1024x1024";
    }

    const fetchImageAI = async (scene: any) => {
      const prompt = scene.image_prompt || scene.search_keyword || "beautiful cinematic shot";

      try {
        const req = await fetch("/api/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "image",
            key: openAIKey,
            payload: { prompt, size: openAISize }
          })
        });
        if (req.ok) {
          const resData = await req.json();
          if (resData.data && resData.data.length > 0 && resData.data[0].url) {
            return {
              scene_number: scene.scene_number,
              media_path: resData.data[0].url,
              media_type: "image" as const
            };
          }
        }
      } catch (e) {
        console.warn("OpenAI DALL-E generation failed, falling back to pollinations...", e);
      }

      // Fallback
      const seed = Math.floor(Math.random() * 999999);
      const encodedPrompt = encodeURIComponent(prompt);
      return {
        scene_number: scene.scene_number,
        media_path: `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1920&height=1080&nologo=true&seed=${seed}`,
        media_type: "image" as const
      };
    };

    let results = [];

    for (const scene of data.scenes) {
      scene.media_type = "image"; // default
      scene.media_path = "";
      scene.media_options = [];
      let foundVideo = false;

      if ((pref === "auto" || pref === "video") && pexelsKey) {
        try {
          const keywords = (scene.search_keyword || "landscape").split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0);

          for (const keyword of keywords.slice(0, 6)) { // max 6 keyword searches per scene
            const query = encodeURIComponent(keyword);
            const req = await fetch(`https://api.pexels.com/videos/search?query=${query}&per_page=1&orientation=landscape`, {
              headers: { Authorization: pexelsKey }
            });
            const res = await req.json();
            if (res.videos && res.videos.length > 0) {
              const vid = res.videos[0];
              const hdVideoFile = vid.video_files.find((v: any) => v.quality === 'hd' || v.width >= 1920) || vid.video_files[0];
              if (hdVideoFile && hdVideoFile.link) {
                scene.media_options.push({
                  media_path: hdVideoFile.link,
                  media_type: "video",
                  keyword: keyword,
                  thumbnail_url: vid.image
                });
              }
            }
          }

          if (scene.media_options.length > 0) {
            // Deduplicate options by URL
            const uniqueOptions = [];
            const seenUrls = new Set();
            for (const opt of scene.media_options) {
              if (!seenUrls.has(opt.media_path)) {
                seenUrls.add(opt.media_path);
                uniqueOptions.push(opt);
              }
            }
            scene.media_options = uniqueOptions;

            scene.media_path = scene.media_options[0].media_path;
            scene.media_type = "video";
            foundVideo = true;
          }
        } catch (e) {
          console.warn("Pexels fetch failed for scene:", scene.scene_number);
        }
      }

      if (!foundVideo && (pref === "auto" || pref === "image")) {
        const fallBackImg = await fetchImageAI(scene);
        scene.media_path = fallBackImg.media_path;
        scene.media_type = fallBackImg.media_type;
        scene.media_options = [fallBackImg];
      }

      results.push(scene);
    }

    return { scenes: results };
  },

  async generateTTS(data: any) {
    const openAIKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";
    const requestedVoice = data.voice || "alloy";

    const audioFiles = [];
    for (const s of data.scenes) {
      if (!s.narration) continue;

      try {
        const req = await fetch("/api/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "tts",
            key: openAIKey,
            payload: {
              input: s.narration,
              voice: requestedVoice
            }
          })
        });

        if (req.ok) {
          const resData = await req.json();
          if (resData.audioBase64) {
            const url = `data:audio/mp3;base64,${resData.audioBase64}`;
            audioFiles.push({
              scene_number: s.scene_number,
              url: url
            });
          }
        }
      } catch (e) {
        console.warn(`Failed TTS for scene ${s.scene_number}`, e);
      }
    }
    return { audio_files: audioFiles };
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

  async renderVideo(data: any) {
    // Mock the start of rendering
    return {
      job_id: `job_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      status: "queued"
    };
  }
};
