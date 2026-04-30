import React from 'react';
import Assistant from './components/Assistant';
import { Vote } from 'lucide-react';

function App() {
  return (
    <>
      {/* Accessible Skip Navigation Link */}
      <a
        href="#main-content"
        style={{
          position: 'absolute', top: '-999px', left: '-999px',
          background: 'var(--primary)', color: 'white', padding: '10px 20px',
          borderRadius: '4px', zIndex: 9999, fontWeight: 600,
        }}
        onFocus={(e) => { e.target.style.top = '10px'; e.target.style.left = '10px'; }}
        onBlur={(e) => { e.target.style.top = '-999px'; e.target.style.left = '-999px'; }}
      >
        Skip to main content
      </a>

      <div className="app-container">
        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          style={{
            padding: '20px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface-glass)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border-light)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              padding: '8px', borderRadius: '12px', display: 'flex',
            }} aria-hidden="true">
              <Vote color="white" size={24} />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Elexia</span>
          </div>

          <ul role="list" style={{ display: 'flex', gap: '24px', fontSize: '0.95rem', fontWeight: 500, listStyle: 'none', margin: 0, padding: 0 }}>
            <li><a href="#main-content" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Home</a></li>
            <li><a href="https://github.com/vijayabhaskar00/electionprocess" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>GitHub</a></li>
          </ul>
        </nav>

        {/* Main Content */}
        <main id="main-content">
          {/* Hero Section */}
          <section
            aria-labelledby="hero-title"
            className="flex-center"
            style={{ flexDirection: 'column', textAlign: 'center', padding: '60px 24px 20px', gap: '16px' }}
          >
            <div style={{
              display: 'inline-block', padding: '6px 16px',
              background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)',
              borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px',
            }}>
              Election 2026 Ready
            </div>
            <h1 id="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', maxWidth: '800px', lineHeight: 1.1 }}>
              Navigate the election process with{' '}
              <span className="text-gradient">confidence.</span>
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', marginTop: '8px' }}>
              Your personal, smart assistant for voter registration, key deadlines, and finding your polling location.
            </p>
          </section>

          {/* Assistant Interface */}
          <Assistant />
        </main>

        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', marginTop: '40px' }}>
          <p>© 2026 Elexia Assistant · Built with React & Firebase · <a href="https://electionprocess-1b37d.web.app" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Live on Google Cloud</a></p>
        </footer>
      </div>
    </>
  );
}

export default App;
