import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-gray-400 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-white font-bold text-lg mb-2">
              <span>RAGING</span><span className="text-wine-500">WINE</span>
            </div>
            <p className="text-sm">Your Wine Adventure Wingman</p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Explore</h4>
            <div className="space-y-2 text-sm">
              <Link href="/reviews" className="block hover:text-white transition-colors">Wine List Reviews</Link>
              <Link href="/adventures" className="block hover:text-white transition-colors">Wine Adventures</Link>
              <Link href="/wine-101" className="block hover:text-white transition-colors">Wine 101</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Cities</h4>
            <div className="space-y-2 text-sm">
              <Link href="/cities/atlanta" className="block hover:text-white transition-colors">Atlanta</Link>
              <Link href="/cities/greenville" className="block hover:text-white transition-colors">Greenville</Link>
              <Link href="/cities/key-west" className="block hover:text-white transition-colors">Key West</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Connect</h4>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block hover:text-white transition-colors">About Us</Link>
              <a href="https://instagram.com/ragingwine" className="block hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://tiktok.com/@ragingwine" className="block hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">TikTok</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Raging Wine. Drink Boldly.</p>
        </div>
      </div>
    </footer>
  );
}
