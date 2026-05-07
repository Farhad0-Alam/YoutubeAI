export function generateStoryboardPrompts(text: string) {
  const promptMap: Record<string, any> = {
    "earn lakhs of taka per month": {
        visual: `Young South Asian man in bedroom at night. Smartphone held above face, screen glowing. YouTube Studio dashboard visible on screen showing earnings counter spinning rapidly upward. Income numbers blur like slot machine, landing on massive sum. Golden coins burst outward from screen in all directions, physics-based rotation catching warm light.`,
        vfx: `Slot machine number spin, coin burst animation, screen glow bloom effect, parallax depth layering`,
        sound: `Notification ping with reverb tail, coins cascading in different pitches (C4, E4, G4, C5), cash register ding on peak income, sub-bass thud 60hz`,
        music: `Piano D2 and D3 octave, light shaker on off-beats, soft string pad swell, bass pulse matching 52 BPM heartbeat, D minor key, epic wonder mood`
    },
    
    "from YouTube": {
        visual: `Red YouTube play button materializes with pixel burst effect. Subscriber counter ticks upward rapidly. YouTube logo glows in center frame surrounded by golden particles.`,
        vfx: `Pixel burst animation, glowing red logo with motion blur, particle system spiraling inward, chromatic aberration flash`,
        sound: `YouTube notification sound, glitchy pixel dissolve effects, high frequency shimmer tone`,
        music: `Bright synth stab, uplifting string swell, energetic rhythm building`
    },

    "using your mobile phone": {
        visual: `Close-up of hand holding basic budget smartphone. Screen is only light source in dark bedroom. Fingers gripping phone, warm glow spilling across palm. Window with distant city lights visible in background bokeh.`,
        vfx: `Soft screen glow spillage, micro dust particles drifting, subtle vignette, catch-light on fingertips, camera pull-back revealing full face`,
        sound: `Soft whoosh on camera move, minimal ambient bedroom tone, subtle heartbeat beginning`,
        music: `Single sustained piano note D2, heavy reverb, silence as primary element`
    },

    "without speaking": {
        visual: `Extreme close-up of lips. Human mouth sealed shut, lips pressed firmly together. Single finger rises slowly and presses against closed lips in universal silence gesture. Deep black background, soft side lighting creates dramatic shadow.`,
        vfx: `Sharp focus on mouth and finger only, deep vignette, microexpression on lips, subtle lighting catch`,
        sound: `Cloth movement sound as finger touches lips, absolute silence emphasis, distant muffled ambience`,
        music: `Held unresolved dissonant chord, no melody, tension without release`
    },

    "without showing your face": {
        visual: `Silhouette of person sitting at desk with laptop. Face completely hidden in shadow, only dark outline visible. Laptop screen glows in front, YouTube analytics dashboard visible showing high subscriber and earnings numbers. Person has no face - just dark shape with successful channel before them.`,
        vfx: `Complete shadow obscuring face, screen glow providing only light, 100% opacity silhouette against lighter background, analytics numbers highlighted`,
        sound: `Typing sounds, faint computer hum, subtle screen notification, muffled celebration sounds in distance`,
        music: `Minor key strings, tension building, unresolved melody`
    },

    "sitting in front of the camera": {
        visual: `Wide establishing shot of simple home studio setup. Camera on tripod with red recording light blinking slow rhythm. Ring light positioned front-center, harsh illumination of empty chair. Chair is completely vacant - no one wants to sit there. Camera keeps recording patiently into emptiness. Red light blinks indifferently.`,
        vfx: `Red light flicker synced to heartbeat, slow push toward empty chair, practical lighting simulation, slightly handheld drift`,
        sound: `Ring light electrical hum 200hz, camera shutter mechanical click, red light blink sound, anxious silence`,
        music: `Minor key tension, wrong note intentional, bass pulse skipping beats`
    },

    "talking": {
        visual: `Close-up of mouth moving, speaking but no sound heard. Lips forming words clearly but audio is completely muted. Subtle facial expressions showing effort to speak. Warm side lighting on face.`,
        vfx: `Focus on mouth and lips, subtle jaw movement, light catching teeth briefly, ambient blur background`,
        sound: `Completely silent - no audio despite visible speech, emphasis of "without speaking" concept`,
        music: `Dissonant strings held steady, no musical resolution`
    },

    "they feel shy": {
        visual: `Young South Asian man standing at distance from camera on tripod. Takes one small hesitant step forward, then immediately stops. Looks down at his shoes, avoiding camera. Hands fidget together nervously in front of body. Feet frozen to floor. Shoulders turned inward. Perfect body language of pure shyness.`,
        vfx: `Body tension visible in shoulders, fidgeting hands motion, warm light on camera side, cold shadow on subject side, slightly soft focus on face`,
        sound: `Nervous shallow breathing barely audible, subtle heartbeat beginning to rise, faint floor creak as he shifts weight`,
        music: `Slow descending cello phrase, sad minor key, BPM 54, melancholic tone`
    },

    "afraid": {
        visual: `Same man now with both hands raised slowly, bringing them up to cover his entire face completely. Fingers spread across forehead and cheeks, completely self-concealing. Ring light continues blinking indifferently. Camera on tripod slowly pushes toward him regardless. He leans back in chair attempting to escape.`,
        vfx: `Slow motion 40% speed on face-covering moment, heavy weight added to gesture, vignette tightens hard inward, film grain increases noticeably, subtle handheld camera drift begins, screen pulses with heartbeat`,
        sound: `Deep cinematic impact boom as hands cover face, audio muffles suddenly as if ears covered simultaneously, heartbeat volume increases to 95 BPM anxious, glass shatter high frequency layer, breathing muffled`,
        music: `String cluster plays dissonant chord, piano wrong note intentional, bass pulse skips beat, cello descends D C Bb A sadness`
    },

    "don't want to show their face": {
        visual: `Slow dissolve transition. Ring light and camera fade away like smoke disappearing. Man now sitting alone by dark window at night staring out at city lights. His faint reflection barely visible in window glass. In the reflection - different version of himself: shoulders back confident, laptop on lap, soft glow on face, slight smile. Reflection only 35% opacity, only viewer can see it. Man unaware. Soap bubble rises beside his head, YouTube play button glows inside, golden coins drift in bubble. Bubble drifts up and silently pops at ceiling.`,
        vfx: `Separate reflection compositing layer, iridescent soap bubble with physics-based surface, glowing YouTube icon inside, bubble pop with 12-frame droplet burst, warm orange bokeh city lights, iris close from all edges to black, final glowing white dot center frame`,
        sound: `Wind hollow and lonely, three ascending bell tones magical shimmer, city ambience layer faint traffic, bubble pop clean and delicate heartbreaking, complete silence, single piano note D4 unresolved, sub-bass pulse on glowing dot`,
        music: `All instruments drop except piano, single unresolved D minor 7 chord held, no resolution, viewer brain demands continuation`
    }
  };

  const keys = Object.keys(promptMap);
  const matchedKeyword = keys.find(k => text.toLowerCase().includes(k.toLowerCase()));
  
  if (matchedKeyword) {
    return {
      keyword: matchedKeyword,
      ...promptMap[matchedKeyword]
    };
  }
  
  return null;
}

export function parseScriptByScenes(fullScript: string, videoDuration: number = 15) {
  const keywords = [
    "earn lakhs of taka per month",
    "using your mobile phone",
    "without showing your face",
    "don't want to show their face"
  ];
  const scenes: any[] = [];
  const sceneDuration = videoDuration / keywords.length;
  
  keywords.forEach((keyword, index) => {
    const details = generateStoryboardPrompts(keyword) || { visual: '', vfx: '', sound: '', music: '' };
    scenes.push({
      scene_number: index + 1,
      duration_seconds: sceneDuration,
      narration: fullScript.includes(keyword) ? `...${keyword}...` : `Narration covering ${keyword}`,
      search_keyword: keyword,
      visual_description: details.visual,
      vfx: details.vfx,
      sound: details.sound,
      music: details.music,
      image_prompt: '',
      text_overlay: '',
      transition: 'fade'
    });
  });
  return scenes;
}
