import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { getScenarios, getConfidenceSpecialistFeedback, Scenario } from '../services/geminiService';
import { Loader2, Award, ArrowRight, RefreshCcw } from 'lucide-react';

interface ConfidenceTrainingProps {
  onComplete: () => void;
}

export function ConfidenceTraining({ onComplete }: ConfidenceTrainingProps) {
  const [scenarios, setScenarios] = React.useState<Scenario[]>([]);
  const [index, setIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showEvaluation, setShowEvaluation] = React.useState(false);
  const [specialistFeedback, setSpecialistFeedback] = React.useState<string | null>(null);

  const loadScenarios = async () => {
    setIsLoading(true);
    const newScenarios = await getScenarios();
    setScenarios(newScenarios);
    setIndex(0);
    setScore(0);
    setShowEvaluation(false);
    setIsLoading(false);
  };

  React.useEffect(() => {
    loadScenarios();
  }, []);

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

  const scenario = scenarios[index];

  if (isLoading && !showEvaluation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#061a12] via-green-dark to-[#0D7377] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="animate-spin text-gold mb-4" size={48} />
        <h3 className="text-white font-serif text-xl mb-2">Cəsarət Ssenariləri Hazırlanır...</h3>
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
        <button 
          onClick={() => loadScenarios()}
          className="bg-gold px-8 py-3 rounded-xl font-bold text-background flex items-center gap-2"
        >
          <RefreshCcw size={20} /> Yenidən yoxla
        </button>
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
            <div className="text-xs text-white/40 uppercase tracking-widest font-bold">Cəsarət Faizi</div>
          </div>

          <div className="text-left mb-8">
            <span className="text-[10px] text-teal font-bold uppercase tracking-widest mb-1 block">Mütəxəssis Rəyi:</span>
            <p className="text-white/80 text-sm italic leading-relaxed font-body">
              "{specialistFeedback}"
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => loadScenarios()}
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
          <h2 className="font-serif text-2xl font-bold text-white">🧠 Özünə İnam</h2>
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

