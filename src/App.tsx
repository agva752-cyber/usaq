import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home as HomeIcon, Mic, Brain, Theater, Trophy } from 'lucide-react';
import { Page } from './types';
import { cn } from './lib/utils';
import { Home } from './components/Home';
import { SpeechPractice } from './components/SpeechPractice';
import { ConfidenceTraining } from './components/ConfidenceTraining';
import { StagePractice } from './components/StagePractice';
import { Awards } from './components/Awards';

export default function App() {
  const [currentPage, setCurrentPage] = React.useState<Page>('home');
  const [stars, setStars] = React.useState(2);
  const [tasksCompleted, setTasksCompleted] = React.useState(0);

  const addStar = (count: number = 1) => {
    setStars(prev => prev + count);
    setTasksCompleted(prev => prev + 1);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home navigate={setCurrentPage} stars={stars} />;
      case 'speech': return <SpeechPractice onComplete={() => addStar(1)} />;
      case 'confidence': return <ConfidenceTraining onComplete={() => addStar(1)} />;
      case 'stage': return <StagePractice onComplete={() => addStar(2)} />;
      case 'awards': return <Awards stars={stars} tasksCompleted={tasksCompleted} />;
      default: return <Home navigate={setCurrentPage} stars={stars} />;
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-dark overflow-x-hidden">
      <div className="w-full max-w-[420px] min-h-screen relative pb-24">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-dark/95 backdrop-blur-xl border-t border-white/10 flex justify-around p-2 pt-3 pb-5 z-50">
          <NavButton 
            active={currentPage === 'home'} 
            onClick={() => setCurrentPage('home')}
            icon={<HomeIcon size={22} />}
            label="Ana Səhifə"
          />
          <NavButton 
            active={currentPage === 'speech'} 
            onClick={() => setCurrentPage('speech')}
            icon={<Mic size={22} />}
            label="Nitq"
          />
          <NavButton 
            active={currentPage === 'confidence'} 
            onClick={() => setCurrentPage('confidence')}
            icon={<Brain size={22} />}
            label="İnam"
          />
          <NavButton 
            active={currentPage === 'stage'} 
            onClick={() => setCurrentPage('stage')}
            icon={<Theater size={22} />}
            label="Səhnə"
          />
          <NavButton 
            active={currentPage === 'awards'} 
            onClick={() => setCurrentPage('awards')}
            icon={<Trophy size={22} />}
            label="Fəxrilər"
          />
        </nav>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200",
        active ? "bg-teal/20 text-teal" : "text-white/40"
      )}
    >
      {icon}
      <span className="text-[10px] font-semibold font-body">{label}</span>
    </button>
  );
}
