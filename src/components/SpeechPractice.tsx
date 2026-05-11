import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, ArrowLeft, Loader2 } from 'lucide-react';
import { TASKS } from '../constants';
import { Task } from '../types';
import { getSpeechEvaluation, SpeechEvaluation } from '../services/geminiService';

interface SpeechPracticeProps {
  onComplete: () => void;
}

export function SpeechPractice({ onComplete }: SpeechPracticeProps) {
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const [timer, setTimer] = React.useState(0);
  const [isDone, setIsDone] = React.useState(false);
  const [evaluation, setEvaluation] = React.useState<SpeechEvaluation | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = React.useState(false);

  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  const startRecording = async () => {
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
        setIsLoadingFeedback(true);
        setIsDone(true);
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            try {
              const base64Audio = (reader.result as string).split(',')[1];
              const result = await getSpeechEvaluation(
                selectedTask!.title, 
                selectedTask!.description, 
                base64Audio, 
                mediaRecorder.mimeType
              );
              setEvaluation(result);
              if (result.success) {
                onComplete();
              }
            } catch (err) {
              console.error("Evaluation error:", err);
              setEvaluation({ success: false, feedback: "Bağışla, səni tam eşidə bilmədim. Yenidən yoxlayaq? 🌟" });
            } finally {
              setIsLoadingFeedback(false);
            }
          };
        } catch (err) {
          console.error("Audio processing error:", err);
          setIsLoadingFeedback(false);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTimer(0);
      timerRef.current = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } catch (err) {
      console.error("Mikrofon xətası:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setIsLoadingFeedback(true);
      setIsDone(true);
    }
  };

  const reset = () => {
    setSelectedTask(null);
    setIsRecording(false);
    setTimer(0);
    setIsDone(false);
    setEvaluation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#061a12] via-green-dark to-teal p-6 pt-10">
      <div className="max-w-md mx-auto">
        <h2 className="font-serif text-2xl font-bold text-center mb-2">🎙️ Nitq Məşqi</h2>
        <p className="text-white/50 text-center text-sm mb-8">Bir tapşırıq seç, danış, böyü!</p>

        <AnimatePresence mode="wait">
          {!selectedTask ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {TASKS.map(task => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="w-full bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl p-5 flex items-center gap-4 transition-all active:scale-98 text-left"
                >
                  <span className="text-4xl">{task.icon}</span>
                  <div className="flex-1">
                    <div className="font-serif text-lg font-bold">{task.title}</div>
                    <div className="text-white/60 text-xs mt-1">{task.description}</div>
                    <div className="text-gold text-[11px] font-bold mt-1.5 uppercase tracking-wider">⏱ {task.duration}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl relative"
            >
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{selectedTask.icon}</div>
                <h3 className="font-serif text-2xl font-bold mb-2">{selectedTask.title}</h3>
                <p className="text-white/60 text-sm">{selectedTask.description}</p>
              </div>

              <div className="flex flex-col items-center">
                {isRecording && (
                  <div className="mb-6 flex items-center gap-3 bg-red-500/20 px-4 py-2 rounded-full">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-400 font-bold text-lg font-mono">00:{timer < 10 ? `0${timer}` : timer}</span>
                  </div>
                )}

                {!isDone ? (
                  <>
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-2xl transition-all active:scale-90 ${
                        isRecording ? 'bg-red-500 animate-pulse' : 'bg-teal'
                      }`}
                    >
                      {isRecording ? '⏹️' : '🎙️'}
                    </button>
                    <p className="text-white/40 text-xs mt-4">
                      {isRecording ? 'Dayandırmaq üçün bas' : 'Başlamaq üçün bas'}
                    </p>
                  </>
                ) : (
                  <div className="text-center w-full">
                    {evaluation?.success && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col items-center"
                      >
                        <div className="text-6xl mb-4 flex justify-center">🌟</div>
                        <h4 className="font-serif text-xl font-bold text-gold mb-4">Mükəmməl Çıxış!</h4>
                      </motion.div>
                    )}
                    
                    {!evaluation?.success && !isLoadingFeedback && (
                      <div className="text-6xl mb-4 flex justify-center">🌱</div>
                    )}
                    
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 relative min-h-[100px] flex flex-col items-center justify-center gap-3">
                      {isLoadingFeedback ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="animate-spin text-gold" size={24} />
                          <span className="text-white/40 text-xs text-center px-4">Məşqçi rəyi və transkripsiya hazırlanır...</span>
                        </div>
                      ) : (
                        <>
                          {evaluation?.transcription && (
                            <div className="w-full">
                              <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1 block">Sənin dediklərin:</span>
                              <p className="text-white/90 text-sm font-body bg-white/5 p-2 rounded-lg border border-white/5">
                                "{evaluation.transcription}"
                              </p>
                            </div>
                          )}
                          <div className="w-full mt-2">
                            <span className="text-[10px] text-gold/50 uppercase tracking-widest font-bold mb-1 block">Məşqçinin rəyi:</span>
                            <p className="text-sm italic text-gold leading-relaxed font-body">
                              "{evaluation?.feedback}"
                            </p>
                          </div>
                          {evaluation?.specialist_feedback && (
                            <div className="w-full mt-2 pt-2 border-t border-white/5">
                              <span className="text-[10px] text-teal/70 uppercase tracking-widest font-bold mb-1 block">Mütəxəssis məsləhəti:</span>
                              <p className="text-xs text-white/70 leading-relaxed font-body italic">
                                "{evaluation.specialist_feedback}"
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={reset}
                        className="flex-1 bg-white/10 hover:bg-white/15 py-3 rounded-xl text-sm font-bold transition-all"
                      >
                        Yenidən seç
                      </button>
                      <button 
                        onClick={() => {
                          setIsDone(false);
                          setTimer(0);
                          setEvaluation(null);
                        }}
                        className="flex-1 bg-gradient-to-r from-gold to-orange py-3 rounded-xl text-sm font-bold shadow-lg transition-all"
                      >
                        Təkrar et
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {!isRecording && !isDone && (
                <button 
                  onClick={reset}
                  className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/40 hover:text-white/60 transition-colors text-xs"
                >
                  <ArrowLeft size={14} /> Geri qayıt
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
