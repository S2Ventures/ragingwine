// ---------------------------------------------------------------------------
// Stage 4: Morning Report via Resend
// ---------------------------------------------------------------------------
// Sends a summary email of the overnight pipeline run.
// ---------------------------------------------------------------------------

import { config } from './config.js';
import { createLogger } from './logger.js';
import type { PipelineResult } from './types.js';

const log = createLogger('report');

// ---------------------------------------------------------------------------
// Build HTML email
// ---------------------------------------------------------------------------
function buildReportHtml(result: PipelineResult): string {
  const duration = (
    (new Date(result.completedAt).getTime() - new Date(result.startedAt).getTime()) / 1000 / 60
  ).toFixed(1);

  const badgeCounts = result.reviews.reduce(
    (acc, r) => {
      acc[r.badge] = (acc[r.badge] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const badgeEmoji: Record<string, string> = {
    rager: '🔥',
    wildcard: '🎲',
    reliable: '✔️',
    lazy: '❌',
  };

  const reviewRows = result.reviews
    .map(r => {
      const emoji = badgeEmoji[r.badge] || '';
      const status = r.published
        ? '<span style="color:#16a34a">✅ Published</span>'
        : `<span style="color:#dc2626">❌ ${r.error || 'Failed'}</span>`;
      const url = r.published
        ? `<a href="https://ragingwine.com/reviews/${r.slug}">${r.restaurant}</a>`
        : r.restaurant;
      return `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee">${url}</td><td style="padding:6px 12px;border-bottom:1px solid #eee">${emoji} ${r.badge}</td><td style="padding:6px 12px;border-bottom:1px solid #eee">${status}</td></tr>`;
    })
    .join('\n');

  const badgeSummary = Object.entries(badgeCounts)
    .map(([badge, count]) => `${badgeEmoji[badge] || ''} ${count} ${badge}`)
    .join(' &nbsp;|&nbsp; ');

  const errorSection =
    result.errors.length > 0
      ? `<h3 style="color:#dc2626">⚠️ Errors</h3><ul>${result.errors.map(e => `<li>${e}</li>`).join('')}</ul>`
      : '';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:700px;margin:0 auto;padding:20px;color:#1a1a1a">
  <div style="background:linear-gradient(135deg,#722F37,#A0455A);padding:24px;border-radius:12px;color:white;margin-bottom:24px">
    <h1 style="margin:0 0 8px 0;font-size:22px">🍷 Nightly Pipeline Report</h1>
    <p style="margin:0;opacity:0.9;font-size:14px">${result.city} — ${new Date(result.completedAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
  </div>

  <div style="display:flex;gap:16px;margin-bottom:24px;flex-wrap:wrap">
    <div style="flex:1;min-width:120px;background:#f8f8f8;padding:16px;border-radius:8px;text-align:center">
      <div style="font-size:28px;font-weight:bold;color:#722F37">${result.restaurantsResearched}</div>
      <div style="font-size:12px;color:#666;margin-top:4px">Researched</div>
    </div>
    <div style="flex:1;min-width:120px;background:#f8f8f8;padding:16px;border-radius:8px;text-align:center">
      <div style="font-size:28px;font-weight:bold;color:#722F37">${result.reviewsWritten}</div>
      <div style="font-size:12px;color:#666;margin-top:4px">Written</div>
    </div>
    <div style="flex:1;min-width:120px;background:#f8f8f8;padding:16px;border-radius:8px;text-align:center">
      <div style="font-size:28px;font-weight:bold;color:#722F37">${result.reviewsPublished}</div>
      <div style="font-size:12px;color:#666;margin-top:4px">Published</div>
    </div>
    <div style="flex:1;min-width:120px;background:${(result.skippedRestaurants?.length ?? 0) > 0 ? '#fef3c7' : '#f8f8f8'};padding:16px;border-radius:8px;text-align:center">
      <div style="font-size:28px;font-weight:bold;color:#b45309">${(result.restaurantsSkippedResearch ?? 0) + (result.restaurantsSkippedWriting ?? 0)}</div>
      <div style="font-size:12px;color:#666;margin-top:4px">Skipped</div>
    </div>
    <div style="flex:1;min-width:120px;background:#f8f8f8;padding:16px;border-radius:8px;text-align:center">
      <div style="font-size:28px;font-weight:bold;color:#722F37">${duration}m</div>
      <div style="font-size:12px;color:#666;margin-top:4px">Runtime</div>
    </div>
  </div>

  <p style="text-align:center;font-size:14px;color:#666;margin-bottom:20px">${badgeSummary}</p>

  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <thead>
      <tr style="background:#f0f0f0">
        <th style="padding:8px 12px;text-align:left">Restaurant</th>
        <th style="padding:8px 12px;text-align:left">Badge</th>
        <th style="padding:8px 12px;text-align:left">Status</th>
      </tr>
    </thead>
    <tbody>
      ${reviewRows}
    </tbody>
  </table>

  ${errorSection}

  ${(result.skippedRestaurants?.length ?? 0) > 0 ? `
  <h3 style="color:#b45309;margin-top:28px">⏭️ Skipped Restaurants (${result.skippedRestaurants!.length})</h3>
  <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px">
    <thead>
      <tr style="background:#fef3c7">
        <th style="padding:6px 10px;text-align:left">Restaurant</th>
        <th style="padding:6px 10px;text-align:left">Phase</th>
        <th style="padding:6px 10px;text-align:left">Reason</th>
        <th style="padding:6px 10px;text-align:left">Replaced By</th>
      </tr>
    </thead>
    <tbody>
      ${result.skippedRestaurants!.map(s => `<tr>
        <td style="padding:5px 10px;border-bottom:1px solid #f0e6c0">${s.name}</td>
        <td style="padding:5px 10px;border-bottom:1px solid #f0e6c0"><span style="background:${s.phase === 'research' ? '#dbeafe' : '#ede9fe'};color:${s.phase === 'research' ? '#1e40af' : '#5b21b6'};padding:2px 6px;border-radius:4px;font-size:11px">${s.phase}</span></td>
        <td style="padding:5px 10px;border-bottom:1px solid #f0e6c0;color:#92400e;font-size:12px">${s.reason}</td>
        <td style="padding:5px 10px;border-bottom:1px solid #f0e6c0">${s.replacedBy || '—'}</td>
      </tr>`).join('\n')}
    </tbody>
  </table>
  ` : ''}

  <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
  <p style="font-size:12px;color:#999;text-align:center">
    Raging Wine Nightly Pipeline v1.0 — ${config.dryRun ? '🧪 DRY RUN' : '🚀 LIVE'}
  </p>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Send the report
// ---------------------------------------------------------------------------
export async function sendReport(result: PipelineResult): Promise<void> {
  if (!config.resendApiKey) {
    log.warn('No RESEND_API_KEY configured — skipping email report');
    log.info('Report summary:', {
      city: result.city,
      researched: result.restaurantsResearched,
      written: result.reviewsWritten,
      published: result.reviewsPublished,
      skippedResearch: result.restaurantsSkippedResearch ?? 0,
      skippedWriting: result.restaurantsSkippedWriting ?? 0,
      errors: result.errors.length,
    });
    return;
  }

  const html = buildReportHtml(result);
  const skipCount = (result.restaurantsSkippedResearch ?? 0) + (result.restaurantsSkippedWriting ?? 0);
  const skipNote = skipCount > 0 ? `, ${skipCount} skipped` : '';
  const subject = `🍷 Pipeline Report: ${result.reviewsPublished} published${skipNote} — ${result.city}`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.resendApiKey}`,
      },
      body: JSON.stringify({
        from: config.reportFrom,
        to: config.reportTo,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Resend API ${res.status}: ${text}`);
    }

    log.info(`Morning report sent to ${config.reportTo}`);
  } catch (err) {
    log.error('Failed to send report email', String(err));
    // Non-blocking: don't throw
  }
}
