import Image from 'next/image';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo.png"
        alt="Raging Wine - Your Wine Adventure Wingman"
        width={180}
        height={48}
        priority
        style={{ height: 'auto', width: 'auto', maxHeight: '48px' }}
      />
    </div>
  );
}
