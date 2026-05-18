import type { DispatchRequest } from './types';

const PRIORITY_EMOJI: Record<string, string> = {
  urgent: '🔴',
  normal: '🟡',
  low: '🟢',
};

export async function postToTeams(request: DispatchRequest): Promise<void> {
  const url = process.env.TEAMS_WEBHOOK_URL;
  if (!url) return;

  const dept = request.department.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const body = {
    '@type': 'MessageCard',
    '@context': 'http://schema.org/extensions',
    themeColor: request.priority === 'urgent' ? 'C0392B' : '2E7D52',
    summary: request.summary,
    sections: [
      {
        activityTitle: `${PRIORITY_EMOJI[request.priority] ?? '⚪'} **${dept}** — Room ${request.room}`,
        activitySubtitle: request.summary,
        facts: [
          { name: 'Priority', value: request.priority },
          { name: 'ETA', value: request.eta ?? '—' },
          ...(request.guestName
            ? [{ name: 'Guest', value: `${request.guestName} (${request.guestTier})` }]
            : []),
        ],
      },
    ],
  };

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => {}); // non-critical — never block the response
}
