import React, { useState, useEffect, useRef } from 'react';
import { OpenMeteoWeatherResponse, MonsoonResult, ChatMessage } from '../types';
import { getSeasonDates } from '../services/weatherService';
import { I18N, localizeNumerals } from '../data/i18n';
import { MessageSquare, Mic, Volume2, VolumeX, Send, X, Bot, User } from 'lucide-react';

interface MeghChatProps {
  weather: OpenMeteoWeatherResponse | null;
  monsoonResult: MonsoonResult | null;
  locationLabel: string;
  currentLang: string;
  voiceLang: string;
  t: (key: string) => string;
}

const QUICK_INTENTS = [
  { intent: "umbrella", labelKey: "quickUmbrella" },
  { intent: "wear", labelKey: "quickWear" },
  { intent: "rain", labelKey: "quickRain" },
  { intent: "farm", labelKey: "quickFarm" }
];

const SCRIPT_RANGES = [
  { lang: "hi", re: /[\u0900-\u097F]/ },
  { lang: "bn", re: /[\u0980-\u09FF]/ },
  { lang: "gu", re: /[\u0A80-\u0AFF]/ },
  { lang: "pa", re: /[\u0A00-\u0A7F]/ },
  { lang: "or", re: /[\u0B00-\u0B7F]/ },
  { lang: "ta", re: /[\u0B80-\u0BFF]/ },
  { lang: "te", re: /[\u0C00-\u0C7F]/ },
  { lang: "kn", re: /[\u0C80-\u0CFF]/ },
  { lang: "ml", re: /[\u0D00-\u0D7F]/ },
  { lang: "ur", re: /[\u0600-\u06FF]/ }
];

