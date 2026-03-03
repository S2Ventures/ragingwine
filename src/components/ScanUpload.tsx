'use client';

import { useState, useRef, useCallback } from 'react';
import type { ScanResult, ScanError } from '@/lib/scan-types';

interface ScanUploadProps {
  onResult: (result: ScanResult) => void;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.split(',')[1]); // strip data:...;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ScanUpload({ onResult }: ScanUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    // Validate
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('Image too large. Max 10 MB.');
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    try {
      const base64 = await fileToBase64(file);
      const mimeType = file.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType }),
      });

      const data = await res.json();

      if (!res.ok) {
        const scanError = data as ScanError;
        if (scanError.code === 'rate_limited') {
          setError('You\'ve hit the scan limit. Try again in an hour.');
        } else if (scanError.code === 'no_wines_found') {
          setError('Couldn\'t identify wines in this image. Try a clearer photo of the wine list.');
        } else {
          setError(scanError.message || 'Scan failed. Please try again.');
        }
        return;
      }

      onResult(data as ScanResult);
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [onResult]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const reset = () => {
    setPreview(null);
    setError(null);
    setLoading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Drop zone */}
      {!preview && !loading && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
            ${dragOver
              ? 'border-wine-500 bg-wine-50'
              : 'border-gray-300 hover:border-wine-400 hover:bg-wine-50/50'
            }
          `}
          onClick={() => inputRef.current?.click()}
        >
          <div className="text-4xl mb-3">&#128247;</div>
          <p className="text-lg font-semibold text-brand-dark mb-1">
            Snap or upload a wine list
          </p>
          <p className="text-sm text-gray-500 mb-4">
            JPEG, PNG, or WebP up to 10 MB
          </p>

          {/* Mobile camera button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-wine-700 text-white rounded-lg font-medium text-sm hover:bg-wine-800 transition-colors cursor-pointer">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Take Photo
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <span className="text-xs text-gray-400">or</span>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Choose File
            </button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Loading state */}
      {loading && preview && (
        <div className="text-center">
          <div className="relative w-full max-w-sm mx-auto mb-6 rounded-xl overflow-hidden">
            <img src={preview} alt="Wine list being analyzed" className="w-full opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center bg-white/40">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-wine-700 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-semibold text-wine-800 bg-white/80 px-3 py-1 rounded-full">
                  Analyzing your wine list...
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500">This usually takes 5-10 seconds</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700 mb-3">{error}</p>
          <button
            onClick={reset}
            className="text-sm font-medium text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
