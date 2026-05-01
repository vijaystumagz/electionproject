import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Download } from 'lucide-react';

/**
 * Interface for timeline event data.
 */
interface TimelineEvent {
  date: string;
  title: string;
  status: 'past' | 'current' | 'upcoming';
  actualDate?: Date;
}

const ELECTION_DAY = new Date('2026-11-05');

const events: TimelineEvent[] = [
  { date: 'Oct 7', title: 'Voter Registration Deadline', status: 'past' },
  { date: 'Oct 20', title: 'Early Voting Begins', status: 'current' },
  { date: 'Nov 1', title: 'Mail-in Ballot Request Deadline', status: 'upcoming' },
  { date: 'Nov 5', title: 'Election Day', status: 'upcoming', actualDate: ELECTION_DAY }
];

/**
 * A visual timeline component showing key election dates.
 * Dynamically calculates the countdown to Election Day.
 */
const Timeline: React.FC = () => {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date();
    const diff = ELECTION_DAY.getTime() - today.getTime();
    setDaysLeft(Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

  return (
    <div className="glass-card" style={{ padding: '24px', width: '100%', maxWidth: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} className="text-gradient" aria-hidden="true" /> Key Dates
        </h3>
        {daysLeft !== null && daysLeft > 0 && (
          <div style={{ fontSize: '0.8rem', background: 'var(--primary-glow)', padding: '4px 10px', borderRadius: 'var(--radius-full)', color: 'var(--primary)', fontWeight: 600 }}>
            {daysLeft} days to go
          </div>
        )}
      </div>
      
      <div style={{ position: 'relative', paddingLeft: '20px' }}>
        {/* Vertical Line */}
        <div style={{
          position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px',
          background: 'var(--border-light)'
        }} aria-hidden="true"></div>

        {events.map((evt, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            style={{ position: 'relative', marginBottom: idx === events.length - 1 ? '0' : '20px' }}
          >
            {/* Timeline Dot */}
            <div style={{
              position: 'absolute', left: '-20px', top: '4px', width: '16px', height: '16px',
              borderRadius: '50%', background: 'var(--bg-surface)', border: '2px solid',
              borderColor: evt.status === 'past' ? 'var(--text-muted)' : 
                          evt.status === 'current' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: evt.status === 'current' ? '0 0 10px var(--primary-glow)' : 'none',
              zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }} aria-hidden="true">
              {evt.status === 'past' && <CheckCircle2 size={12} color="var(--text-muted)" />}
            </div>

            <div style={{
              color: evt.status === 'past' ? 'var(--text-muted)' : 'var(--text-primary)',
              opacity: evt.status === 'upcoming' ? 0.8 : 1
            }}>
              <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{evt.date}</div>
              <div style={{ fontSize: '0.95rem' }}>{evt.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn btn-outline" 
        style={{ width: '100%', marginTop: '20px', padding: '10px' }}
        onClick={() => alert("Mock: Event added to your calendar!")}
        aria-label="Add key election dates to your calendar"
      >
        <Download size={16} aria-hidden="true" /> Add to Calendar
      </motion.button>
    </div>
  );
};

export default React.memo(Timeline);
