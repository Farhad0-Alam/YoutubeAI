import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { payload, key } = body;

    const apiKey = key || process.env.ELEVENLABS_API_KEY || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing ElevenLabs API Key" }, { status: 401 });
    }

    const voiceId = payload.voice || "21m00Tcm4TlvDq8ikWAM"; // Default Rachel

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "xi-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: payload.input,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `ElevenLabs TTS API error: ${response.status} - ${err}` }, { status: response.status });
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');
    return NextResponse.json({ audioBase64: base64Audio });

  } catch (error: any) {
    console.error("ElevenLabs Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
