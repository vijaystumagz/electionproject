import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Mail, Users, Building } from 'lucide-react';

interface VotingMethod {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
  border: string;
}

const methods: VotingMethod[] = [
  {
    icon: <Mail size={24} className="text-gradient" aria-hidden="true" />,
    title: "Mail-in / Absentee",
    description: "Vote from home. Requires requesting a ballot in advance.",
    color: "rgba(99, 102, 241, 0.1)",
    border: "rgba(99, 102, 241, 0.3)"
  },
  {
    icon: <Users size={24} className="text-gradient" aria-hidden="true" />,
    title: "Early In-Person",
    description: "Beat the crowds. Available in most states days before the election.",
    color: "rgba(139, 92, 246, 0.1)",
    border: "rgba(139, 92, 246, 0.3)"
  },
  {
    icon: <Building size={24} className="text-gradient" aria-hidden="true" />,
    title: "Election Day",
    description: "The traditional way. Go to your designated polling place.",
    color: "rgba(236, 72, 153, 0.1)",
    border: "rgba(236, 72, 153, 0.3)"
  }
];

const VotingMethods: React.FC = () => {
  return (
    <div 
      className="glass-card" 
      style={{ padding: '20px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}
      aria-label="Overview of voting methods"
    >
      <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>Ways to Cast Your Ballot</h3>
      
      {methods.map((method, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.15 }}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            padding: '12px',
            background: method.color,
            border: `1px solid ${method.border}`,
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ padding: '8px', background: 'var(--bg-surface)', borderRadius: '50%' }} aria-hidden="true">
            {method.icon}
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '2px' }}>{method.title}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{method.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default React.memo(VotingMethods);
