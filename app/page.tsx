"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import confetti from "canvas-confetti";
import {
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  ArrowRight,
  Star,
  Gift,
  Sparkles,
  Send,
  Loader2,
} from "lucide-react";

// --- 1. 3D CAKE IMPORT ---
const BirthdayCake3D = dynamic(() => import("@/components/Cake3D"), {
  ssr: false,
});

// --- 2. SMART AI LOGIC ---
const getBotResponse = (input: string) => {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes("write") || lowerInput.includes("wish")) {
    return 'Here is a wish: "Happy Birthday Sir Adnan! Your leadership lights our path. Wishing you a year of success! 🚀"';
  }
  if (lowerInput.includes("happy birthday") || lowerInput.includes("hbd")) {
    return "That's a beautiful wish! ❤️ I have saved it in the digital memory book.";
  }
  if (lowerInput.includes("party"))
    return "Virtual party is ON! 🎉 Click anywhere for fireworks!";
  if (lowerInput.includes("hello"))
    return "Hello! Type 'Write a wish' for a suggestion. ✍️";

  return "I am an AI trained to celebrate! Ask me to 'Write a wish' or type your own.";
};

// --- 3. FLOATING BACKGROUND (FIXED: No Math.random in render) ---
const FloatingBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Fixed: Define type for icon data
  interface IconData {
    id: number;
    top: number;
    left: number;
    size: number;
    type: number;
  }

  // Generate random icon positions once during initial state setup to avoid calling setState inside an effect
  const [icons] = useState<IconData[]>(() =>
    Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      type: i % 3,
    }))
  );

  useGSAP(
    () => {
      // Fixed: Explicit type instead of 'any'
      const elements = gsap.utils.toArray(".floating-icon");
      elements.forEach((el: unknown) => {
        gsap.to(el as HTMLElement, {
          y: "random(-100, 100)",
          x: "random(-50, 50)",
          rotation: "random(-180, 180)",
          duration: "random(3, 6)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: containerRef, dependencies: [icons] } // Re-run if icons change
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="floating-icon absolute text-white/10"
          style={{
            top: `${icon.top}%`,
            left: `${icon.left}%`,
            fontSize: `${icon.size}rem`,
          }}
        >
          {icon.type === 0 ? (
            <Star />
          ) : icon.type === 1 ? (
            <Gift />
          ) : (
            <Sparkles />
          )}
        </div>
      ))}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
    </div>
  );
};

export default function BirthdayPremium() {
  const [stage, setStage] = useState("timer");
  const [count, setCount] = useState(5);
  const [isMuted, setIsMuted] = useState(false);

  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    [
      {
        text: "Hello! Type 'Write a wish' or click anywhere for fireworks! 🎆",
        isUser: false,
      },
    ]
  );
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Fixed: Function Hoisting - Defined BEFORE useEffect
  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => console.log("Autoplay blocked"));
    }
  };

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (stage === "timer") {
      if (count > 0) {
        const timer = setTimeout(() => setCount(count - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        // Defer state update to avoid synchronous setState inside the effect
        const transitionTimer = setTimeout(() => {
          setStage("wish");
          playMusic();
        }, 0);
        return () => clearTimeout(transitionTimer);
      }
    }
    // Added playMusic to dependencies to satisfy linter (though harmless here)
  }, [count, stage]);

  // Auto-scroll Chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, stage]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) audioRef.current.play();
      else audioRef.current.pause();
      setIsMuted(!isMuted);
    }
  };

  // --- FIREWORKS ON CLICK ---
  const handleGlobalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    confetti({
      origin: { x, y },
      particleCount: 40,
      spread: 60,
      startVelocity: 25,
      scalar: 0.7,
      gravity: 1.2,
      colors: ["#FFD700", "#FF007F", "#00E5FF", "#FFFFFF"],
      zIndex: 9999,
      disableForReducedMotion: true,
    });
  };

  // --- CHAT HANDLER ---
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const userMsg = { text: inputValue, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const botReply = getBotResponse(currentInput);
      setMessages((prev) => [...prev, { text: botReply, isUser: false }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const containerVariants = {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.8 } },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
      transition: { duration: 0.5 },
    },
  };

  return (
    <div
      onClick={handleGlobalClick}
      className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden relative selection:bg-purple-500 selection:text-white cursor-crosshair"
    >
      <FloatingBackground />
      <audio ref={audioRef} src="/hbd.mp3" loop />

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleAudio();
        }}
        className="fixed top-6 right-6 z-50 bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-full hover:bg-white/20 transition-all duration-300"
      >
        {isMuted ? (
          <VolumeX className="text-gray-400" />
        ) : (
          <Volume2 className="text-green-400" />
        )}
      </button>

      <AnimatePresence mode="wait">
        {/* 1. TIMER PAGE */}
        {stage === "timer" && (
          <motion.div
            key="timer"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-screen flex flex-col items-center justify-center relative z-10"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 animate-pulse"></div>
              <h1 className="text-[10rem] font-black bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent leading-none relative z-10">
                {count}
              </h1>
            </div>
            <p className="text-gray-400 tracking-widest uppercase text-sm mt-4">
              Surprise Loading...
            </p>
          </motion.div>
        )}

        {/* 2. WISH PAGE */}
        {stage === "wish" && (
          <motion.div
            key="wish"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-screen flex flex-col items-center justify-center p-6 z-10 relative"
          >
            <div
              ref={textRef}
              className="text-center space-y-6 backdrop-blur-sm p-10 rounded-3xl bg-white/5 border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-bold tracking-wider uppercase mb-4"
              >
                Special Day
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                Happy Birthday <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">
                  Sir Adnan
                </span>
              </h1>

              {/* ADDED NAME HERE */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-pink-300 font-medium italic text-lg mt-2"
              >
                ~ Wish by Maryam Amjad
              </motion.p>

              {/* Fixed: Escaped Quotes */}
              <p className="text-lg text-gray-300 max-w-lg mx-auto leading-relaxed mt-6">
                &quot;Wishing you a year full of new opportunities, grand
                successes, and moments of pure joy. You are an inspiration to us
                all!&quot;
              </p>

              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setStage("cake");
                }}
                className="mt-8 px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg flex items-center gap-3 mx-auto hover:bg-gray-100 transition"
              >
                Proceed to Celebration <ArrowRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* 3. CAKE PAGE */}
        {stage === "cake" && (
          <motion.div
            key="cake"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-screen flex flex-col items-center justify-center relative z-10"
          >
            <h2 className="text-3xl font-light text-white/80 mb-4">
              Tap the cake to cut 🔪
            </h2>
            <div
              className="w-full h-[60vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <BirthdayCake3D
                onCutCompleted={() => {
                  confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                  });
                  setStage("gallery");
                }}
              />
            </div>
          </motion.div>
        )}

        {/* 4. GALLERY PAGE */}
        {stage === "gallery" && (
          <motion.div
            key="gallery"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-h-screen p-8 pt-24 relative z-10 max-w-6xl mx-auto"
          >
            <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-4xl font-bold text-white">
                  Memorable Moments
                </h2>
                <p className="text-gray-400 mt-2">A glimpse into the journey</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setStage("memories");
                }}
                className="text-purple-400 hover:text-purple-300 flex items-center gap-2 transition"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-sm"
                >
                  {/* Suppressed img warning for external URL placeholder */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://placehold.co/600x400/1e1e2e/FFF?text=Photo+${item}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    alt="memory"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 5. MEMORIES PAGE */}
        {stage === "memories" && (
          <motion.div
            key="memories"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-h-screen flex flex-col items-center justify-center p-8 z-10 relative max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-400">
              Why You Are Special
            </h2>
            <div className="space-y-6 w-full">
              {[
                { title: "Leadership", desc: "Guiding us with patience." },
                { title: "Vision", desc: "Always seeing the bigger picture." },
                {
                  title: "Kindness",
                  desc: "Supporting everyone in difficult times.",
                },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ x: i % 2 === 0 ? -50 : 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex items-center gap-6 bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition backdrop-blur-md"
                >
                  <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                    <Heart
                      size={20}
                      className="text-white"
                      fill="currentColor"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{m.title}</h3>
                    <p className="text-gray-400">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={(e) => {
                e.stopPropagation();
                setStage("chatbot");
              }}
              className="mt-16 bg-white text-slate-900 px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
            >
              <MessageCircle size={20} /> Send a Personal Wish
            </motion.button>
          </motion.div>
        )}

        {/* 6. CHATBOT PAGE */}
        {stage === "chatbot" && (
          <motion.div
            key="chatbot"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="h-screen flex flex-col items-center justify-center p-4 z-10 relative"
          >
            <div
              className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles size={20} className="text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-bold text-white">
                    Birthday AI Assistant
                  </h3>
                  <p className="text-xs text-purple-200">
                    Online | Ready to wish
                  </p>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-hide">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${
                      msg.isUser ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        msg.isUser ? "bg-purple-500" : "bg-indigo-600"
                      }`}
                    >
                      {msg.isUser ? "ME" : "AI"}
                    </div>
                    <div
                      className={`p-3 rounded-2xl text-sm shadow-md max-w-[80%] ${
                        msg.isUser
                          ? "bg-purple-600 text-white rounded-tr-none"
                          : "bg-white/10 text-gray-100 border border-white/5 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 text-xs font-bold">
                      AI
                    </div>
                    <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 border-t border-white/10 bg-slate-900/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type 'Write a wish'..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-white outline-none focus:border-purple-500 transition"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white p-3 rounded-full transition transform active:scale-95"
                  >
                    {isTyping ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setStage("timer");
              }}
              className="mt-6 text-gray-500 hover:text-white text-sm transition"
            >
              Replay Animation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
