
import React from 'react';
import { motion } from 'framer-motion';

interface QuestionDisplayProps {
  question: string;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => {
  // Split the question into words for staggered animation
  const words = question.split(' ');
  
  return (
    <motion.div 
      className="w-4/5 max-w-[1000px] p-7 bg-black/70 backdrop-blur-md border-2 border-neon-blue rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        boxShadow: '0 0 20px rgba(46, 156, 202, 0.5)'
      }}
    >
      <motion.div 
        className="text-2xl md:text-3xl font-bold text-white text-center leading-relaxed"
        style={{
          textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(46, 156, 202, 0.3)'
        }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: 0.5 + i * 0.04,
              ease: "easeOut"
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};
