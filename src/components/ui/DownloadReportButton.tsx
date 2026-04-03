import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, Loader2 } from 'lucide-react';

export const DownloadReportButton: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'generating' | 'success'>('idle');

  const handleDownload = () => {
    setStatus('generating');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }, 2000);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={status !== 'idle'}
      className={`flex items-center justify-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-sm transition-all border-2 ${
        status === 'idle' 
          ? 'border-ink text-ink hover:bg-ink hover:text-parchment' 
          : status === 'generating'
            ? 'border-sepia text-sepia bg-sepia/10 cursor-wait'
            : 'border-green-600 text-green-600 bg-green-600/10'
      }`}
    >
      {status === 'idle' && (
        <>
          <Download className="w-5 h-5" /> Download Report (PDF)
        </>
      )}
      {status === 'generating' && (
        <>
          <Loader2 className="w-5 h-5 animate-spin" /> Generating Report...
        </>
      )}
      {status === 'success' && (
        <>
          <CheckCircle2 className="w-5 h-5" /> Report Saved to Device
        </>
      )}
    </button>
  );
};
