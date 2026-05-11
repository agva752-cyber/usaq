import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { getScenarios, getConfidenceSpecialistFeedback, Scenario } from '../services/geminiService';
import { Loader2, Award, ArrowRight, RefreshCcw, Wifi, WifiOff } from 'lucide-react';
import { SCENARIOS as OFFLINE_SCENARIOS } from '../constants';

interface ConfidenceTrainingProps {
  onComplete: () => void;
}

type TrainingMode = 'selection' | 'online' | 'offline';

export function ConfidenceTraining({ onComplete }: ConfidenceTrainingProps) {
  const [mode, setMode] = React.useState<TrainingMode>('selection');
  const [scenarios, setScenarios] = React.useState<Scenario[]>([]);
  const [index, setIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showEvaluation, setShowEvaluation] = React.useState(false);
  const [specialistFeedback, setSpecialistFeedback] = React.useState<string | null>(null);

  const startTraining = async (selectedMode: TrainingMode) => {
    setMode(selectedMode);
    setIndex(0);
    setScore(0);
    setShowEvaluation(false);
    setSelectedOption(null);
    setShowFeedback(false);

    if (selectedMode === 'online') {
      setIsLoading(true);
      const newScenarios = await getScenarios();
      setScenarios(newScenarios);
      setIsLoading(false);
    } else if (selectedMode === 'offline') {
      setScenarios(OFFLINE_SCENARIOS);
    }
  };

  const handleSelect = (optIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIdx);
    setShowFeedback(true);
    if (scenarios[index].options[optIdx].isCorrect) {
      setScore(s => s + 1);
      onComplete();
    }
  };

  const next = async () => {
    if (index < scenarios.length - 1) {
      setIndex(i => i + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      // Completed batch
      setIsLoading(true);
      const feedback = await getConfidenceSpecialistFeedback(score, scenarios.length);
      setSpecialistFeedback(feedback);
      setShowEvaluation(true);
      setIsLoading(false);
    }
  };

  if (mode === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#061a12] via-green-dark to-[#0D7377] p-6 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <h2 className="text-4xl">🧠</h2>
          </div>
          <h2 className="font-serif text-2xl font-bold text-white mb-2">Cəsarət Ssenariləri</h2>
          <p className="text-white/60 mb-8 text-sm">Bir rejim seç və özünə inamını artır!</p>

          <div className="grid gap-4">
            <button
              onClick={() => startTraining('online')}
              className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/15 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-teal/20 flex items-center justify-center text-teal group-hover:scale-110 transition-transform">
                <Wifi size={24} />
              </div>
              <div>
                <div className="text-white font-bold">Onlayn Rejim</div>
                <div className="text-white/40 text-xs italic">Süni intellekt tərəfindən yeni ssenarilər</div>
              </div>
              <ArrowRight className="ml-auto text-white/20" size={20} />
            </button>

            <button
              onClick={() => startTraining('offline')}
              className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/15 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange/20 flex items-center justify-center text-orange group-hover:scale-110 transition-transform">
                <WifiOff size={24} />
              </div>
              <div>
                <div className="text-white font-bold">Oflayn Rejim</div>
                <div className="text-white/40 text-xs italic">Sentyabr ayının ssenariləri (10 sual)</div>
              </div>
              <ArrowRight className="ml-auto text-white/20" size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const scenario = scenarios[index];

  if (isLoading && !showEvaluation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#061a12] via-green-dark to-[#0D7377] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="animate-spin text-gold mb-4" size={48} />
        <h3 className="text-white font-serif text-xl mb-2">
          {mode === 'online' ? 'Onlayn Ssenarilər Hazırlanır...' : 'Yüklənir...'}
        </h3>
        <p className="text-white/50 text-sm italic">Uşağınız üçün ən maraqlı və öyrədici ssenari seçilir.</p>
      </div>
    );
  }

  if (scenarios.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#061a12] via-green-dark to-[#0D7377] flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">🔮</div>
        <h3 className="text-white font-serif text-xl mb-2">Bağışla, bir xəta oldu</h3>
        <p className="text-white/50 text-sm italic mb-6">Ssenariləri yükləyə bilmədik. Yenidən yoxlayaq?</p>
        <div className="flex gap-4">
          <button 
            onClick={() => startTraining(mode)}
            className="bg-gold px-6 py-3 rounded-xl font-bold text-background flex items-center gap-2"
          >
            <RefreshCcw size={20} /> Yenidən yoxla
          </button>
          <button 
            onClick={() => setMode('selection')}
            className="bg-white/10 px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2"
          >
            Geri
          </button>
        </div>
      </div>
    );
  }

  if (showEvaluation) {
    const percentage = Math.round((score / scenarios.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#061a12] via-green-dark to-[#0D7377] p-6 pt-10 flex flex-col items-center">
        <div className="max-w-md w-full bg-white/10 rounded-3xl p-8 border border-white/20 text-center shadow-2xl">
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="text-gold" size={40} />
          </div>
          <h2 className="font-serif text-3xl font-bold text-white mb-2">Afərin!</h2>
          <p className="text-white/60 mb-6">Sən bu turda özünü çox cəsur göstərdin!</p>
          
          <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
            <div className="text-4xl font-bold mb-1 text-gold">{percentage}%</div>
            <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Cəsarət Faizi ({score}/{scenarios.length})</div>
          </div>

          <div className="text-left mb-8">
            <span className="text-[10px] text-teal font-bold uppercase tracking-widest mb-1 block">Mütəxəssis Rəyi:</span>
            <p className="text-white/80 text-sm italic leading-relaxed font-body">
              "{specialistFeedback}"
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setMode('selection')}
              className="w-full bg-gold py-4 rounded-2xl font-serif font-bold text-background flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-transform"
            >
              Yenidən Başla <RefreshCcw size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#061a12] via-green-dark to-[#0D7377] p-6 pt-10">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setMode('selection')}
            className="text-white/40 text-xs flex items-center gap-1 hover:text-white transition-colors"
          >
            ← Geri
          </button>
          <h2 className="font-serif text-xl font-bold text-white">🧠 Özünə İnam</h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded italic">
              {mode === 'online' ? 'Onlayn' : 'Oflayn'}
            </span>
          </div>
        </div>
        
        <div className="flex gap-1 mb-8">
          {Array.from({ length: scenarios.length }).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                i < index ? "bg-gold" : i === index ? "bg-white/30" : "bg-white/10"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 block">Ssenari {index + 1}</span>
              <p className="text-white text-lg font-body leading-relaxed">
                {scenario?.text}
              </p>
            </div>

            <div className="grid gap-3">
              {scenario?.options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = opt.isCorrect;
                return (
                  <button
                    key={i}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelect(i)}
                    className={cn(
                      "w-full p-4 rounded-2xl border text-left flex items-center gap-4 transition-all duration-300",
                      selectedOption === null 
                        ? "bg-white/5 border-white/10 hover:bg-white/15 active:scale-98"
                        : isSelected
                          ? isCorrect 
                            ? "bg-teal/40 border-teal shadow-[0_0_20px_rgba(13,115,119,0.3)]"
                            : "bg-red-500/30 border-red-500"
                          : "bg-white/5 border-white/10 opacity-50"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold font-serif text-sm">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="font-body text-sm font-medium pr-8">{opt.text}</span>
                    {isSelected && (
                      <span className="ml-auto text-xl shrink-0">{isCorrect ? '✅' : '❌'}</span>
                    )}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-gold/15 border border-gold/30 rounded-2xl p-5 shadow-inner"
                >
                  <p className="text-gold text-sm font-body leading-relaxed italic text-center">
                    "{scenario.options[selectedOption!].feedback}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {selectedOption !== null && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={next}
                className="w-full bg-gradient-to-r from-purple to-[#5a4fcf] py-4 rounded-2xl font-serif font-bold text-lg shadow-xl active:scale-95 transition-transform"
              >
                {index < scenarios.length - 1 ? 'Növbəti ssenari →' : 'Nəticəni gör 📊'}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

