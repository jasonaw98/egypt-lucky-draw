"use client";

import { useState, useEffect, useRef, useCallback } from "react";
// import Image from "next/image";
import confetti from "canvas-confetti";
import { name_list } from "@/lib/const";

const dummyNames = name_list;

export default function LuckyDraw() {
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [currentNames, setCurrentNames] = useState<string[]>([]);
  const [showWinner, setShowWinner] = useState(false);
  const [remainingNames, setRemainingNames] = useState<string[]>(dummyNames); // NEW
  const rollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const slowDownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoStopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState(100);
  const rollingSpeedRef = useRef(animationSpeed);
  const rollingIndexRef = useRef(0);

  const [showNumberImage, setShowNumberImage] = useState(false);

  const handleConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"];
    const frame = () => {
      if (Date.now() > end) return;
      confetti({
        particleCount: 4,
        angle: 40,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0.3, y: 0.6 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 140,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0.7, y: 0.6 },
        colors: colors,
      });
      requestAnimationFrame(frame);
    };
    frame();
  };

  // Use remainingNames for the spin
  const generateExtendedNames = useCallback(() => {
    const extended = [];
    for (let i = 0; i < 20; i++) {
      extended.push(...remainingNames);
    }
    return extended;
  }, [remainingNames]);

  useEffect(() => {
    setCurrentNames(generateExtendedNames());
  }, [generateExtendedNames]);

  useEffect(() => {
    const handleclose = (e: KeyboardEvent) => {
      if (e.code === "Enter" || e.code === "Escape") {
        setShowWinner(false);
      }
    };
    window.addEventListener("keydown", handleclose);
    return () => window.removeEventListener("keydown", handleclose);
  }, [showWinner]);

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
        // Pick winner from the center
        const finalWinner = currentNames[6] || remainingNames[0];
        setWinner(finalWinner);
        setIsRolling(false);
        setShowWinner(true);
        setShowNumberImage(true);
        handleConfetti();
        // Remove winner from remainingNames
        setRemainingNames((prev) =>
          prev.filter((name) => name !== finalWinner)
        );
        return;
      }
      currentIndex = (currentIndex + 1) % extendedNames.length;
      setCurrentNames((prev) => {
        const newNames = [...prev];
        newNames.unshift(extendedNames[currentIndex]);
        return newNames.slice(0, 50);
      });
      slowDownTimeoutRef.current = setTimeout(slowDownStep, speed);
    };
    slowDownStep();
  }, [isRolling, currentNames, generateExtendedNames, remainingNames]);

  const startRolling = useCallback(() => {
    if (isRolling || remainingNames.length === 0) return;
    setIsRolling(true);
    setWinner(null);
    setShowWinner(false);
    setAnimationSpeed(50);
    rollingSpeedRef.current = 50;
    rollingIndexRef.current = 0;
    setShowNumberImage(true);

    const extendedNames = generateExtendedNames();

    if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
    rollIntervalRef.current = setInterval(() => {
      rollingIndexRef.current =
        (rollingIndexRef.current + 1) % extendedNames.length;
      setCurrentNames((prev) => {
        const newNames = [...prev];
        newNames.unshift(extendedNames[rollingIndexRef.current]);
        return newNames.slice(0, 50);
      });
    }, rollingSpeedRef.current);

    if (autoStopTimeoutRef.current) clearTimeout(autoStopTimeoutRef.current);
    autoStopTimeoutRef.current = setTimeout(() => {
      stopRolling();
    }, 5000);
  }, [isRolling, generateExtendedNames, stopRolling, remainingNames.length]);

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
      if (rollIntervalRef.current) {
        clearInterval(rollIntervalRef.current);
      }
      if (slowDownTimeoutRef.current) {
        clearTimeout(slowDownTimeoutRef.current);
      }
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full h-full flex items-center bg-gray-900">
      {/* Video background */}
      {/* <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/grand.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      {/* Overlay content */}
      <div className="relative z-10 w-full h-full p-4 flex items-center">
        {/* <div className={`fixed left-1/2 top-18 -translate-x-1/2`}>
          <Image
            src="/prize.png"
            alt="Splash"
            width={400}
            height={500}
            className=""
          />
        </div> */}
        <div className="w-full h-full">
          <div
            className={` transition-all duration-1000 ease-in-out ${
              showWinner ? "opacity-100" : "opacity-100"
            }`}
          >
            <div className="fixed inset-0"></div>
            <div className="fixed left-1/2 top-5/12 -translate-x-1/2 z-50 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-16 border-0 border-white p-8">
                {/* <h2 className="text-5xl font-bold text-white">WINNER</h2> */}
               {showNumberImage && <p
                  className={`text-7xl font-bold text-yellow-300 drop-shadow-3xl text-center ${
                    winner ? "animate-bounce mt-4" : ""
                  }`}
                  onClick={() => {
                    handleConfetti();
                  }}
                >
                  {winner ||
                    currentNames[6] ||
                    (remainingNames.length === 0
                      ? "No more names"
                      : "Ready to Start")}
                </p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
