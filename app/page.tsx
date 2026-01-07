"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  Star,
  Gift,
  Sparkles,
  Send,
  Loader2,
  Quote,
  Terminal,
} from "lucide-react";

// --- 1. 3D CAKE IMPORT ---
const BirthdayCake3D = dynamic(() => import("@/components/Cake3D"), {
  ssr: false,
});

// --- 2. EXTENDED CHATBOT DATA ---

const professionalWishes = [
  "Happy Birthday Sidra! 🎉 May your days be filled with smiles, success, and good vibes always.",
  "Wishing you a very Happy Birthday! May this year bring exciting opportunities and beautiful memories.",
  "Happy Birthday Sidra! Stay positive, keep shining, and never stop believing in yourself ✨",
  "To an amazing person, Happy Birthday! May all your dreams slowly turn into reality 💫",
];

const funnyWishes = [
  "Happy Birthday Sidra! 🎂 Calories don’t count today, so enjoy the cake 😄",
  "Another year older, another year cooler 😎 Happy Birthday!",
  "Happy Birthday! Don’t worry about age… you’re still younger than Google 😂",
  "Birthday rule: Eat cake first, think later 🍰",
];

const poeticWishes = [
  "Another year, another glow,\nSmiles and laughter, let them flow.\nHappy Birthday Sidra dear,\nMay joy follow you all year ✨",
  "Like stars that shine up in the sky,\nYour kindness always passes by.\nHappy Birthday, bright and true,\nWishing the best in all you do 🌸",
];

const islamicWishes = [
  "Happy Birthday Sidra 🌙 May Allah bless you with peace, health, and endless happiness. Ameen.",
  "Wishing you a blessed birthday. May Allah grant you success and protect you always.",
  "Happy Birthday! May Allah fill your life with barakah and ease in every step.",
];

const leadershipQuotes = [
  "Your positive energy and kindness make every place better.",
  "A good heart and a bright smile can change everything — and you have both ✨",
];
// --- SMART AI LOGIC ---
const getBotResponse = (input: string) => {
  const text = input.toLowerCase();

  // 1. Specific Categories
  if (
    text.includes("funny") ||
    text.includes("joke") ||
    text.includes("dev") ||
    text.includes("code")
  ) {
    return (
      "Here's a fun one: \n\n" +
      '"' +
      funnyWishes[Math.floor(Math.random() * funnyWishes.length)] +
      '"'
    );
  }
  if (
    text.includes("poem") ||
    text.includes("poetic") ||
    text.includes("rhyme")
  ) {
    return (
      "Here is a poetic wish: \n\n" +
      poeticWishes[Math.floor(Math.random() * poeticWishes.length)]
    );
  }
  if (
    text.includes("islamic") ||
    text.includes("dua") ||
    text.includes("blessing") ||
    text.includes("allah")
  ) {
    return (
      "A special prayer for you: \n\n" +
      '"' +
      islamicWishes[Math.floor(Math.random() * islamicWishes.length)] +
      '"'
    );
  }
  if (
    text.includes("quote") ||
    text.includes("leader") ||
    text.includes("describe")
  ) {
    return (
      "This describes you perfectly: \n\n" +
      '"' +
      leadershipQuotes[Math.floor(Math.random() * leadershipQuotes.length)] +
      '"'
    );
  }

  // 2. General Wish Requests
  if (
    text.includes("write") ||
    text.includes("wish") ||
    text.includes("suggest")
  ) {
    return (
      "Here is a professional wish: \n\n" +
      '"' +
      professionalWishes[
        Math.floor(Math.random() * professionalWishes.length)
      ] +
      '"'
    );
  }

  // 3. Conversational Triggers
  if (text.includes("happy birthday") || text.includes("hbd")) {
    return "That's a beautiful wish! ❤️ I have saved it in the digital memory book for Sidra.";
  }
  if (text.includes("party"))
    return "Virtual party is ON! 🎉 Click anywhere on the screen for fireworks!";
  if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
    return "Hello! I am the Birthday Assistant. You can ask me to:\n\n1. Write a funny wish\n2. Write a poem\n3. Give a dua\n4. Write a professional wish";
  }
  if (text.includes("thank"))
    return "You're welcome! Let's make this day special. ✨";

  // Default Fallback
  return "I didn't quite get that, but I can generate a wish for you! Just type 'Write a wish' or 'Funny wish'.";
};

