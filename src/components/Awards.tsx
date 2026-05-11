import React from 'react';
import { motion } from 'motion/react';
import { Star, Trophy, Target, Award as AwardIcon } from 'lucide-react';
import { AWARDS } from '../constants';
import { cn } from '../lib/utils';

interface AwardsProps {
  stars: number;
  tasksCompleted: number;
}

export function Awards({ stars, tasksCompleted }: AwardsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#061a12] via-green-dark to-[#0D7377] p-6 pt-10">
      <div className="max-w-md mx-auto">
        <h2 className="font-serif text-2xl font-bold text-center mb-2">⭐ Mükafatlarım</h2>
        <p className="text-white/50 text-center text-sm mb-10">Cəsarətin hər addımı bir ulduzdur!</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <StatCard icon={<Star className="text-gold" />} val={stars} label="Ulduzlar" />
          <StatCard icon={<Target className="text-purple" />} val={tasksCompleted} label="Tapşırıqlar" />
          <StatCard icon={<Trophy className="text-orange" />} val={AWARDS.filter(a => stars >= a.requiredStars).length} label="Mükafatlar" />
        </div>

        <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4 px-1">Fəxri Nişanlar</h3>
        
        <div className="space-y-3">
          {AWARDS.map(award => {
            const isEarned = stars >= award.requiredStars;
            return (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "p-4 rounded-[24px] border flex items-center gap-5 transition-all duration-500",
                  isEarned 
                    ? "bg-gold/15 border-gold/30 shadow-lg shadow-gold/5" 
                    : "bg-white/5 border-white/10 opacity-40 grayscale"
                )}
              >
                <div className="text-5xl drop-shadow-lg">{award.icon}</div>
                <div className="flex-1">
                  <div className={cn(
                    "font-serif text-lg font-bold leading-tight",
                    isEarned ? "text-gold" : "text-white/40"
                  )}>
                    {award.title}
                  </div>
                  <p className="text-white/40 text-[11px] mt-1 font-body">{award.description}</p>
                </div>
                {isEarned && (
                  <div className="bg-gold/20 p-2 rounded-full">
                    <AwardIcon size={16} className="text-gold" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Encouragement Quote */}
        <div className="mt-12 bg-gold/5 border border-gold/20 rounded-3xl p-6 text-center italic">
          <p className="text-gold/80 text-sm font-body leading-relaxed">
            "Dünənin qorxusu, bugünün cəsarətidir. Sən hər gün daha böyük səslə danışırsan! 🦁"
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, val, label }: { icon: React.ReactNode, val: number, label: string }) {
  return (
    <div className="bg-white/5 border border-white/15 rounded-2xl p-4 text-center shadow-lg">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="font-serif text-3xl font-black text-gold">{val}</div>
      <div className="text-white/40 text-[9px] uppercase font-bold tracking-wider mt-1">{label}</div>
    </div>
  );
}
