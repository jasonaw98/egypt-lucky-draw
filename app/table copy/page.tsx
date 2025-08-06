"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

const dummyNames = [
  "Fatima Al-Zahra",
  "Omar Khaled",
  "Nour El-Din",
  "Layla Mansour",
  "Karim Farouk",
  "Yasmin Nabil",
  "Tariq Mahmoud",
  "Zara Ibrahim",
  "Amr Mostafa",
  "Dina Rashid",
  "Hany Salim",
  "Rania Fouad",
  "Saeed Youssef",
  "Mona Hegazy",
  "Tamer Abdel",
  "Hoda Kamel",
  "Hatem Magdy",
  "Nesrine Saad",
  "Adel Hosny",
  "Ghada Fares",
  "Sherif Wahid",
  "Dalia Osama",
  "Medhat Amer",
  "Noha Fahmy",
  "Eslam Tarek",
  "Doaa Mahmoud",
  "Khaled Nasser",
];

export default function LuckyDraw() {
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [currentNames, setCurrentNames] = useState<string[]>([]);
  const [showWinner, setShowWinner] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(100);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [splashMoved, setSplashMoved] = useState(false);
  const rollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const slowDownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoStopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rollingSpeedRef = useRef(animationSpeed);
  const rollingIndexRef = useRef(0);

  const generateExtendedNames = useCallback(() => {
    const extended = [];
    for (let i = 0; i < 20; i++) {
      extended.push(...dummyNames);
    }
    return extended;
  }, []);

  useEffect(() => {
    setCurrentNames(generateExtendedNames());
  }, [generateExtendedNames]);

  useEffect(() => {
    if (!showSplash) return;
    const handleEnter = (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        setSplashMoved(true);
        setTimeout(() => setShowSplash(false), 100);
      }
    };
    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [showSplash]);

  useEffect(() => {
    const handleClose = (e: KeyboardEvent) => {
      if (showWinner && (e.code === "Enter" || e.code === "Escape")) {
        setShowWinner(false);
      }
    };
    window.addEventListener("keydown", handleClose);
    return () => window.removeEventListener("keydown", handleClose);
  }, [showWinner]);

  const startRolling = useCallback(() => {
    if (isRolling) return;
    setIsRolling(true);
    setWinner(null);
    setShowWinner(false);
    setAnimationSpeed(50);
    setScrollOffset(0);
    rollingSpeedRef.current = 50;
    rollingIndexRef.current = 0;

    const extendedNames = generateExtendedNames();

    if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
    rollIntervalRef.current = setInterval(() => {
      rollingIndexRef.current = (rollingIndexRef.current + 1) % extendedNames.length;
      setCurrentNames((prev) => {
        const newNames = [...prev];
        newNames.unshift(extendedNames[rollingIndexRef.current]);
        return newNames.slice(0, 50); // Reduced to 50 for performance
      });
      setScrollOffset((prev) => prev + 1);
    }, rollingSpeedRef.current);

    if (autoStopTimeoutRef.current) clearTimeout(autoStopTimeoutRef.current);
    autoStopTimeoutRef.current = setTimeout(() => {
      stopRolling();
    }, 5000);
  }, [isRolling, generateExtendedNames]);

  const stopRolling = useCallback(() => {
    if (!isRolling) return;
    if (autoStopTimeoutRef.current) {
      clearTimeout(autoStopTimeoutRef.current);
      autoStopTimeoutRef.current = null;
    }
    if (rollIntervalRef.current) {
      clearInterval(rollIntervalRef.current);
      rollIntervalRef.current = null;
    }
    if (slowDownTimeoutRef.current) {
      clearTimeout(slowDownTimeoutRef.current);
      slowDownTimeoutRef.current = null;
    }

    let speed = rollingSpeedRef.current;
    const extendedNames = generateExtendedNames();
    let currentIndex = rollingIndexRef.current;

    const slowDownStep = () => {
      speed += 40;
      if (speed > 500) {
        // Set winner to the name at index 6 (center of the display)
        const finalWinner = currentNames[6] || dummyNames[0];
        setWinner(finalWinner);
        setIsRolling(false);
        setShowWinner(true);
        return;
      }
      currentIndex = (currentIndex + 1) % extendedNames.length;
      setCurrentNames((prev) => {
        const newNames = [...prev];
        newNames.unshift(extendedNames[currentIndex]);
        return newNames.slice(0, 50);
      });
      setScrollOffset((prev) => prev + 1);
      slowDownTimeoutRef.current = setTimeout(slowDownStep, speed);
    };
    slowDownStep();
  }, [isRolling, currentNames, generateExtendedNames]);

  const handleSpaceBar = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (isRolling) {
          stopRolling();
        } else {
          startRolling();
        }
      }
    },
    [isRolling, startRolling, stopRolling]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleSpaceBar);
    return () => window.removeEventListener("keydown", handleSpaceBar);
  }, [handleSpaceBar]);

  useEffect(() => {
    return () => {
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
      if (slowDownTimeoutRef.current) clearTimeout(slowDownTimeoutRef.current);
      if (autoStopTimeoutRef.current) clearTimeout(autoStopTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[url(/table-bg.jpeg)] bg-no-repeat bg-cover bg-center p-4 flex w-full h-full items-center">

      <div className="w-full h-full">
        <div className="relative z-10">
          <div className="flex pl-12">
            <div className="w-full max-w-2xl">
              <div className="p-0">
                <div className="relative bg-gradient-to-b from-blue-950 to-blue-900 p-6 overflow-hidden rounded-2xl">
                  <div className="absolute inset-x-6 top-1/2 transform -translate-y-1/2 z-30">
                    <div className="bg-gradient-to-r from-amber-400 to-yellow-400 p-4 rounded-lg border-4 border-yellow开始了300 shadow-2xl">
                      <div className="bg-gradient-to-r from-amber-600 to-yellow-600 p-2 rounded">
                        <div className="text-center text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                          {winner || currentNames[6] || "Ready to Start"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-96 overflow-hidden relative">
                    <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-blue-950 to-transparent z-20 pointer-events-none"></div>
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-blue-950 to-transparent z-20 pointer-events-none"></div>

                    <div
                      className={`space-y-2 transition-transform ${
                        isRolling ? "duration-75" : "duration-500"
                      } ease-linear`}
                      style={{
                        transform: `translateY(${
                          isRolling ? -(scrollOffset * 60) % (60 * 15) : 0
                        }px)`,
                      }}
                    >
                      {currentNames.slice(0, 15).map((name, index) => (
                        <div
                          key={`${name}-${index}-${scrollOffset}`}
                          className={`text-center py-5 px-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                            index === 6
                              ? "bg-transparent text-transparent"
                              : index < 6 || index > 6
                              ? `bg-blue-800/50 text-amber-100 border border-blue-600/50`
                              : "bg-blue-700/50 text-amber-200"
                          } ${isRolling ? "blur-[0.5px]" : ""}`}
                        >
                          <div className={`${isRolling ? "animate-bounce" : ""}`}>
                            {name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {true && true && (
            <div>
              <div className="fixed inset-0 bg bg-opacity-80"></div>
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-12 border-0 border-white p-8">
                  <h2 className="text-5xl font-bold text-amber-300">WINNER!</h2>
                  <p className="text-7xl font-bold text-white rounded-lg">
                    {winner}
                  </p>
                  <Button
                    onClick={() => setShowWinner(false)}
                    className="mt-6 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg text-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}