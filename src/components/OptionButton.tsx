import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface OptionButtonProps {
  label: string;
  onClick: () => void;
  index: number;
}

const OptionButton: React.FC<OptionButtonProps> = ({ label, onClick, index }) => (
  <motion.button
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)' }}
    whileTap={{ scale: 0.95 }}
    className="btn btn-outline"
    style={{ padding: '8px 16px', fontSize: '0.875rem' }}
    onClick={onClick}
    aria-label={`Choose option: ${label}`}
  >
    {label} <ChevronRight size={14} aria-hidden="true" />
  </motion.button>
);

export default React.memo(OptionButton);
