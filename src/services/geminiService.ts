import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface SpeechEvaluation {
  success: boolean;
  feedback: string;
  transcription?: string;
  specialist_feedback?: string;
}

export async function getSpeechEvaluation(taskTitle: string, taskDescription: string, audioBase64?: string, mimeType?: string): Promise<SpeechEvaluation> {
  try {
    const prompt = `
      Sən uşaqlar üçün peşəkar nitq məşqçisisən. 
      Uşaq "${taskTitle}" (Məqsəd: ${taskDescription}) tapşırığını yerinə yetirmək üçün səs yazısı göndərdi.
      
      Səndən xahiş olunur:
      1. Göndərilən səsi çox ciddi şəkildə analiz et.
      2. Səsdə deyilən sözləri Azərbaycanca transkripsiya et (transcription).
      3. Əgər səs: 
         - Tamamilə səssizdirsə və ya yalnız kənar küylər varsa;
         - Mənasız hecalardan (məsələn: "lələlə", "bababa", "asdasd") ibarətdirsə;
         - Mövzu ilə ("${taskTitle}") heç bir əlaqəsi olmayan, tamamilə fərqli bir kənar mövzudursa;
         "success" sahəsini false et və uşağa çox mehriban şəkildə tapşırığı xatırlat.
      4. Əgər uşaq həqiqətən cəhd edirsə, uşaq dili ilə olsa belə mövzuya toxunursa, "success" sahəsini true et və onu çox həvəsləndir (feedback).
      5. Əlavə olaraq, valideyn və ya müəllim üçün "specialist_feedback" sahəsində uşağın nitqini necə daha da təkmilləşdirə biləcəyi barədə konstruktiv, peşəkar məsləhət ver. Bu hissə bir az daha detallı ola bilər.
      
      Rəy Azərbaycanca olsun. "feedback" maksimum 2 qısa cümlə, "specialist_feedback" isə 1-2 konstruktiv cəmi cümlə olsun.
    `;

    const parts: any[] = [{ text: prompt }];
    
    if (audioBase64 && mimeType) {
      parts.push({
        inlineData: {
          data: audioBase64,
          mimeType: mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
            transcription: { type: Type.STRING },
            specialist_feedback: { type: Type.STRING }
          },
          required: ["success", "feedback"]
        }
      }
    });
    
    const jsonStr = response.text;
    if (jsonStr) {
      return JSON.parse(jsonStr) as SpeechEvaluation;
    }
    
    return {
      success: true,
      feedback: "Sən əla iş gördün! Həmişə belə cəsarətli ol! 🌟"
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      success: false,
      feedback: "Bağışla, səni tam eşidə bilmədim. Bir daha yoxlayaq? 🌟"
    };
  }
}

export async function getStageEvaluation(levelName: string, audioBase64?: string, mimeType?: string): Promise<SpeechEvaluation & { question?: string }> {
  try {
    const prompt = `
      Sən uşaqların səhnə çıxışını izləyən mehriban bir tamaşaçısan.
      Uşaq səhnədə "${levelName}" qarşısında çıxış edir.
      
      Səndən xahiş olunur:
      1. Uşağın dediklərini Azərbaycanca transkripsiya et.
      2. Əgər uşaq mənası olan hər hansı bir şey deyirsə (hətta qısa olsa belə), "success" sahəsini true et.
      3. Çıxışla bağlı uşağa ÇOX SADƏ və MEHRİBAN bir sual ver (question). Sual Azərbaycanca və cəmi 1 qısa cümlə olsun.
      
      Cavabı YALNIZ JSON formatında ver.
    `;

    const parts: any[] = [{ text: prompt }];
    if (audioBase64 && mimeType) {
      parts.push({ inlineData: { data: audioBase64, mimeType } });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
            transcription: { type: Type.STRING },
            question: { type: Type.STRING }
          },
          required: ["success", "feedback", "transcription", "question"]
        }
      }
    });

    const jsonStr = response.text;
    if (jsonStr) {
      return JSON.parse(jsonStr);
    }
    
    return { 
      success: true, 
      feedback: "Əla çıxış!", 
      transcription: "...", 
      question: "Bunu hardan öyrəndin?" 
    };
  } catch (error) {
    console.error("Stage API Error:", error);
    return { 
      success: true, 
      feedback: "Böyük cəsarətdir!", 
      transcription: "...", 
      question: "Maraqlı idi, başqa nələr bilirsən?" 
    };
  }
}

export interface Scenario {
  text: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

export async function getScenarios(): Promise<Scenario[]> {
  try {
    const prompt = `
      Uşaqların özünə inamını artırmaq üçün 10 fərqli ssenari hazırla.
      Hər ssenaridə uşağın qarşılaşa biləcəyi bir çətinlik (məsələn: məktəbdə, dostlar arasında, yarışda) və 3 seçim olmalıdır (cəsarətli, orta, çəkinən).
      YALNIZ uşaqların gündəlik həyatı ilə bağlı, Azərbaycanca və cəsarətləndirici olsun.
      
      Cavabı JSON formatında ver.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: prompt }] },
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    isCorrect: { type: Type.BOOLEAN },
                    feedback: { type: Type.STRING }
                  },
                  required: ["text", "isCorrect", "feedback"]
                }
              }
            },
            required: ["text", "options"]
          }
        }
      }
    });

    const jsonStr = response.text;
    if (jsonStr) {
      return JSON.parse(jsonStr);
    }
  } catch (error) {
    console.error("Scenario Error:", error);
  }
  return [];
}

export async function getConfidenceSpecialistFeedback(score: number, total: number) {
  try {
    const percentage = Math.round((score / total) * 100);
    const prompt = `
      Uşaq özünə inam testində ${total} ssenaridən ${score}-nə doğru ("cəsarətli") cavab verdi (${percentage}%).
      Valideyn və müəllim üçün uşağın cəsarətini necə artırmaq barədə 1-2 cümləlik peşəkar Azərbaycanca məsləhət ver.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: prompt }] }
    });

    return response.text || "Uşağı hər addımında dəstəkləməyə davam edin!";
  } catch (error) {
    return "Uşağın cəhdini yüksək qiymətləndirin və ona daha çox sərbəstlik verin.";
  }
}

