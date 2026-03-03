'use client';

import { useState } from 'react';
import ScanUpload from '@/components/ScanUpload';
import ScanResults from '@/components/ScanResults';
import type { ScanResult } from '@/lib/scan-types';

export default function ScanPageClient() {
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleReset = () => setResult(null);

  if (result) {
    return <ScanResults result={result} onScanAnother={handleReset} />;
  }

  return <ScanUpload onResult={setResult} />;
}
