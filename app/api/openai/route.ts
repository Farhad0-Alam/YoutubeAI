import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload, key } = body;

    const apiKey = key || process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing OpenAI API Key" }, { status: 401 });
    }

    if (action === 'chat') {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: payload.messages,
          temperature: 0.7,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const err = await response.text();
        return NextResponse.json({ error: `OpenAI Chat API error: ${response.status} - ${err}` }, { status: response.status });
      }
      return NextResponse.json(await response.json());
    }

    if (action === 'image') {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: payload.prompt,
          n: 1,
          size: payload.size || "1792x1024" // Best for video/widescreen by default
        })
      });

      if (!response.ok) {
        const err = await response.text();
        return NextResponse.json({ error: `OpenAI Image API error: ${response.status} - ${err}` }, { status: response.status });
      }
      return NextResponse.json(await response.json());
    }

    if (action === 'tts') {
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "tts-1",
          input: payload.input,
          voice: payload.voice || "alloy"
        })
      });

      if (!response.ok) {
        const err = await response.text();
        return NextResponse.json({ error: `OpenAI TTS API error: ${response.status} - ${err}` }, { status: response.status });
      }
      
      // We need to return an audio buffer somehow. Best way for a Next.js API route is to return the raw stream or arraybuffer.
      // But we are using NextResponse.json usually. Let's return as base64 string because it's easier to handle via JSON.
      const arrayBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(arrayBuffer).toString('base64');
      return NextResponse.json({ audioBase64: base64Audio });
    }

    return NextResponse.json({ error: "Invalid action type specified" }, { status: 400 });
  } catch (error: any) {
    console.error("OpenAI Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
