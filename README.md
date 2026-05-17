<p align="center">
  <strong>Üchá</strong><br/>
  <em>Voice-First Hotel Dispatch</em>
</p>

<p align="center">
  <a href="https://ucha.vercel.app">Live Demo</a> ·
  <a href="#how-it-works">How It Works</a> ·
  <a href="#voice-modes">Voice Modes</a> ·
  <a href="#demo">Demo</a> ·
  <a href="#development">Development</a>
</p>

---

Üchá is a voice-driven dispatch board for hotel staff. Speak a request and it is
transcribed, routed to the correct department with a priority and ETA, enriched
with guest CRM context, and posted to the live dispatch board.

**One button. One voice. Zero dropped requests.**

## How It Works

1. **Capture** — staff hold the voice button and speak a request.
2. **Transcribe** — `POST /api/voice` sends the audio to ElevenLabs Scribe
   speech-to-text (`scribe_v1`).
3. **Route** — the transcript is passed to Claude which uses
   tool-calling to return a structured dispatch (department, priority, summary,
   room, ETA). Guest tier is resolved from the CRM lookup and VIP requests are
   escalated.
4. **Acknowledge** — `POST /api/speak` synthesizes Üchá's spoken confirmation
   with ElevenLabs text-to-speech (`eleven_flash_v2_5`) and plays it back.
5. **Dispatch** — the request is stored and appears on `/dispatch`, which polls
   `/api/requests` every few seconds.

## Voice Modes

The top bar offers two ways to talk to Üchá, switchable with the toggle:

- **Hold to speak** (default) — one-shot push-to-talk `VoiceButton`. Hold,
  speak, release; the pipeline above runs once.
- **Live agent** — `ConversationButton`, a continuous ElevenLabs Conversational
  AI session. Requires a pre-created agent (`ELEVENLABS_AGENT_ID`); this app
  never creates agents.

## Stack

| Layer      | Technology                               |
| ---------- | ---------------------------------------- |
| Framework  | Next.js 16 (App Router) · React 19       |
| Language   | TypeScript                               |
| Styling    | Tailwind CSS v4                          |
| Voice      | ElevenLabs (STT + TTS)                   |
| AI         | Anthropic Claude                         |
| State      | Upstash Redis (optional)                 |
| Deploy     | Vercel                                   |

## Demo

Visit `/demo` (or "Demo Mode" in the top bar) to run scripted scenarios through
the real pipeline — each one shows the transcribe → route → acknowledge steps
and speaks the acknowledgment aloud.

Try _"Room 412 needs extra towels"_ — guest Eleanor Whitfield (Pinnacle VIP) is
resolved from the CRM and the request is auto-escalated.

## Environment

Create `.env.local` with:

```bash
ANTHROPIC_API_KEY=...     # Claude routing
ELEVENLABS_API_KEY=...    # speech-to-text + text-to-speech
ELEVENLABS_AGENT_ID=...   # required only for the live agent mode
```

## Development

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm lint
pnpm test
pnpm build
```

## License

MIT
