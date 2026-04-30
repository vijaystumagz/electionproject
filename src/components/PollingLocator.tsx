import React, { useState, FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Search, Navigation, MapPin, ExternalLink } from 'lucide-react';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const PollingLocator: React.FC = () => {
  const [zipcode, setZipcode] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [mapQuery, setMapQuery] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');

  const validateZip = (zip: string): boolean => /^\d{5}(-\d{4})?$/.test(zip.trim());

  const handleSearch = (e: FormEvent): void => {
    e.preventDefault();
    const trimmed = zipcode.trim();

    if (!trimmed) {
      setInputError('Please enter a ZIP code.');
      return;
    }
    if (!validateZip(trimmed)) {
      setInputError('Please enter a valid 5-digit ZIP code.');
      return;
    }

    setInputError('');
    setMapQuery(`polling+place+near+${encodeURIComponent(trimmed)}`);
    setSubmitted(true);
  };

  const handleZipChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setZipcode(e.target.value);
    setInputError('');
  };

  const hasApiKey = MAPS_API_KEY && !MAPS_API_KEY.includes('PLACEHOLDER');

  return (
    <div
      className="glass-card"
      style={{ padding: '24px', width: '100%', maxWidth: '480px' }}
      aria-label="Polling location finder"
    >
      <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MapPin size={20} className="text-gradient" aria-hidden="true" />
        Find Your Polling Place
      </h3>

      {!submitted ? (
        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} noValidate>
          <div style={{ position: 'relative' }}>
            <label htmlFor="zip-input" className="sr-only">ZIP Code</label>
            <Search
              size={18}
              aria-hidden="true"
              style={{
                position: 'absolute', left: '12px', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)',
              }}
            />
            <input
              id="zip-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter your ZIP Code (e.g. 90210)"
              value={zipcode}
              onChange={handleZipChange}
              maxLength={10}
              aria-describedby={inputError ? 'zip-error' : undefined}
              aria-invalid={!!inputError}
              style={{
                width: '100%', padding: '12px 12px 12px 40px',
                background: 'var(--bg-surface)', border: `1px solid ${inputError ? '#ef4444' : 'var(--border-light)'}`,
                borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                fontFamily: 'inherit', fontSize: '0.95rem', outline: 'none',
              }}
            />
          </div>
          {inputError && (
            <p id="zip-error" role="alert" style={{ color: '#ef4444', fontSize: '0.8rem', margin: 0 }}>
              {inputError}
            </p>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <Search size={16} aria-hidden="true" /> Find Polling Place
          </button>
        </form>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {hasApiKey ? (
            <iframe
              title={`Map of polling places near ${zipcode}`}
              width="100%"
              height="250"
              style={{ border: 0, borderRadius: 'var(--radius-md)' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/search?key=${MAPS_API_KEY}&q=${mapQuery}`}
            />
          ) : (
            <div
              style={{
                height: '200px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '8px', border: '1px dashed var(--border-light)',
              }}
            >
              <Navigation size={32} color="var(--text-muted)" aria-hidden="true" />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '0 20px' }}>
                Map preview requires a Google Maps API key.
              </p>
            </div>
          )}

          <a
            href={`https://www.google.com/maps/search/${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ width: '100%', textDecoration: 'none' }}
            aria-label={`Open Google Maps search for polling places near ${zipcode} in a new tab`}
          >
            <ExternalLink size={16} aria-hidden="true" />
            Open in Google Maps
          </a>

          <button
            className="btn btn-outline"
            style={{ width: '100%' }}
            onClick={() => { setSubmitted(false); setZipcode(''); }}
          >
            Search Another ZIP Code
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default React.memo(PollingLocator);
