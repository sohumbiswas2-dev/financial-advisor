import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { GlossaryText } from '../ui/GlossaryText';
import { MentorAdvice } from '../../data/mentorLogic';

interface ConflictingMentorsProps {
  mentors: MentorAdvice[];
  beginnerMode: boolean;
}

export const ConflictingMentors: React.FC<ConflictingMentorsProps> = ({ mentors, beginnerMode }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b-2 border-dark-sepia pb-2 mb-2">
        <MessageCircle className="w-4 h-4 text-ink" />
        <h3 className="font-serif text-sm font-bold uppercase tracking-widest text-ink">Mentor Debate</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentors.map((mentor, idx) => (
          <motion.div
            key={mentor.persona}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="p-4 bg-tan-light border-2 border-dark-sepia shadow-[4px_4px_0px_var(--sepia)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10">
              {mentor.persona.includes('Value') ? <ShieldAlert className="w-12 h-12" /> : <Sparkles className="w-12 h-12" />}
            </div>
            
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <span className="text-2xl" role="img" aria-label="mentor avatar">{mentor.avatar}</span>
              <div>
                <div className="font-serif font-bold text-xs uppercase tracking-wider text-ink">
                  {mentor.persona}
                </div>
                <div className="text-[10px] font-mono opacity-60 uppercase">
                  {mentor.persona.includes('Value') ? 'Conservative' : 'Aggressive'}
                </div>
              </div>
            </div>
            
            <div className="relative z-10">
              <p className="text-xs italic leading-relaxed text-ink/90">
                <GlossaryText text={mentor.advice} beginnerMode={beginnerMode} />
              </p>
            </div>
            
            <div className={`h-1 w-full mt-4 bg-ink/10`}>
              <div 
                className="h-full" 
                style={{ 
                  backgroundColor: mentor.color,
                  width: mentor.persona.includes('Value') ? '40%' : '80%' 
                }} 
              />
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-[10px] font-mono opacity-50 uppercase tracking-tighter">
          * Mentors provide perspective only. The final decision is yours.
        </p>
      </div>
    </div>
  );
};
