<p align="center">
  <strong>Üchá</strong><br/>
  <em>Voice-First Hotel Dispatch</em>
</p>

<p align="center">
  <a href="https://ucha.vercel.app">Live Demo</a> ·
  <a href="#how-it-works">How It Works</a> ·
  <a href="#setup">Setup</a> ·
  <a href="#deploy-to-vercel">Deploy</a>
</p>

---

Staff press **one button**, speak a request (_"Room 412 needs extra towels"_), and
Üchá transcribes it, routes it to the right department, enriches it with guest-360
context, and reads back a confirmation.

**One button. One voice. Zero dropped requests.**

Built for the **Hospitality 2030** hackathon @ Rosewood Sand Hill.

## How It Works

```
  MediaRecorder  ->  /api/transcribe  (ElevenLabs STT)
                 ->  /api/dispatch    (Claude routes + CRM enrichment)
                 ->  /api/speak       (ElevenLabs TTS acknowledgment)
                 ->  Dispatch board   (4 departments, live)
```

| Component           | Detail                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------- |
| **Routing brain**   | `claude-sonnet-4-6` classifies each request into housekeeping / maintenance / front desk / concierge with a priority and ETA |
| **CRM enrichment**  | Room number resolved against a CRM modeled on Rosewood's real stack (Oracle OPERA + Hapi -> Salesforce guest-360). VIP / Pinnacle guests get priority auto-escalated |
| **Live state**      | Upstash Redis when configured; falls back to in-memory state so it runs with zero setup     |

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

## Setup

```bash
cp .env.local.example .env.local   # add your keys
pnpm install
pnpm dev                           # http://localhost:3000
```

### Environment Variables

| Variable                   | Required | Purpose                          |
| -------------------------- | -------- | -------------------------------- |
| `ANTHROPIC_API_KEY`        | yes      | Claude dispatch routing          |
| `ELEVENLABS_API_KEY`       | yes      | Speech-to-text + text-to-speech  |
| `UPSTASH_REDIS_REST_URL`   | optional | Persist the board across refresh |
| `UPSTASH_REDIS_REST_TOKEN` | optional | Upstash REST token               |

Without the Upstash vars, Üchá uses in-memory state — fine for a single-process
demo. Add them to persist the board across refreshes and devices. Provision
Upstash Redis from the [Vercel Marketplace](https://vercel.com/marketplace) (auto-injects both vars) or at
[upstash.com](https://upstash.com).

## Demo

- **`/`** — live console: hold the mic button (or hold **Space**) and speak.
- **`/demo`** — judge cheat mode: fires 3 scripted requests end-to-end on 3 s intervals.

Try _"Room 412 needs extra towels"_ — guest Eleanor Whitfield (Pinnacle VIP) is
resolved from the CRM and the request is auto-escalated.

## Deploy to Vercel

```bash
vercel link
vercel env add ANTHROPIC_API_KEY
vercel env add ELEVENLABS_API_KEY
# add UPSTASH_* vars (or install Upstash Redis from the Vercel Marketplace)
vercel deploy --prod
```

## License

MIT
