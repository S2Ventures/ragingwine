'use client';

import { useState, useRef, useCallback } from 'react';
import type { ScanResult, ScanError } from '@/lib/scan-types';

interface ScanUploadProps {
  onResult: (result: ScanResult) => void;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function isImageFile(file: File): boolean {
  // Check MIME type first
  if (file.type.startsWith('image/')) return true;
  // Fallback: check extension for HEIC/HEIF (iOS sometimes reports empty type)
  const ext = file.name.split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif'].includes(ext || '');
}

function getMimeType(file: File): string {
  if (file.type && file.type.startsWith('image/')) {
    // Normalize HEIC/HEIF to jpeg since we'll convert via canvas
    if (file.type === 'image/heic' || file.type === 'image/heif') {
      return 'image/jpeg';
    }
    return file.type;
  }
  // Fallback for missing MIME
  const ext = file.name.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    webp: 'image/webp', gif: 'image/gif', heic: 'image/jpeg', heif: 'image/jpeg',
  };
  return map[ext || ''] || 'image/jpeg';
}

function convertToJpegBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // For HEIC or any type: load into an Image via object URL, draw to canvas, export as JPEG
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      // Cap dimensions to reduce payload (max 2048px on longest side)
      const MAX_DIM = 2048;
      let { width, height } = img;
      if (width > MAX_DIM || height > MAX_DIM) {
        const scale = MAX_DIM / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      URL.revokeObjectURL(url);
      resolve(dataUrl.split(',')[1]);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.split(',')[1]);
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!isImageFile(file)) {
      setError('Please upload an image file (JPEG, PNG, WebP, or HEIC).');
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
      const isHeic = file.type === 'image/heic' || file.type === 'image/heif'
        || file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif');

      let base64: string;
      let mimeType: string;

      if (isHeic) {
        // Convert HEIC to JPEG via canvas
        base64 = await convertToJpegBase64(file);
        mimeType = 'image/jpeg';
      } else {
        // Resize large images to reduce payload
        const needsResize = file.size > 4 * 1024 * 1024; // > 4MB
        if (needsResize) {
          base64 = await convertToJpegBase64(file);
          mimeType = 'image/jpeg';
        } else {
          base64 = await fileToBase64(file);
          mimeType = getMimeType(file);
        }
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 55000);

      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      // Handle non-JSON responses (e.g. Vercel HTML error pages)
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', res.status, text.slice(0, 200));
        setError(`Server error (${res.status}). Try again in a moment.`);
        return;
      }

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
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Scan timed out after 55 seconds. Try a smaller or clearer image.');
      } else {
        console.error('Scan error:', err);
        setError('Scan failed. Check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [onResult]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so same file can be re-selected
    if (e.target) e.target.value = '';
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Hidden file input — single source of truth */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload zone */}
      {!preview && !loading && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-2xl p-10 text-center transition-all
            ${dragOver
              ? 'border-wine-500 bg-wine-50'
              : 'border-gray-300 hover:border-wine-400 hover:bg-wine-50/50'
            }
          `}
        >
          <div className="text-4xl mb-3">&#128247;</div>
          <p className="text-lg font-semibold text-brand-dark mb-1">
            Snap or upload a wine list
          </p>
          <p className="text-sm text-gray-500 mb-4">
            JPEG, PNG, WebP, or HEIC up to 10 MB
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={openFilePicker}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-wine-700 text-white rounded-lg font-medium text-sm hover:bg-wine-800 transition-colors cursor-pointer"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Upload Photo
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && preview && (
        <div className="text-center">
          <div className="relative w-full max-w-sm mx-auto mb-6 rounded-xl overflow-hidden">
            <img src={preview} alt="Wine list being analyzed" className="w-full opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center bg-white/40">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-[3px] border-wine-700 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-semibold text-wine-800 bg-white/80 px-3 py-1 rounded-full">
                  Analyzing your wine list...
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500">This usually takes 10-20 seconds</p>
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
