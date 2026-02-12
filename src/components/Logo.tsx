export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 60 C25 40, 20 25, 15 10 L35 10 C30 25, 28 40, 35 55 C38 60, 35 65, 30 68 L25 70 L20 75 L35 75" stroke="#1a1a1a" strokeWidth="2.5" fill="none"/>
        <path d="M15 10 C20 20, 25 35, 25 45 C25 50, 22 55, 18 55 C14 55, 12 50, 15 40 Z" fill="#8B1A1A" opacity="0.9"/>
        <path d="M75 60 C75 40, 80 25, 85 10 L65 10 C70 25, 72 40, 65 55 C62 60, 65 65, 70 68 L75 70 L80 75 L65 75" stroke="#1a1a1a" strokeWidth="2.5" fill="none"/>
        <path d="M85 10 C80 20, 75 35, 75 45 C75 50, 78 55, 82 55 C86 55, 88 50, 85 40 Z" fill="#C0392B" opacity="0.9"/>
        <ellipse cx="28" cy="75" rx="12" ry="3" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
        <ellipse cx="72" cy="75" rx="12" ry="3" stroke="#1a1a1a" strokeWidth="1.5" fill="none"/>
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-tight">
          <span className="text-brand-dark">RAGING</span>
          <span className="text-wine-500">WINE</span>
        </span>
      </div>
    </div>
  );
}
