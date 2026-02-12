import { BadgeType, BADGE_CONFIG } from '@/lib/types';

interface BadgeProps {
  type: BadgeType;
  size?: 'sm' | 'md' | 'lg';
}

export default function Badge({ type, size = 'md' }: BadgeProps) {
  const config = BADGE_CONFIG[type];

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <div className={`inline-flex items-center gap-2 rounded-full font-bold ${config.bg} ${config.color} ${sizeClasses[size]}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
}

export function BadgeWithDescription({ type }: { type: BadgeType }) {
  const config = BADGE_CONFIG[type];

  return (
    <div className={`rounded-xl p-6 ${config.bg} border`} style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
      <div className={`text-2xl font-bold ${config.color} flex items-center gap-2 mb-2`}>
        <span className="text-3xl">{config.icon}</span>
        <span>{config.label}</span>
      </div>
      <p className="text-gray-600 text-sm">{config.description}</p>
    </div>
  );
}
