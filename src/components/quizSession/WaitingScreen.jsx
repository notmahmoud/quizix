import { Clock } from 'lucide-react';

export default function WaitingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: '#FAF9F7' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E6FAF8', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <Clock style={{ width: 36, height: 36, color: '#0D9488' }} className="animate-pulse" />
      </div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 500, color: '#111827', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Waiting for Host</h1>
      <p style={{ color: '#4B5563', fontSize: '1rem', lineHeight: 1.6, maxWidth: 340 }}>
        The quiz will begin shortly when the host starts the session.
      </p>
    </div>
  );
}