export const MeghChat: React.FC<MeghChatProps> = ({
  weather,
  monsoonResult,
  locationLabel,
  currentLang,
  voiceLang,
  t
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: t('chatGreeting'),
      timestamp: new Date()
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const speakText = (text: string, langCode: string) => {
    if (!speakerOn || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLang || 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const generateReply = (query: string, targetLang: string): string => {
    const q = query.toLowerCase();
    const dict = I18N[targetLang] || I18N.en;
    const trans = (k: string) => dict[k] || I18N.en[k] || '';

    const dates = getSeasonDates(monsoonResult);
    const onsetStr = `${dates.onsetStart.toLocaleDateString([], { month: 'short', day: 'numeric' })} – ${dates.onsetEnd.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;

    if (q.includes('umbrella') || q.includes('rain today') || q.includes('छाता') || q.includes('ছাতা') || q.includes('குடை')) {
      if (weather?.daily?.precipitation_probability_max) {
        const prob = weather.daily.precipitation_probability_max[0] || 0;
        return prob >= 50
          ? `Yes, today's rain probability in ${locationLabel} is ${localizeNumerals(prob, targetLang)}%. It's advisable to carry an umbrella.`
          : `Rain chance today is only ${localizeNumerals(prob, targetLang)}%. An umbrella is optional.`;
      }
      return trans('replyUmbrella');
    }

    if (q.includes('wear') || q.includes('cloth') || q.includes('पहनें') || q.includes('কী পরব')) {
      if (weather?.current) {
        const temp = Math.round(weather.current.temperature_2m);
        const hum = Math.round(weather.current.relative_humidity_2m);
        return `Current temperature is ${localizeNumerals(temp, targetLang)}°C with ${localizeNumerals(hum, targetLang)}% humidity. Light breathable cotton clothes are ideal.`;
      }
      return trans('replyWear');
    }

    if (q.includes('this week') || q.includes('rain') || q.includes('बारिश') || q.includes('বৃষ্টি') || q.includes('மழை')) {
      if (weather?.daily?.precipitation_sum) {
        const sum7 = Math.round(weather.daily.precipitation_sum.slice(0, 7).reduce((a, b) => a + (b || 0), 0));
        return `Over the next 7 days in ${locationLabel}, around ${localizeNumerals(sum7, targetLang)} mm of rainfall is projected. Check the 7-day strip for day-by-day chances.`;
      }
      return trans('replyRain');
    }

    if (q.includes('farm') || q.includes('sow') || q.includes('खेती') || q.includes('চাষ') || q.includes('விவசாயம்')) {
      return trans('replyFarm') || `Onset is tracking for ${onsetStr} with 78% confidence. Prep nursery beds now and wait for the second confirmed rain day before transplanting.`;
    }

    return trans('replyGeneric') || `Here are the latest conditions: ${locationLabel} is at ${weather ? localizeNumerals(Math.round(weather.current.temperature_2m), targetLang) : 'normal'}°C. Let me know if you need specific crop or weather insights.`;
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    let targetLang = currentLang;
    for (const s of SCRIPT_RANGES) {
      if (s.re.test(text)) {
        targetLang = s.lang;
        break;
      }
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date()
    };

    const reply = generateReply(text, targetLang);
    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: reply,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInputVal('');
    speakText(reply, targetLang);
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. You can type in the box.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognizer = new SpeechRecognition();
    recognizer.lang = voiceLang || 'en-IN';
    recognizer.interimResults = false;
    recognizer.maxAlternatives = 1;

    recognizer.onstart = () => setIsListening(true);
    recognizer.onend = () => setIsListening(false);
    recognizer.onerror = () => setIsListening(false);
    recognizer.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        handleSend(transcript);
      }
    };

    recognitionRef.current = recognizer;
    recognizer.start();
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-105 ${
          isListening
            ? 'bg-[#e5555a] animate-pulse ring-4 ring-[#e5555a]/40'
            : 'bg-gradient-to-r from-[#6c8dff] to-[#4f6fe0] shadow-[#6c8dff]/40'
        }`}
        title={t('chatWithMegh')}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 max-w-sm h-[520px] max-h-[80vh] bg-[#161a38] border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-white/[0.04] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6c8dff] to-[#5ee9c8] flex items-center justify-center text-[#0b0e1f] font-bold text-xs">
                M
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-none">Megh</h4>
                <span className="text-[10px] text-[#5ee9c8]">Hyperlocal AI Assistant</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSpeakerOn(!speakerOn)}
                className={`p-1.5 rounded-lg transition-colors ${
                  speakerOn ? 'text-[#5ee9c8] bg-[#5ee9c8]/15' : 'text-[#7d81a8] hover:bg-white/5'
                }`}
                title={speakerOn ? "Audio voice enabled" : "Audio voice muted"}
              >
                {speakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#7d81a8] hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-[#6c8dff]/20 text-[#6c8dff] flex items-center justify-center text-xs shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[80%] ${
                    m.sender === 'user'
                      ? 'bg-[#6c8dff] text-white rounded-br-none'
                      : 'bg-white/[0.06] text-[#f5f6fc] border border-white/10 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick chips */}
          <div className="px-3 pb-2 flex flex-wrap gap-1.5 border-t border-white/5 pt-2">
            {QUICK_INTENTS.map((q) => (
              <button
                key={q.intent}
                onClick={() => handleSend(t(q.labelKey))}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#b7bbdb] border border-white/10 transition-colors"
              >
                {t(q.labelKey)}
              </button>
            ))}
          </div>

          {/* Input row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
            className="p-3 bg-white/[0.02] border-t border-white/10 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2 rounded-xl border transition-all ${
                isListening
                  ? 'bg-[#e5555a] text-white border-[#e5555a] animate-bounce'
                  : 'bg-white/[0.06] hover:bg-white/[0.1] text-white/80 hover:text-white border-white/15'
              }`}
              title={t('micTitle')}
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={t('chatInputPh')}
              className="flex-1 bg-white/[0.06] text-white text-xs sm:text-sm px-3 py-2 rounded-xl border border-white/15 focus:border-[#6c8dff] outline-none placeholder-[#7d81a8]"
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2 bg-[#6c8dff] hover:bg-[#5a7bed] disabled:opacity-40 text-white rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
