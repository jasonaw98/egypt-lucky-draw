"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";

// 1. Use image filenames instead of names
const numberImages = [
  "1-8.png",
  "2-8.png",
  "3-8.png",
  "4-8.png",
  "5-8.png",
  "6-8.png",
  "7-8.png",
  "8-8.png",
  "9-8.png",
  "10-8.png",
  "11-8.png",
  "12-8.png",
  "13-8.png",
  "14-8.png",
  "15-8.png",
  "16-8.png",
  "17-8.png",
  "18-8.png",
  "19-8.png",
  "20-8.png",
  "21-8.png",
  "22-8.png",
  "23-8.png",
  "24-8.png",
  "25-8.png",
];

export default function LuckyDraw() {
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [currentNumbers, setCurrentNumbers] = useState<string[]>([]);
  const [showWinner, setShowWinner] = useState(false);
  const rollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const slowDownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoStopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState(100);
  const rollingSpeedRef = useRef(animationSpeed);
  const rollingIndexRef = useRef(0);

  const handleConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"];
    const frame = () => {
      if (Date.now() > end) return;
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 80,
        startVelocity: 60,
        origin: { x: 0.2, y: 0.8 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0.8, y: 0.8 },
        colors,
      });
      requestAnimationFrame(frame);
    };
    frame();
  };

  // 2. Generate extended array of image filenames
  const generateExtendedNumbers = useCallback(() => {
    const extended: string[] = [];
    for (let i = 0; i < 20; i++) {
      extended.push(...numberImages);
    }
    return extended;
  }, []);

  useEffect(() => {
    const handleclose = (e: KeyboardEvent) => {
      if (e.code === "Enter" || e.code === "Escape") setShowWinner(false);
    };
    window.addEventListener("keydown", handleclose);
    return () => window.removeEventListener("keydown", handleclose);
  }, [showWinner]);

  useEffect(() => {
    setCurrentNumbers(generateExtendedNumbers());
  }, [generateExtendedNumbers]);

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
    const extendedNumbers = generateExtendedNumbers();
    let currentIndex = rollingIndexRef.current;

    const slowDownStep = () => {
      speed += 40;
      if (speed > 500) {
        // 3. Set winner to the image at index 6
        const finalWinner = currentNumbers[6] || numberImages[0];
        setWinner(finalWinner);
        setIsRolling(false);
        setShowWinner(true);
        handleConfetti();
        return;
      }
      currentIndex = (currentIndex + 1) % extendedNumbers.length;
      setCurrentNumbers((prev) => {
        const newNumbers = [...prev];
        newNumbers.unshift(extendedNumbers[currentIndex]);
        return newNumbers.slice(0, 50);
      });
      slowDownTimeoutRef.current = setTimeout(slowDownStep, speed);
    };
    slowDownStep();
  }, [isRolling, currentNumbers, generateExtendedNumbers]);

  const startRolling = useCallback(() => {
    if (isRolling) return;
    setIsRolling(true);
    setWinner(null);
    setShowWinner(false);
    setAnimationSpeed(50);
    rollingSpeedRef.current = 50;
    rollingIndexRef.current = 0;

    const extendedNumbers = generateExtendedNumbers();

    if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
    rollIntervalRef.current = setInterval(() => {
      rollingIndexRef.current =
        (rollingIndexRef.current + 1) % extendedNumbers.length;
      setCurrentNumbers((prev) => {
        const newNumbers = [...prev];
        newNumbers.unshift(extendedNumbers[rollingIndexRef.current]);
        return newNumbers.slice(0, 50);
      });
    }, rollingSpeedRef.current);

    if (autoStopTimeoutRef.current) clearTimeout(autoStopTimeoutRef.current);
    autoStopTimeoutRef.current = setTimeout(() => {
      stopRolling();
    }, 5000);
  }, [isRolling, generateExtendedNumbers, stopRolling]);

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

  // 4. Render the spinning images and winner image
  return (
    <div className="min-h-screen bg-[url(/bg.jpg)] bg-no-repeat bg-cover bg-center p-4 flex w-full h-full items-center">
      <div className="fixed left-1/2 top-18 -translate-x-1/2">
        <p className="text-[13rem] font-bold text-yellow-300 mt-8">
          Table Draw
        </p>
      </div>
      <div className="w-full h-full">
        <div
          className={`transition-all duration-1000 ease-in-out ${
            showWinner ? "opacity-100" : "opacity-100"
          }`}
        >
          <div className="fixed inset-0"></div>
          <div className="fixed left-1/2 top-4/8 -translate-x-1/2 z-50 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-16 border-0 border-white p-8">
              {/* Winner image with blinking animation */}
              {winner && (
                <div className="overflow-x-hidden w-[300px] h-[400px] pt-28">
                  <Image
                    src={`/numbers/${winner}`}
                    alt="Winner"
                    width={600}
                    height={600}
                    className="animate-bounce drop-shadow-3xl -ml-[95px] scale-180"
                    priority
                  />
                </div>
              )}
              {!winner && (
                <div className="overflow-hidden w-[300px] h-[400px] pt-8">
                  <Image
                    src={`/numbers/${currentNumbers[6] || numberImages[0]}`}
                    alt="Spinning Number"
                    width={500}
                    height={500}
                    className="drop-shadow-3xl -ml-[90px] scale-180"
                    priority
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
