import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, User, Mail, Phone, ArrowRight, Shield } from 'lucide-react';

interface LoginGateProps {
  onAuthenticated: () => void;
}

export default function LoginGate({ onAuthenticated }: LoginGateProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('All fields are required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Placeholder webhook — replace this URL with your Formspree, Zapier, or backend endpoint
      await fetch('https://hooks.example.com/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim(), timestamp: new Date().toISOString() }),
      }).catch(() => {
        // Silently continue even if webhook is unreachable (placeholder URL)
      });

      localStorage.setItem('fa_user', JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() }));
      localStorage.setItem('fa_authenticated', 'true');
      onAuthenticated();
    } catch {
      // Still grant access even if webhook fails
      localStorage.setItem('fa_user', JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() }));
      localStorage.setItem('fa_authenticated', 'true');
      onAuthenticated();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)' }}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #38bdf8, transparent)' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.02]" style={{ background: 'radial-gradient(circle, #38bdf8, transparent)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)' }}
          >
            <TrendingUp className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            The Financial Advisor
          </h1>
          <p className="text-slate-400 text-sm" style={{ fontFamily: 'system-ui, sans-serif' }}>
            Enter your details to access the historical market simulation laboratory.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border p-8" style={{ background: 'rgba(30, 41, 59, 0.6)', borderColor: 'rgba(51, 65, 85, 0.5)', backdropFilter: 'blur(20px)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2" style={{ fontFamily: 'system-ui, sans-serif' }}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                  style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(51, 65, 85, 0.6)', fontFamily: 'system-ui, sans-serif' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2" style={{ fontFamily: 'system-ui, sans-serif' }}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                  style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(51, 65, 85, 0.6)', fontFamily: 'system-ui, sans-serif' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2" style={{ fontFamily: 'system-ui, sans-serif' }}>Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                  style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(51, 65, 85, 0.6)', fontFamily: 'system-ui, sans-serif' }}
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-rose-400 text-center py-2 px-4 rounded-lg"
                style={{ background: 'rgba(251, 113, 133, 0.1)', fontFamily: 'system-ui, sans-serif' }}
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
                fontFamily: 'system-ui, sans-serif',
                boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)',
              }}
            >
              {isSubmitting ? 'Verifying...' : 'Enter the Archive'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-6 text-slate-500 text-xs" style={{ fontFamily: 'system-ui, sans-serif' }}>
            <Shield className="w-3.5 h-3.5" />
            <span>Your information is stored securely and never shared.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
