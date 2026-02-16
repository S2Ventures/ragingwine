import { WingmanMetrics as WingmanMetricsType } from '@/lib/types';

function MetricPill({ label, value, variant }: { label: string; value: string; variant: 'good' | 'ok' | 'bad' }) {
  const colors = {
    good: 'bg-green-50 text-green-800 border-green-200',
    ok: 'bg-amber-50 text-amber-800 border-amber-200',
    bad: 'bg-red-50 text-red-800 border-red-200',
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${colors[variant]}`}>
        {value}
      </span>
    </div>
  );
}

function getGlasswareVariant(value: string): 'good' | 'ok' | 'bad' {
  if (value === 'Varietal Specific') return 'good';
  if (value === 'Stemless Casual') return 'ok';
  return 'bad';
}

function getStaffVariant(value: string): 'good' | 'ok' | 'bad' {
  if (value === 'Knowledgeable & Friendly') return 'good';
  if (value === 'Willing but Green' || value === 'Rotating Cast') return 'ok';
  return 'bad';
}

function getMarkupVariant(value: string): 'good' | 'ok' | 'bad' {
  if (value === 'Fair' || value === 'Steal') return 'good';
  if (value === 'Steep') return 'ok';
  return 'bad';
}

function getVarietyVariant(value: string): 'good' | 'ok' | 'bad' {
  if (value === 'Deep & Eclectic' || value === 'Solid Range' || value === 'Surprising Depth') return 'good';
  if (value === 'Plays It Safe' || value === 'Small but Thoughtful' || value === 'Crowd Pleasers') return 'ok';
  return 'bad';
}

function getSpecialsVariant(value: string): 'good' | 'ok' | 'bad' {
  if (value === 'Active Program' || value === 'Seasonal Rotation') return 'good';
  if (value === 'Occasional') return 'ok';
  return 'bad';
}

function getStorageVariant(value: string): 'good' | 'ok' | 'bad' {
  if (value === 'Proper') return 'good';
  if (value === 'Acceptable') return 'ok';
  return 'bad';
}

export default function WingmanMetrics({ metrics }: { metrics: WingmanMetricsType }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <MetricPill label="List Variety" value={metrics.variety} variant={getVarietyVariant(metrics.variety)} />
      <MetricPill label="Markup" value={metrics.markup} variant={getMarkupVariant(metrics.markup)} />
      <MetricPill label="Glassware" value={metrics.glassware} variant={getGlasswareVariant(metrics.glassware)} />
      <MetricPill label="Staff" value={metrics.staff} variant={getStaffVariant(metrics.staff)} />
      <MetricPill label="Specials & Deals" value={metrics.specials} variant={getSpecialsVariant(metrics.specials)} />
      <MetricPill label="Storage & Temp" value={metrics.storage} variant={getStorageVariant(metrics.storage)} />
    </div>
  );
}
