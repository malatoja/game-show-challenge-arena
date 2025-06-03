
import React from 'react';
import { motion } from 'framer-motion';

interface QuestionDisplayProps {
  question: string;
  hint?: string;
  showHint?: boolean;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ 
  question, 
  hint, 
  showHint = false 
}) => {
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
      
      {showHint && hint && (
        <motion.div 
          className="mt-6 text-xl text-yellow-300 text-center italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div 
            className="inline-block bg-yellow-300/20 px-4 py-2 rounded-md border border-yellow-300/30"
            animate={{ 
              boxShadow: ['0 0 5px rgba(234, 179, 8, 0.3)', '0 0 15px rgba(234, 179, 8, 0.6)', '0 0 5px rgba(234, 179, 8, 0.3)']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Wskazówka: {hint}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuestionDisplay;