// --- 3. FLOATING BACKGROUND ---
const FloatingBackground = ({ isDark }: { isDark: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [icons, setIcons] = useState<
    { id: number; top: number; left: number; size: number; type: number }[]
  >([]);

  useEffect(() => {
    const newIcons = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      type: i % 3,
    }));
    setIcons(newIcons);
  }, []);

  useGSAP(
    () => {
      if (icons.length === 0) return;
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
    { scope: containerRef, dependencies: [icons] }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {icons.map((icon) => (
        <div
          key={icon.id}
          className={`floating-icon absolute ${
            isDark ? "text-white/10" : "text-purple-500/10"
          }`}
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
    </div>
  );
};

export default function BirthdayPremium() {
  const [stage, setStage] = useState("timer");
  const [count, setCount] = useState(5);

  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    [
      {
        text: "Hello! I am loaded with wishes. Type 'Funny wish', 'Poem', or 'Dua' to see magic! 🎩",
        isUser: false,
      },
    ]
  );
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isGiftOpened, setIsGiftOpened] = useState(false);

  // --- TIMER LOGIC ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stage === "timer") {
      if (count > 0) {
        timer = setTimeout(() => setCount((prev) => prev - 1), 1000);
      } else {
        timer = setTimeout(() => setStage("wish"), 500);
      }
    }
    return () => clearTimeout(timer);
  }, [count, stage]);

  // Scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, stage]);

  // --- FIREWORKS ---
  const handleGlobalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    confetti({
      origin: { x, y },
      particleCount: 30,
      spread: 60,
      startVelocity: 20,
      colors: ["#FFD700", "#FF007F", "#00E5FF"],
      zIndex: 9999,
      disableForReducedMotion: true,
    });
  };

  // --- CHAT HANDLER ---
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setMessages((prev) => [...prev, { text: inputValue, isUser: true }]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: getBotResponse(currentInput), isUser: false },
      ]);
      setIsTyping(false);
    }, 1200);
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

  const isDarkTheme = stage === "timer";

  return (
    <div
      onClick={handleGlobalClick}
      className={`min-h-screen font-sans overflow-hidden relative cursor-crosshair transition-colors duration-1000 ${
        isDarkTheme
          ? "bg-slate-950 text-white selection:bg-purple-500"
          : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-slate-900 selection:bg-pink-200"
      }`}
    >
      <FloatingBackground isDark={isDarkTheme} />

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
              className="text-center space-y-6 bg-white/40 backdrop-blur-md p-10 rounded-3xl border border-white/50 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold tracking-wider uppercase mb-4 shadow-md"
              >
                Special Day
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 drop-shadow-sm">
                Happy Birthday <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Sidra
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-pink-600 font-medium italic text-lg mt-2"
              >
                ~ Wish by Saif Ur Rehman
              </motion.p>

              <p className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed mt-6 font-medium">
                &quot;Wishing you a year full of new opportunities, grand
                successes, and moments of pure joy.O Allah, wherever she is,
                keep her safe, grant her complete health and strength, calm her
                worries, and bless her with a life full of ease, peace, and joy.
                Ameen !!! My Olly🌼... &quot;
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setStage("cake");
                }}
                className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg flex items-center gap-3 mx-auto hover:bg-slate-800 transition shadow-lg"
              >
                Time for Cake <ArrowRight size={20} />
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
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
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
                  setStage("gift");
                }}
              />
            </div>
          </motion.div>
        )}

        {/* 4. VIRTUAL GIFT PAGE */}
        {stage === "gift" && (
          <motion.div
            key="gift"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-h-screen flex flex-col items-center justify-center p-8 z-10 relative max-w-5xl mx-auto"
          >
            {!isGiftOpened ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -5, 5, -5, 5, 0] }}
                transition={{
                  type: "spring",
                  rotate: { repeat: Infinity, duration: 2 },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsGiftOpened(true);
                  confetti({
                    particleCount: 200,
                    spread: 100,
                    startVelocity: 40,
                  });
                }}
                className="cursor-pointer flex flex-col items-center group"
              >
                <div className="w-48 h-48 bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl shadow-2xl flex items-center justify-center transform group-hover:scale-105 transition text-white border-4 border-white">
                  <Gift size={80} />
                </div>
                <p className="mt-6 text-2xl font-bold text-slate-700 animate-bounce">
                  Tap to Open Your Gift!
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-bold text-purple-700 mb-2">
                    Special Wishes For You
                  </h2>
                  <p className="text-slate-500">Some words of appreciation</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "Your smile and positivity make everything brighter ✨",
                    "May your life be full of happiness, success, and peace.",
                    "Stay amazing, stay kind, and keep chasing your dreams 🌸",
                    "Cheers to another year of laughter and memories 🥂",
                  ].map((quote, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.2 }}
                      className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 flex gap-4 items-start hover:shadow-xl transition"
                    >
                      <Quote
                        className="text-purple-300 shrink-0 rotate-180"
                        size={30}
                      />
                      <p className="text-slate-700 font-medium text-lg italic">
                        {quote}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setStage("chatbot");
                    }}
                    className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-purple-700 transition flex items-center gap-2 mx-auto"
                  >
                    One Last Surprise <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* 5. CHATBOT PAGE */}
        {stage === "chatbot" && (
          <motion.div
            key="chatbot"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="h-screen flex flex-col items-center justify-center p-4 z-10 relative"
          >
            <div
              className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Birthday AI</h3>
                  <p className="text-xs text-purple-100">
                    Online | Knowledge Base: v2.0
                  </p>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-hide bg-slate-50">
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
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white ${
                        msg.isUser ? "bg-purple-600" : "bg-pink-500"
                      }`}
                    >
                      {msg.isUser ? "ME" : "AI"}
                    </div>
                    <div
                      className={`p-3 rounded-2xl text-sm shadow-sm max-w-[80%] whitespace-pre-wrap ${
                        msg.isUser
                          ? "bg-purple-600 text-white rounded-tr-none"
                          : "bg-white text-slate-700 border border-slate-200 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center shrink-0 text-xs font-bold text-white">
                      AI
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-100 bg-white">
                {/* Suggestion Chips */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
                  {["Funny Wish", "Poem", "Dua", "Quote"].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setInputValue(chip)}
                      className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-purple-100 text-slate-600 text-xs rounded-full transition border border-slate-200"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask for a wish..."
                    className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-3 text-sm text-slate-800 outline-none focus:border-purple-500 transition"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white p-3 rounded-full transition active:scale-95"
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
              className="mt-6 text-slate-500 hover:text-purple-600 text-sm transition font-medium"
            >
              Replay Animation
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
