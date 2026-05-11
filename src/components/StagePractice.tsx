import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Theater, Users, Star, Loader2, Mic } from 'lucide-react';
import { cn } from '../lib/utils';
import { getStageEvaluation } from '../services/geminiService';

const LEVELS = [
  { id: 1, name: 'Tək', audience: 0, icon: '🏠' },
  { id: 2, name: 'Dost', audience: 1, icon: '👫' },
  { id: 3, name: 'Ailə', audience: 4, icon: '👨‍👩‍👧‍👦' },
  { id: 4, name: 'Sinif', audience: 10, icon: '🏫' },
  { id: 5, name: 'Böyük Səhnə', audience: 20, icon: '🏟️' },
];

export function StagePractice({ onComplete }: { onComplete: () => void }) {
  const [level, setLevel] = React.useState(LEVELS[0]);
  const [isPerforming, setIsPerforming] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [audienceQuestion, setAudienceQuestion] = React.useState<string | null>(null);
  const [transcription, setTranscription] = React.useState<string | null>(null);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsLoading(true);
        setIsDone(true);
        
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            try {
              const base64Audio = (reader.result as string).split(',')[1];
              // Unified stage evaluation
              const result = await getStageEvaluation(
                level.name,
                base64Audio, 
                mediaRecorder.mimeType
              );
              
              setTranscription(result.transcription || null);

              // If level has audience, set the question from the unified response
              if (level.audience > 0) {
                setAudienceQuestion(result.question || "Çox gözəl! Bəs sən ən çox nəyi sevisən?");
              }
              
              if (result.success) {
                onComplete();
              }
            } catch (err) {
              console.error("Stage evaluation error:", err);
            } finally {
              setIsLoading(false);
            }
          };
        } catch (err) {
          console.error("Audio processing error:", err);
          setIsLoading(false);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsPerforming(true);
      setIsDone(false);
      setAudienceQuestion(null);
      setTranscription(null);
    } catch (err) {
      console.error("Mikrofon xətası:", err);
    }
  };

  const finish = () => {
    if (mediaRecorderRef.current && isPerforming) {
      mediaRecorderRef.current.stop();
      setIsPerforming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#061a12] via-green-dark to-teal p-6 pt-10">
      <div className="max-w-md mx-auto">
        <h2 className="font-serif text-2xl font-bold text-center mb-2">🎭 Səhnə Məşqi</h2>
        <p className="text-white/50 text-center text-sm mb-8">İzləyici sayını artır, qorxunu azalt!</p>

        {/* Level Tabs */}
        <div className="flex gap-2 flex-wrap justify-center mb-10">
          {LEVELS.map(l => (
            <button
              key={l.id}
              onClick={() => {
                setLevel(l);
                setIsPerforming(false);
                setIsDone(false);
              }}
              className={cn(
                "px-4 py-2 rounded-xl border text-xs font-body transition-all",
                level.id === l.id 
                  ? "bg-white/20 border-white text-white font-bold"
                  : "bg-white/5 border-white/10 text-white/60"
              )}
            >
              {l.name}
            </button>
          ))}
        </div>

        {/* Stage Area */}
        <div className="relative bg-black/40 border border-white/10 rounded-[40px] p-8 min-h-[400px] flex flex-col justify-between items-center shadow-inner overflow-hidden">
          
          {/* Virtual Audience */}
          <div className="grid grid-cols-5 gap-3 w-full justify-items-center mb-10 min-h-[80px]">
            {Array.from({ length: level.audience }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={cn("text-3xl", isPerforming && "animate-clap")}
              >
                {['😊', '🤩', '👋', '👏', '🧒'][i % 5]}
              </motion.div>
            ))}
            {level.audience === 0 && (
              <div className="col-span-5 text-white/20 text-xs italic">Heç kim yoxdur, rahat danışa bilərsən...</div>
            )}
          </div>

          {/* Main Stage */}
          <div className="flex flex-col items-center flex-1 justify-center">
            <AnimatePresence mode="wait">
              {isPerforming ? (
                <motion.div 
                  key="perf"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="relative">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-7xl"
                    >
                      🎤
                    </motion.div>
                    {/* Spotlight effect */}
                    <div className="absolute inset-0 bg-gold/20 blur-3xl -z-10 rounded-full" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-serif text-xl font-bold text-gold pulse-text">Çıxış Başladı!</h4>
                    <p className="text-white/60 text-xs mt-1">İzləyicilər səni dinləyir...</p>
                  </div>
                </motion.div>
              ) : isDone ? (
                <motion.div 
                  key="done"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center w-full px-4"
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin text-gold" size={40} />
                      <p className="text-white/60 text-sm italic font-body">İzləyicilər səni analiz edir...</p>
                    </div>
                  ) : (
                    <>
                      <div className="text-6xl mb-4">🏆</div>
                      <h4 className="font-serif text-2xl font-bold text-gold mb-2">Afərin!</h4>
                      
                      {transcription && (
                        <div className="mb-4 text-left bg-white/5 p-3 rounded-2xl border border-white/10">
                          <span className="text-[10px] text-white/30 uppercase font-bold mb-1 block tracking-wider">Sən dedin:</span>
                          <p className="text-white/80 text-xs italic font-body">"{transcription}"</p>
                        </div>
                      )}

                      {audienceQuestion && (
                        <motion.div 
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="mb-6 p-4 bg-teal/20 border border-teal/40 rounded-2xl shadow-xl"
                        >
                          <span className="text-[10px] text-teal font-bold uppercase mb-1 block tracking-widest text-left">İzləyicidən sual:</span>
                          <p className="text-white text-sm font-bold font-serif leading-relaxed">
                            "{audienceQuestion}"
                          </p>
                        </motion.div>
                      )}

                      {!audienceQuestion && level.audience > 0 && (
                        <p className="text-white/80 text-sm mb-6 max-w-[200px] mx-auto">
                          Sən {level.name} qarşısında cəsarətlə çıxış etdin!
                        </p>
                      )}

                      <div className="flex gap-2 justify-center mt-2">
                        <Star className="text-gold fill-gold" fill="currentColor" size={24} />
                        <Star className="text-gold fill-gold" fill="currentColor" size={24} />
                        <Star className="text-gold fill-gold" fill="currentColor" size={24} />
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="text-7xl mb-6 opacity-30">{level.icon}</div>
                  <h4 className="font-serif text-xl font-bold mb-1">{level.name} Məşqi</h4>
                  <p className="text-white/40 text-[13px] mb-8">Hazırsansa səhnəyə çıx!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full mt-4 flex flex-col items-center">
            {!isPerforming && !isDone && (
              <button
                onClick={start}
                className="bg-gradient-to-r from-gold to-orange px-10 py-4 rounded-2xl font-serif font-black text-lg shadow-[0_10px_30px_rgba(232,106,46,0.3)] active:scale-95 transition-all w-full"
              >
                Başla! 🎤
              </button>
            )}
            {isPerforming && (
              <button
                onClick={finish}
                className="bg-gradient-to-r from-teal to-[#14a085] px-10 py-4 rounded-2xl font-serif font-black text-lg shadow-[0_10px_30px_rgba(13,115,119,0.3)] active:scale-95 transition-all w-full"
              >
                Bitir və Təzim et 🙇‍♂️
              </button>
            )}
            {isDone && (
              <button
                onClick={() => setIsDone(false)}
                className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-xl border border-white/10 text-sm font-bold transition-all w-full"
              >
                Yenidən Hazırlaş 🔄
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
