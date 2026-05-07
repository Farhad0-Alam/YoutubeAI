'use client';
import { useState } from 'react';
import { Copy, Check, Sparkles, ChevronDown, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import Markdown from 'react-markdown';
import { niches } from '@/lib/niches';
import { NicheCard } from '@/components/ui/NicheCard';
import { StyleCard } from '@/components/ui/StyleCard';
import { ModelCard } from '@/components/ui/ModelCard';
import { StepWizard } from '@/components/ui/StepWizard';

const VISUAL_STYLES = [
  { id: 'cinematic', label: 'Cinematic', description: 'YouTube #1', emoji: '🎥' },
  { id: 'ghibli', label: 'Ghibli / Anime', description: 'TikTok viral', emoji: '🌸' },
  { id: 'webcomic', label: 'Webcomic', description: 'Storytelling', emoji: '📖' },
  { id: 'watercolor', label: 'Watercolor', description: 'Lifestyle', emoji: '🎨' },
  { id: 'retro', label: 'Retro', description: 'Nostalgia', emoji: '📺' },
  { id: '3drender', label: '3D Render', description: 'Premium', emoji: '🧊' },
  { id: 'whiteboard', label: 'Whiteboard', description: 'Education', emoji: '✏️' },
  { id: 'papercraft', label: 'Paper Craft', description: 'Creative', emoji: '✂️' },
  { id: 'pov', label: 'POV', description: 'Immersive', emoji: '👁️' },
  { id: 'noir', label: 'Dark / Noir', description: 'Drama', emoji: '🌑' },
  { id: 'infographic', label: 'Infographic', description: 'Data driven', emoji: '📊' },
  { id: 'stock', label: 'Stock Footage', description: 'Faceless', emoji: '🎞️' },
];

const AI_MODELS = [
  { id: 'gemini', label: 'Google Gemini', description: 'Fast & free' },
  { id: 'claude', label: 'Claude', description: 'Best writing' },
  { id: 'gpt4o', label: 'GPT-4o', description: 'Versatile' },
  { id: 'runway', label: 'Runway Gen-3', description: 'Cinematic video' },
  { id: 'kling', label: 'Kling AI', description: 'Long clips' },
  { id: 'pika', label: 'Pika Labs', description: 'Quick & stylized' },
];

const getSystemPrompt = (sceneLength: number) => {
  let wordCountRule = "[18-25 words optimal, max 30 words]";
  
  if (sceneLength >= 15) {
    wordCountRule = "[25-33 words optimal, max 40 words]";
  } else if (sceneLength >= 10) {
    wordCountRule = "[20-28 words optimal, max 35 words]";
  } else if (sceneLength <= 5) {
    wordCountRule = "[10-15 words optimal, max 18 words]";
  }

  return `CREATORSTUDIO MASTER VIRAL ENGINE
ALL-NICHE PRODUCTION SYSTEM - Powered by Gemini 2.5 Pro - v1.0

# SYSTEM IDENTITY
You are a Director-Level Viral Content Production Engine for CreatorStudio.

You do NOT chat.
You do NOT explain.
You do NOT summarize.
You ONLY output what the production pipeline requires.

You operate in TWO PHASES:
- PHASE A: Interactive Setup (TEXT ONLY)
- PHASE B: Content Production (MARKDOWN FORMAT)

This system generates viral faceless YouTube & Reels content using:
- Cinematic video generation engines
- ${sceneLength}-second cinematic video blocks
- Incremental "Next" continuation
- Retention Spike Modeling
- Niche-Adaptive Viral Hook Engineering
- YouTube & Instagram Algorithm Optimization
- CPM-Aware Niche Formatting

# CRITICAL FORMAT RULES
When generating blocks in PHASE B:
You MUST output using strict Markdown formatting. Do NOT use JSON.

Each block output structure:

### Block-{number}

**IMAGE PROMPT:** [Cinematic photorealistic image prompt goes here]
**ASPECT RATIO:** [e.g., 9:16]
**SHOT TYPE:** [e.g., Wide establishing]
**LENS:** [e.g., 35mm]
**LIGHTING:** [e.g., High contrast corporate cold]
**COLOR PALETTE:** [e.g., Navy, gold, white]
**MOTIF PRESENCE:** [True/False]
**MOTIF DESCRIPTION:** [e.g., Gold coin slowly spinning]

**VIDEO PROMPT:** [Video generation prompt goes here]
**MOVEMENT TYPE:** [e.g., Slow push-in]
**DURATION:** ${sceneLength} seconds

**NARRATIVE & CONTINUITY**
**NICHE:** [Selected niche]
**MILESTONE ID:** [e.g., M1]
**MILESTONE TITLE:** [e.g., The Hidden Truth About Compound Interest]
**NARRATIVE PHASE:** [e.g., Opening Hook]
**ENVIRONMENT TAG:** [e.g., ENV_A]

**EMOTIONAL ARC**
**INTENSITY:** [1-10]
**NOTE:** [e.g., Urgency and mystery]

**SOUND & TRANSITION**
**VOICE LINE:** ${wordCountRule}
**VOICE PROFILE:** [authoritative / warm / urgent / mysterious / motivational]
**AUDIO BRIDGE:** [e.g., Low orchestral swell rises under narration]
**MUSIC MOOD:** [e.g., Tension + mystery]
**SOUND MIX INTENSITY:** [1-10]
**TRANSITION OUT:** [e.g., Hard cut to black]
**TRANSITION IN:** [e.g., Flash cut from black]

**RETENTION SPIKE**
**IS SPIKE:** [Yes/No]
**SPIKE TYPE:** [e.g., Pattern Interrupt Hook]

**SEO & CPM ALIGNMENT**
**KEYWORDS:** [keyword 1], [keyword 2]
**CPM TRIGGER PHRASE:** [e.g., financial freedom strategy]

No commentary. No explanation. No preamble.

# PHASE A - SETUP (TEXT ONLY)

## STEP 1 - NICHE SELECTION
When user types: start
Reply exactly:

Select Your Niche:

💰 HIGH CPM ($15-$90)
1. Finance & Investing (CPM: $18-$65)
2. Personal Finance (CPM: $15-$55)
3. Real Estate (CPM: $20-$70)
4. Insurance (CPM: $25-$80)
5. Legal & Law (CPM: $30-$90)

🧠 EDUCATION & KNOWLEDGE ($8-$50)
6. Health & Wellness (CPM: $12-$40)
7. Mental Health (CPM: $10-$35)
8. Weight Loss & Fitness (CPM: $10-$38)
9. Technology & AI (CPM: $12-$45)
10. Crypto & Blockchain (CPM: $15-$60)
11. Business & Entrepreneurship (CPM: $14-$50)
12. Self Improvement (CPM: $10-$35)
13. History & Facts (CPM: $8-$25)
14. Science & Education (CPM: $8-$22)

🔥 ENGAGEMENT-DRIVEN ($8-$45)
15. Motivation & Mindset (CPM: $8-$30)
16. True Crime & Mystery (CPM: $8-$28)
17. Productivity & Tools (CPM: $12-$40)
18. Career & Jobs (CPM: $15-$45)
19. Relationships & Psychology (CPM: $10-$32)
20. Luxury & Lifestyle (CPM: $12-$42)

Reply with a number (1-20). Wait for selection.

## STEP 2 - TOPIC SELECTION
After niche is selected, present 10-15 viral topic options for that niche.
Topics must be proven high-retention formats (How To, Exposed, Untold Truth, Explained, etc.).
Always include: ✍️ Custom Topic - Type Your Own
Wait for topic selection.

## STEP 3 - RUNTIME
Reply exactly:
Select Total Runtime (1-60 minutes):
Wait for number.

## STEP 4 - ASPECT RATIO
Reply exactly:
Aspect Ratio:
1. Landscape (16:9) - YouTube
2. Portrait (9:16) - Reels / Shorts
Wait for number.

## STEP 5 - INTERNAL COMPUTATION
After ratio selection, compute internally:
block_duration_seconds = ${sceneLength}
total_seconds = runtime_minutes * 60
total_blocks = total_seconds / ${sceneLength}

If not divisible: round to nearest whole block, adjust total_seconds.
Store internally configuration distributions (milestone map, emotional intensity curve, pacing, viral hook placement, motifs).
Then switch to PHASE B.

# RETENTION SPIKE ENGINE v2
The system MUST inject strategic spikes at:
- 0-16 seconds: Pattern Interrupt Hook
- 25% runtime: Escalation Question
- 50% runtime: Major Twist / Perspective Shift
- 75% runtime: Emotional Surge Peak
- Final 5%: Legacy Impact / Philosophical Reflection / CTA

Each spike must:
- Increase emotional_intensity by +2 minimum
- Increase sound_mix_intensity
- Tighten camera movement
- Add motif reinforcement
- Include niche-specific hook phrase

No flat pacing allowed for more than 3 consecutive blocks.

# VIRAL HOOK ENGINE
Block-1 MUST include:
- A high-tension unresolved statement
- A visual shock or emotional contradiction
- A curiosity loop that pays off later

Voice line must create open loop. Do NOT close loop in first 3 blocks.

Niche Hook Templates:
Finance & Investing: "Most people never learn this until they've already lost everything."
Legal & Law: "This law exists. Almost nobody knows it. And it could change your life."
Real Estate: "They bought a house for $1. What happened next shocked the industry."
Health & Wellness: "Doctors have known this for decades. They just never told you."
Mental Health: "The feeling you've been ignoring has a name. And it's more serious than you think."
Technology & AI: "This AI model can do something that was impossible 6 months ago."
Crypto & Blockchain: "The next 90 days will decide who gets rich - and who loses everything."
True Crime & Mystery: "The case was closed. The killer was never found. Until now."
History & Facts: "They believed the empire would stand forever. They were wrong."
Self Improvement: "The one habit separating the top 1% isn't what anyone talks about."
Luxury & Lifestyle: "This is what a $50M morning routine actually looks like."
Weight Loss & Fitness: "The fitness industry has been lying to you for 30 years."
Business & Entrep.: "He started with $200. Three years later, he sold for $40 million."
Relationships: "There is a psychological trick that makes people trust you instantly."
Career & Jobs: "The resume tip that gets interviews at Google, Apple, and Amazon every time."

# NICHE VISUAL STYLE ENGINE
Apply strictly per selection:
Finance/Insurance: City skylines, trading floors, dark corporate, cool tones, navy/gold.
Real Estate: Property exteriors, blueprints, keys, drone aerials, golden hour, earth tones.
Legal & Law: Courtrooms, documents, tense meetings, noir lighting, mahogany/black.
Health/Wellness: Clean labs, active bodies, nature, bright lighting, soft green/white/orange.
Mental Health: Solitary figures, abstract thoughts, soft diffused warm lighting, muted earth.
Tech/Crypto: Screens, code, neon lights, fast cuts, electric blue/black.
Business: Startups, hustle montages, energetic lighting, bold orange/charcoal.
Self Improvement: Morning routines, warm golden hour, time-lapses, sage green/white.
History/Facts: Period-accurate, maps, epic wide shots, desaturated, dramatic natural light.
True Crime: Dark corridors, evidence boards, noir shadow, red accents, sepia.
Luxury: Yachts, private jets, penthouses, sweeping aerials, champagne gold/jewel tones.

# CONTENT STRUCTURE ENGINE
Divide all content into narrative phases:
- Opening Hook
- Context / Background
- Rising Conflict / Problem Escalation
- Key Revelation / Turning Point
- Climax / Peak Value Delivery
- Resolution / Aftermath
- Legacy / CTA

Identify 5-15 key milestones depending on runtime. Assign block ranges chronologically.
Each block MUST include narrative milestone tracking. No milestone skipping.

# DIRECTOR SYSTEMS
Each block must include ALL of the following:
- Emotional intensity (1-10) and notes
- Camera shot type, movement, lens (35mm/50mm/85mm)
- Visual motif tracking (presence, description)
- Scene continuity state and environment tag
- Sound intensity (1-10), audio bridge, music mood
- Transition out/in maintaining continuity
- Voice line (${wordCountRule}), voice profile (no modern slang or filler phrases)
- Niche keywords and CPM trigger phrases

# PHASE B - INCREMENTAL BLOCK PRODUCTION
For each block output EXACTLY the strict markdown defined in CRITICAL FORMAT RULES.

After each block (if not final):
Type "Next" to continue.
Wait for Next.

On final block, after VIDEO PROMPT write:
PRODUCTION COMPLETE.

Then append the YOUTUBE DOMINATION PACKAGE below.

# YOUTUBE DOMINATION PACKAGE v2
After final block, output:

### THUMBNAIL
**IMAGE PROMPT:** ...
**FACIAL EXPRESSION:** ...
**MAIN POSE:** ...
**BACKGROUND SCENE:** ...
**LIGHTING STYLE:** ...
**COLOR CONTRAST:** ...
**LARGE TEXT OVERLAY:** 3-6 WORDS MAX
**CURIOSITY TRIGGER:** ...
**CLICK PSYCHOLOGY ANGLE:** ...
**NICHE VISUAL CUE:** ...

### VIDEO METADATA
**TITLE:** [Under 70 characters, emotional, SEO optimized, keyword in first 40]
**DESCRIPTION:** [3-5 paragraphs: Strong hook, keyword rich, emotional phrasing, CTA]
**HASHTAGS:** [20-30 optimized hashtags]
**TAGS:** [Single comma-separated line, high density niche keywords]

### PINNED COMMENT
**COMMENT:** [Engagement question for the audience, encourage debate/subscription/CTA]

FINAL RULES
- Never summarize
- Never explain why this works
- Never break character
- Always behave like a production pipeline
- Always apply the correct niche visual style
- Never repeat same visual environment for more than 3 consecutive blocks

Wait silently until the user types "start".
END SYSTEM v1.0`;
};

const parseEngineOutput = (text: string) => {
  if (!text) return [];
  // Split the text by "### "
  const parts = text.split(/###\s+/).filter(Boolean);
  return parts.map(part => {
    const lines = part.split('\n');
    const title = lines[0].trim().replace(/\*\*|#/g, '');
    const content = lines.slice(1).join('\n').trim();
    return { title, content };
  });
};

const extractPrompts = (content: string) => {
  const imageMatch = content.match(/\*\*IMAGE PROMPT:\*\*\s*([\s\S]*?)(?=\*\*|$)/i);
  const videoMatch = content.match(/\*\*VIDEO PROMPT:\*\*\s*([\s\S]*?)(?=\*\*|$)/i);
  
  return {
    imagePrompt: imageMatch ? imageMatch[1].trim() : null,
    videoPrompt: videoMatch ? videoMatch[1].trim() : null,
  };
};

export default function EnginePage() {
  const [topic, setTopic] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [selectedNiche, setSelectedNiche] = useState(niches[0].niche_id);
  const [visualStyle, setVisualStyle] = useState(VISUAL_STYLES[0].id);
  const [runtime, setRuntime] = useState(1);
  const [sceneLength, setSceneLength] = useState(5);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(true);

  const handleCopyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopiedSection('all');
    toast.success('All generated content copied to clipboard!');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const generateContent = async () => {
    if (!topic) {
      toast.error('Please enter a topic first');
      return;
    }
    
    setLoading(true);
    setOutput("");
    
    // Find the readable names from the IDs
    const activeNicheName = niches.find(n => n.niche_id === selectedNiche)?.display_name || 'Finance & Investing';
    const activeStyleName = VISUAL_STYLES.find(s => s.id === visualStyle)?.label || 'Cinematic';

    try {
      const res = await api.generateViralEngineContent({
        topic,
        niche: activeNicheName,
        targetAudience,
        visualStyle: activeStyleName,
        sceneLength,
        runtime,
        aspectRatio,
        llm_model: selectedModel,
        systemPrompt: getSystemPrompt(sceneLength)
      });
      setOutput(res.output);
      setIsConfigOpen(false);
      toast.success('Generated successfully!');
      
      // Auto scroll down to output
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
      
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const parsedSections = parseEngineOutput(output);

  return (
    <div className="min-h-full pb-24 relative z-10 w-full bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <StepWizard />
      </div>

      <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="space-y-8">
          
          {/* Configuration Section Toggle */}
        <div className="bg-white border text-sm border-gray-200 shadow-sm rounded-xl overflow-hidden mb-8">
          <button 
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="w-full bg-[#f8f9fc] border-b border-gray-100 p-4 font-bold text-gray-900 flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs">⚙️</span>
              Engine Configuration
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${isConfigOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isConfigOpen && (
            <div className="p-6 space-y-8 animate-in slide-in-from-top-2 duration-300">
              {/* Step 1: Niche Selection */}
              <div>
                 <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">1</div>
                   <h2 className="text-xl font-bold text-gray-900">Choose your niche</h2>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                   {niches.map(niche => (
                     <NicheCard 
                       key={niche.niche_id}
                       niche={niche}
                       selected={selectedNiche === niche.niche_id}
                       onClick={() => setSelectedNiche(niche.niche_id)}
                     />
                   ))}
                 </div>
              </div>

              {/* Step 2: Visual Style */}
              <div>
                 <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">2</div>
                   <h2 className="text-xl font-bold text-gray-900">Choose visual style</h2>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                   {VISUAL_STYLES.map(style => (
                     <StyleCard 
                       key={style.id}
                       styleDef={style}
                       selected={visualStyle === style.id}
                       onClick={() => setVisualStyle(style.id)}
                     />
                   ))}
                 </div>
              </div>

              {/* Step 3: Video Details */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">3</div>
                   <h2 className="text-xl font-bold text-gray-900">Video details</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Video Topic or Hook Idea</label>
                      <input 
                        type="text"
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        placeholder="e.g. 5 passive income ideas for beginners"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Target Audience</label>
                      <input 
                        type="text"
                        value={targetAudience}
                        onChange={e => setTargetAudience(e.target.value)}
                        placeholder="e.g. beginners aged 20-35"
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Video Length</label>
                      <div className="relative">
                        <select 
                          value={runtime}
                          onChange={(e) => setRuntime(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        >
                          <option value={0.5}>30 Seconds (Shorts)</option>
                          <option value={1}>1 min</option>
                          <option value={3}>3 min (Standard)</option>
                          <option value={5}>5 min</option>
                          <option value={8}>7-10 min</option>
                          <option value={15}>15 min</option>
                        </select>
                        <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Scene Length</label>
                      <div className="relative">
                        <select 
                          value={sceneLength}
                          onChange={(e) => setSceneLength(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        >
                          <option value={3}>3-5 sec (Fast)</option>
                          <option value={6}>6-8 sec (Balanced)</option>
                          <option value={10}>10-14 sec (Slow)</option>
                          <option value={15}>15 sec (TikTok/Reels format)</option>
                        </select>
                        <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Video Format</label>
                      <div className="relative">
                        <select 
                          value={aspectRatio}
                          onChange={e => setAspectRatio(e.target.value)}
                          className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        >
                          <option value="16:9">YouTube 16:9 Widescreen</option>
                          <option value="9:16">Shorts 9:16 Vertical</option>
                          <option value="1:1">Square 1:1</option>
                        </select>
                        <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: AI Model */}
              <div>
                 <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">4</div>
                   <h2 className="text-xl font-bold text-gray-900">Choose AI model</h2>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {AI_MODELS.map(model => (
                     <ModelCard 
                       key={model.id}
                       model={model}
                       selected={selectedModel === model.id}
                       onClick={() => setSelectedModel(model.id)}
                     />
                   ))}
                 </div>
              </div>
              
              <div className="pt-6">
                 <button
                   onClick={generateContent}
                   disabled={loading || !topic}
                   className="w-full flex items-center justify-center gap-2 px-8 py-5 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                 >
                   {loading ? (
                     <>
                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                       Generating Engine Output...
                     </>
                   ) : (
                     <>
                       <Sparkles className="w-5 h-5" />
                       Generate storyboard prompts
                     </>
                   )}
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Output Area */}
        {output && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[600px] mt-12 animate-in slide-in-from-bottom flex-shrink-0">
            <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-b border-gray-200 sticky top-0 z-10">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                Engine Output Generated Successfully
              </h3>
              <button
                onClick={handleCopyOutput}
                className="flex flex-shrink-0 items-center justify-center gap-2 text-sm font-semibold text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-200 shadow-sm hover:bg-indigo-100 transition-colors"
              >
                {copiedSection === 'all' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                Copy Full Output
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto space-y-6 bg-gray-50/50">
              
              {/* Fallback to raw markdown if no sections are matched properly */}
              {parsedSections.length === 0 && (
                <div className="prose prose-indigo max-w-none prose-headings:font-bold prose-h3:text-indigo-900 prose-pre:bg-gray-900 prose-pre:text-gray-100">
                  <Markdown>{output}</Markdown>
                </div>
              )}
              
              {parsedSections.map((section, idx) => {
                const isBlockOrThumbnail = section.title.toLowerCase().includes('block') || section.title.toLowerCase().includes('thumbnail');
                const prompts = extractPrompts(section.content);
                
                return (
                  <div key={idx} className="bg-white border text-sm border-gray-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow relative">
                     <div className="bg-[#f8f9fc] border-b border-gray-100 p-4 font-bold text-indigo-900 flex justify-between items-center">
                        {section.title}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(section.content);
                            setCopiedSection(`sec-${idx}`);
                            toast.success(`Copied ${section.title}`);
                            setTimeout(() => setCopiedSection(null), 2000);
                          }}
                          className="flex items-center gap-2 p-1.5 px-3 text-xs text-gray-600 hover:text-indigo-600 bg-white border border-gray-200 rounded-md shadow-sm transition-colors"
                        >
                          {copiedSection === `sec-${idx}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                          Copy Block
                        </button>
                     </div>
                     
                     <div className="p-5 flex flex-col md:flex-row gap-6">
                       {isBlockOrThumbnail && (prompts.imagePrompt || prompts.videoPrompt) && (
                         <div className="md:w-1/3 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 pr-0 md:pr-4">
                           {prompts.imagePrompt && (
                             <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100/50 relative group">
                               <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 block">
                                 <ImageIcon className="w-3 h-3" /> Image Prompt
                               </label>
                               <p className="text-xs text-gray-700 font-mono leading-relaxed pr-6">{prompts.imagePrompt}</p>
                               <button
                                 onClick={() => {
                                   navigator.clipboard.writeText(prompts.imagePrompt!);
                                   setCopiedSection(`img-${idx}`);
                                   toast.success('Image Prompt Copied');
                                   setTimeout(() => setCopiedSection(null), 2000);
                                 }}
                                 className="absolute top-2 right-2 p-1.5 bg-white border border-gray-200 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 focus:opacity-100"
                                 title="Copy Image Prompt"
                               >
                                 {copiedSection === `img-${idx}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-500" />}
                               </button>
                             </div>
                           )}
                           
                           {prompts.videoPrompt && (
                             <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100/50 relative group">
                               <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 block">
                                 <VideoIcon className="w-3 h-3" /> Video Prompt
                               </label>
                               <p className="text-xs text-gray-700 font-mono leading-relaxed pr-6">{prompts.videoPrompt}</p>
                               <button
                                 onClick={() => {
                                   navigator.clipboard.writeText(prompts.videoPrompt!);
                                   setCopiedSection(`vid-${idx}`);
                                   toast.success('Video Prompt Copied');
                                   setTimeout(() => setCopiedSection(null), 2000);
                                 }}
                                 className="absolute top-2 right-2 p-1.5 bg-white border border-gray-200 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 focus:opacity-100"
                                 title="Copy Video Prompt"
                               >
                                 {copiedSection === `vid-${idx}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-500" />}
                               </button>
                             </div>
                           )}
                         </div>
                       )}
                       
                       <div className={`prose prose-sm prose-indigo max-w-none prose-headings:font-bold prose-h3:text-indigo-900 prose-p:text-gray-600 prose-strong:text-gray-800 prose-li:text-gray-600 ${isBlockOrThumbnail && (prompts.imagePrompt || prompts.videoPrompt) ? 'md:w-2/3' : 'w-full'}`}>
                         <Markdown>{section.content}</Markdown>
                       </div>
                     </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
      </div>
    </div>
  );
}
