'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Github, Mail } from 'lucide-react';
import { api } from '../services/api.ts'
import { useAuth } from '../context/AuthContext.tsx';
import { Button } from "../components/ui/Button.tsx";

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setIsLoading(true);
    try {
      const response = await api.signUp({ username: formData.name, email: formData.email, password: formData.password });
      login({
        id: response.id,
        username: response.username,
        email: response.email,
        setUpComplete: response.setUpComplete,
      });
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignUp = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth2/authorization/github`;
  };
  const handleGoogleSignUp = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/oauth2/authorization/google`;
  };

  const getStrength = (p: string) => {
    if (!p) return 0;
    let s = 0;
    if (p.length > 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = getStrength(formData.password);
  const strengthColor = ['#e2e4f0', '#f87171', '#fb923c', '#facc15', '#4ade80'][strength];
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];

  return (
      <div style={styles.page}>
        <div style={styles.bgOrb1} />
        <div style={styles.bgOrb2} />
        <div style={styles.bgOrb3} />

        <div style={styles.card}>
          {/* Logo */}
          <div style={styles.logoWrap}>
            <img src="/logo.png" alt="IVA" style={styles.logoImg} />
          </div>
          <h1 style={styles.appName}>IVA</h1>
          <h2 style={styles.heading}>Create your account</h2>
          <p style={styles.subheading}>Get started for free today</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                  type="text" name="name" placeholder="John Doe"
                  value={formData.name} onChange={handleChange}
                  required disabled={isLoading} style={styles.input}
                  onFocus={e => Object.assign(e.currentTarget.style, styles.inputFocus)}
                  onBlur={e => Object.assign(e.currentTarget.style, styles.input)}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email address</label>
              <input
                  type="email" name="email" placeholder="name@company.com"
                  value={formData.email} onChange={handleChange}
                  required disabled={isLoading} style={styles.input}
                  onFocus={e => Object.assign(e.currentTarget.style, styles.inputFocus)}
                  onBlur={e => Object.assign(e.currentTarget.style, styles.input)}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <input
                  type="password" name="password" placeholder="Create a password (min 8 chars)"
                  value={formData.password} onChange={handleChange}
                  required disabled={isLoading} style={styles.input}
                  onFocus={e => Object.assign(e.currentTarget.style, styles.inputFocus)}
                  onBlur={e => Object.assign(e.currentTarget.style, styles.input)}
              />
              {formData.password && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ display: 'flex', gap: 4, height: 3, marginBottom: 4 }}>
                      {[1,2,3,4].map(i => (
                          <div key={i} style={{
                            flex: 1, borderRadius: 99,
                            background: strength >= i ? strengthColor : 'rgba(180,185,220,0.3)',
                            transition: 'background 0.3s',
                          }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
                  </div>
              )}
            </div>

            <Button variant={"secondary"} size={"lg"} type="submit" disabled={isLoading}>
              {isLoading ? 'Creating account…' : 'Create Account'} <ArrowRight size={16}/>
            </Button>
          </form>

          <div style={styles.dividerRow}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or sign up with</span>
            <div style={styles.dividerLine} />
          </div>

          <div style={styles.oauthRow}>
            <button onClick={handleGitHubSignUp} disabled={isLoading} style={styles.oauthBtn}>
              <Github size={16} /><span>GitHub</span>
            </button>
            <button onClick={handleGoogleSignUp} disabled={isLoading} style={styles.oauthBtn}>
              <Mail size={16} /><span>Google</span>
            </button>
          </div>

          <p style={styles.switchText}>
            Already have an account?{' '}
            <Link href="/login" style={styles.switchLink}>Sign in</Link>
          </p>

          <p style={{ ...styles.switchText, fontSize: 11, marginTop: 10, color: 'rgba(123,130,168,0.7)' }}>
            By signing up you agree to our{' '}
            <a href="#" style={{ color: '#5c67d4', textDecoration: 'underline' }}>Terms</a>
            {' '}and{' '}
            <a href="#" style={{ color: '#5c67d4', textDecoration: 'underline' }}>Privacy Policy</a>
          </p>
        </div>

        <style>{`
        @keyframes iva-spin { to { transform: rotate(360deg); } }
        @keyframes iva-fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      </div>
  );
}

const c = {
  bg: '#e8eaf6',
  cardBg: 'rgba(255,255,255,0.55)',
  border: 'rgba(255,255,255,0.75)',
  text: '#2d3561',
  muted: '#7b82a8',
  inputBg: 'rgba(241,243,255,0.8)',
  inputBorder: 'rgba(180,185,220,0.5)',
  inputBorderFocus: '#6c75d4',
  accent: '#5c67d4',
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh', width: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(145deg, #dde1f5 0%, #e8eaf6 40%, #d8ddf0 100%)',
    fontFamily: "'DM Mono', 'Fira Code', monospace",
    position: 'relative', overflow: 'hidden', padding: '24px',
  },
  bgOrb1: {
    position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
    width: 420, height: 420, background: 'rgba(180,188,240,0.45)', top: '-60px', left: '-80px',
  },
  bgOrb2: {
    position: 'absolute', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none',
    width: 360, height: 360, background: 'rgba(160,170,235,0.3)', bottom: '-80px', right: '-60px',
  },
  bgOrb3: {
    position: 'absolute', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
    width: 200, height: 200, background: 'rgba(200,205,248,0.4)', top: '50%', left: '55%',
  },
  card: {
    position: 'relative', zIndex: 1,
    width: '100%', maxWidth: 440,
    background: c.cardBg,
    backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
    border: `1px solid ${c.border}`, borderRadius: 24,
    padding: '40px 40px 32px',
    boxShadow: '0 8px 48px rgba(80,90,180,0.10), 0 1px 0 rgba(255,255,255,0.8) inset',
    animation: 'iva-fade-up 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  logoWrap: { width: 52, height: 52, marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoImg: { width: 52, height: 52, objectFit: 'contain' },
  appName: { fontWeight: 700, fontSize: 26, color: c.text, margin: '0 0 16px', letterSpacing: '-0.5px' },
  heading: { fontWeight: 700, fontSize: 22, color: c.text, margin: '0 0 6px', letterSpacing: '-0.3px', textAlign: 'center' },
  subheading: { fontSize: 13, color: c.muted, margin: '0 0 24px', textAlign: 'center' },
  errorBox: {
    width: '100%', background: 'rgba(254,226,226,0.8)',
    border: '1px solid rgba(248,113,113,0.4)', color: '#b91c1c',
    borderRadius: 10, padding: '10px 14px', fontSize: 13,
    marginBottom: 16, textAlign: 'center', boxSizing: 'border-box',
  },
  form: { width: '100%', display: 'flex', flexDirection: 'column', gap: 14 },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  labelRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 13, fontWeight: 600, color: c.text },
  input: {
    width: '100%', height: 44, background: c.inputBg,
    border: `1px solid ${c.inputBorder}`, borderRadius: 10,
    padding: '0 14px', fontSize: 14, color: c.text,
    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
  },
  inputFocus: {
    width: '100%', height: 44, background: 'rgba(255,255,255,0.9)',
    border: `1.5px solid ${c.inputBorderFocus}`, borderRadius: 10,
    padding: '0 14px', fontSize: 14, color: c.text,
    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%', height: 46,
    background: 'linear-gradient(135deg, #5c67d4 0%, #7c85e8 100%)',
    color: '#fff', border: 'none', borderRadius: 10,
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
    transition: 'opacity 0.2s', boxShadow: '0 4px 18px rgba(92,103,212,0.35)',
    fontFamily: "'Manrope', sans-serif",
  },
  btnContent: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  spinnerWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  spinner: {
    display: 'inline-block', width: 15, height: 15,
    border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff',
    borderRadius: '50%', animation: 'iva-spin 0.7s linear infinite',
  },
  dividerRow: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', margin: '18px 0 0' },
  dividerLine: { flex: 1, height: 1, background: 'rgba(180,185,220,0.4)' },
  dividerText: { fontSize: 12, color: c.muted, whiteSpace: 'nowrap' },
  oauthRow: { display: 'flex', gap: 12, width: '100%', margin: '14px 0 0' },
  oauthBtn: {
    flex: 1, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    background: 'rgba(255,255,255,0.7)', border: `1px solid rgba(180,185,220,0.5)`,
    borderRadius: 10, fontSize: 13, fontWeight: 600, color: c.text,
    cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
  },
  switchText: { marginTop: 18, fontSize: 13, color: c.muted, textAlign: 'center' },
  switchLink: { color: c.accent, fontWeight: 600, textDecoration: 'none' },
};