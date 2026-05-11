import React from 'react';
import { motion } from 'motion/react';
import { Page } from '../types';

interface HomeProps {
  navigate: (page: Page) => void;
  stars: number;
}

export function Home({ navigate, stars }: HomeProps) {
  // Generate random stars for background
  const backgroundStars = React.useMemo(() => 
    Array.from({ length: 30 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      dur: `${2 + Math.random() * 3}s`,
      delay: `${Math.random() * 5}s`,
      size: `${1 + Math.random() * 3}px`
    })), []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#061a12] via-teal to-[#1E5128] px-6 pt-12 animate-in fade-in duration-700">
      {/* Background Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {backgroundStars.map((star, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-gold star-twinkle"
            style={{ 
              left: star.left, 
              top: star.top, 
              width: star.size, 
              height: star.size,
              '--dur': star.dur,
              '--delay': star.delay
            } as any}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-7xl mb-2"
        >
          🦋
        </motion.div>
        
        <h1 className="font-serif text-3xl font-black text-center leading-tight shadow-text">
          Səssiz Uşaqların<br />
          <span className="text-gold">Səsi</span>
        </h1>
        <p className="text-white/60 text-sm mt-2 text-center">
          Hər uşağın səsi var. Birlikdə tapaq! ✨
        </p>

        {/* Profile Card */}
        <div className="mt-8 w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-orange flex items-center justify-center text-3xl shadow-lg">
              👧
            </div>
            <div>
              <div className="text-white/60 text-xs font-body">Xoş gəldin!</div>
              <div className="font-serif text-xl font-bold tracking-wide">Türkan</div>
              <div className="text-gold text-xs font-semibold mt-0.5">⭐ {stars} ulduz qazanılıb</div>
            </div>
          </div>
          
          <div className="mt-5 flex justify-between text-[11px] font-body text-white/60">
            <span>Bu həftəki irəliləyiş</span>
            <strong className="text-gold">60%</strong>
          </div>
          <div className="mt-1 h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              className="h-full bg-gradient-to-r from-gold to-orange"
            />
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 w-full">
          <ActionButton 
            icon="🎙️" 
            label="Nitq Məşqi" 
            color="from-teal to-[#14a085]" 
            onClick={() => navigate('speech')} 
          />
          <ActionButton 
            icon="🧠" 
            label="Özünə İnam" 
            color="from-purple to-[#5a4fcf]" 
            onClick={() => navigate('confidence')} 
          />
          <ActionButton 
            icon="🎭" 
            label="Səhnə Məşqi" 
            color="from-orange to-[#c0392b]" 
            onClick={() => navigate('stage')} 
          />
          <ActionButton 
            icon="⭐" 
            label="Mükafatlar" 
            color="from-gold to-[#e67e22]" 
            onClick={() => navigate('awards')} 
          />
        </div>

        {/* Tip Card */}
        <div className="mt-6 w-full bg-gold/10 border border-gold/30 rounded-2xl p-4 shadow-sm">
          <div className="text-gold text-xs font-bold mb-1">💡 Günün məsləhəti</div>
          <p className="text-white/80 text-[13px] leading-relaxed">
            "Hər böyük natiq bir vaxtlar qorxurdu. Fərq — onlar cəhd etdi." 🦁
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, color, onClick }: { icon: string; label: string; color: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "bg-gradient-to-br flex flex-col items-center justify-center p-4 rounded-2xl shadow-lg active:scale-95 transition-transform",
        color
      )}
    >
      <span className="text-3xl mb-2">{icon}</span>
      <span className="font-serif text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
