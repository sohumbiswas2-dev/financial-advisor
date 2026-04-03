import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  content: string;
  triggerCondition: 'onDecision' | 'onPeriodChange' | 'onTimeSpent' | 'onOutcomeReveal';
  triggerValue?: any;
}

interface ProgressiveLessonsProps {
  lessons: Lesson[];
  currentTrigger: { type: string; value?: any };
}

export const ProgressiveLessons: React.FC<ProgressiveLessonsProps> = ({ lessons, currentTrigger }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [viewedLessons, setViewedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!currentTrigger) return;

    const triggeredLesson = lessons.find(lesson => {
      if (viewedLessons.has(lesson.id)) return false;
      
      if (lesson.triggerCondition === currentTrigger.type) {
        if (lesson.triggerValue && currentTrigger.value) {
          return lesson.triggerValue === currentTrigger.value;
        }
        return true;
      }
      return false;
    });

    if (triggeredLesson) {
      setActiveLesson(triggeredLesson);
    }
  }, [currentTrigger, lessons, viewedLessons]);

  const handleClose = () => {
    if (activeLesson) {
      setViewedLessons(prev => new Set(prev).add(activeLesson.id));
      setActiveLesson(null);
    }
  };

  return (
    <AnimatePresence>
      {activeLesson && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100, y: 50 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="fixed bottom-6 right-6 w-80 newspaper-card shadow-2xl z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between p-3 bg-[var(--tan-mid)] border-b-2 border-[var(--dark-sepia)]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--ink)]" />
              <h3 className="font-serif text-sm text-[var(--ink)] font-bold uppercase tracking-widest">Finance Lesson</h3>
            </div>
            <button 
              onClick={handleClose}
              className="text-[var(--ink)] opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4">
            <h4 className="font-serif text-lg font-bold mb-2 text-[var(--ink)]">{activeLesson.title}</h4>
            <p className="text-sm text-[var(--ink)] opacity-80 leading-relaxed">
              {activeLesson.content}
            </p>
          </div>
          
          <div className="bg-[var(--tan-mid)] p-2 text-center border-t-2 border-[var(--dark-sepia)]">
            <button 
              onClick={handleClose}
              className="text-xs font-mono text-[var(--ink)] font-bold hover:opacity-70 uppercase tracking-widest transition-opacity"
            >
              Got it
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
