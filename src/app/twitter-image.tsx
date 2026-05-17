import { ImageResponse } from 'next/og';

export const alt = 'Ucha — Voice-First Hotel Dispatch';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          background: '#F4EFE4',
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            width: 360,
            height: '100%',
            background: '#1C3A2D',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 48px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: 13,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#C9A84C',
                marginBottom: 32,
              }}
            >
              HOSPITALITY AI
            </span>
            <span
              style={{
                fontSize: 72,
                fontWeight: 300,
                lineHeight: 1.05,
                color: '#F4EFE4',
                fontStyle: 'italic',
              }}
            >
              Ucha
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                width: 40,
                height: 1,
                background: '#F4EFE4',
                opacity: 0.25,
                marginBottom: 16,
              }}
            />
            <span
              style={{
                fontSize: 11,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#F4EFE4',
                opacity: 0.5,
              }}
            >
              Voice-First Dispatch
            </span>
          </div>
        </div>

        {/* Right content area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 64px',
          }}
        >
          <span
            style={{
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#6B6560',
              marginBottom: 20,
            }}
          >
            ONE BUTTON. ONE VOICE. ZERO DROPPED REQUESTS.
          </span>

          <span
            style={{
              fontSize: 44,
              fontWeight: 300,
              lineHeight: 1.25,
              color: '#1A1714',
              marginBottom: 32,
            }}
          >
            Speak a request. AI routes, enriches & confirms in seconds.
          </span>

          {/* Department pills */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Housekeeping', color: '#0F7A68' },
              { label: 'Maintenance', color: '#B5621A' },
              { label: 'Front Desk', color: '#1A5FA8' },
              { label: 'Concierge', color: '#6B3FA8' },
            ].map((dept) => (
              <div
                key={dept.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  border: `1px solid ${dept.color}33`,
                  borderRadius: 4,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: dept.color,
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    letterSpacing: '0.08em',
                    color: dept.color,
                    textTransform: 'uppercase',
                  }}
                >
                  {dept.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tech stack */}
          <div
            style={{
              display: 'flex',
              gap: 6,
              marginTop: 36,
            }}
          >
            {['Next.js', 'Claude AI', 'ElevenLabs', 'Vercel'].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 11,
                  color: '#9E9890',
                  letterSpacing: '0.06em',
                }}
              >
                {t}
                {t !== 'Vercel' ? ' · ' : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
