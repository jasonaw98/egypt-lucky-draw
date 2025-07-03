'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Play, Square, RotateCcw } from 'lucide-react';

const dummyNames = [
  'Ahmed Hassan',
  'Fatima Al-Zahra',
  'Omar Khaled',
  'Nour El-Din',
  'Layla Mansour',
  'Karim Farouk',
  'Yasmin Nabil',
  'Tariq Mahmoud',
  'Zara Ibrahim',
  'Amr Mostafa',
  'Dina Rashid',
  'Hany Salim',
  'Rania Fouad',
  'Saeed Youssef',
  'Mona Hegazy',
  'Tamer Abdel',
  'Hoda Kamel',
  'Walid Nazir',
  'Iman Sherif',
  'Faisal Rahman',
  'Mariam Gamal',
  'Bassem Nour',
  'Amina Zaki',
  'Hatem Magdy',
  'Nesrine Saad',
  'Adel Hosny',
  'Ghada Fares',
  'Sherif Wahid',
  'Dalia Osama',
  'Medhat Amer',
  'Noha Fahmy',
  'Eslam Tarek',
  'Doaa Mahmoud',
  'Khaled Nasser',
];

export default function LuckyDraw() {
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [currentNames, setCurrentNames] = useState<string[]>([]);
  const [showWinner, setShowWinner] = useState(false);
  const rollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const slowDownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoStopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState(100);
  const [scrollOffset, setScrollOffset] = useState(0);
  const rollingSpeedRef = useRef(animationSpeed);
  const rollingIndexRef = useRef(0);

  const generateExtendedNames = () => {
    const extended = [];
    for (let i = 0; i < 20; i++) {
      extended.push(...dummyNames);
    }
    return extended;
  };

  useEffect(() => {
    setCurrentNames(generateExtendedNames());
  }, []);

  const startRolling = () => {
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
        return newNames.slice(0, 200);
      });
      setScrollOffset((prev) => prev + 1);
    }, rollingSpeedRef.current);

    // Auto-stop after 5 seconds
    if (autoStopTimeoutRef.current) clearTimeout(autoStopTimeoutRef.current);
    autoStopTimeoutRef.current = setTimeout(() => {
      stopRolling();
    }, 5000);
  };

  const stopRolling = () => {
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

    // Gradually slow down using a recursive timeout
    let speed = rollingSpeedRef.current;
    const extendedNames = generateExtendedNames();
    let currentIndex = rollingIndexRef.current;

    const slowDownStep = () => {
      speed += 40;
      if (speed > 500) {
        // Final winner selection
        const finalWinner = dummyNames[Math.floor(Math.random() * dummyNames.length)];
        setWinner(finalWinner);
        setIsRolling(false);
        setShowWinner(true);
        return;
      }
      // Show next name
      currentIndex = (currentIndex + 1) % extendedNames.length;
      setCurrentNames((prev) => {
        const newNames = [...prev];
        newNames.unshift(extendedNames[currentIndex]);
        return newNames.slice(0, 200);
      });
      setScrollOffset((prev) => prev + 1);
      slowDownTimeoutRef.current = setTimeout(slowDownStep, speed);
    };
    slowDownStep();
  };

  const reset = () => {
    if (rollIntervalRef.current) {
      clearInterval(rollIntervalRef.current);
    }
    if (slowDownTimeoutRef.current) {
      clearTimeout(slowDownTimeoutRef.current);
    }
    if (autoStopTimeoutRef.current) {
      clearTimeout(autoStopTimeoutRef.current);
      autoStopTimeoutRef.current = null;
    }

    setIsRolling(false);
    setWinner(null);
    setShowWinner(false);
    setCurrentNames(generateExtendedNames());
    setAnimationSpeed(100);
    setScrollOffset(0);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-800 to-amber-800 p-4">

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-600 mb-4 drop-shadow-lg">
            𓀀 LUCKY DRAW 𓀀
          </h1>
          <p className="text-xl md:text-2xl text-amber-200 font-semibold tracking-wide">
            ✨ Egyptian Fortune Wheel ✨
          </p>
        </div>

        {/* Main Slot Machine */}
        <div className="flex justify-center mb-8">
          <Card className="w-full max-w-2xl bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-amber-400 shadow-2xl">
            <CardContent className="p-0">
              {/* Decorative Egyptian border */}
              <div className="bg-gradient-to-r from-amber-600 to-yellow-600 p-4">
                <div className="flex justify-center items-center space-x-4">
                  <div className="text-3xl">𓂀</div>
                  <div className="text-2xl font-bold text-amber-100">CONTESTANTS</div>
                  <div className="text-3xl">𓂀</div>
                </div>
              </div>

              {/* Slot Machine Display */}
              <div className="relative bg-gradient-to-b from-blue-950 to-blue-900 p-6 overflow-hidden">
                {/* Highlight box for center name */}
                <div className="absolute inset-x-6 top-1/2 transform -translate-y-1/2 z-30">
                  <div className="bg-gradient-to-r from-amber-400 to-yellow-400 p-4 rounded-lg border-4 border-yellow-300 shadow-2xl animate-">
                    <div className="bg-gradient-to-r from-amber-600 to-yellow-600 p-2 rounded">
                      <div className="text-center text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                        {winner || currentNames[7] || 'Ready to Start'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rolling Names Display */}
                <div className="h-96 overflow-hidden relative">
                  {/* Top and bottom fade gradients */}
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-blue-950 to-transparent z-20 pointer-events-none"></div>
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-blue-950 to-transparent z-20 pointer-events-none"></div>

                  {/* Animated rolling container */}
                  <div
                    className={`space-y-2 transition-transform ${
                      isRolling ? 'duration-75' : 'duration-500'
                    } ease-linear`}
                    style={{
                      transform: `translateY(${
                        isRolling ? -(scrollOffset * 60) % (60 * 15) : 0
                      }px)`,
                    }}>
                    {currentNames.slice(0, 50).map((name, index) => (
                      <div
                        key={`${name}-${index}-${scrollOffset}`}
                        className={`text-center py-5 px-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                          index === 7
                            ? 'bg-transparent text-transparent' // Hidden in center (highlight box shows)
                            : index < 7 || index > 7
                            ? `bg-blue-800/50 text-amber-100 border border-blue-600/50 ${
                                isRolling ? '' : ''
                              }`
                            : 'bg-blue-700/50 text-amber-200'
                        } ${isRolling ? 'blur-[0.5px]' : ''}`}
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}>
                        <div
                          className={`${isRolling ? 'animate-bounce' : ''}`}
                          style={{ animationDelay: `${index * 100}ms` }}>
                          {name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom decorative border */}
              <div className="bg-gradient-to-r from-amber-600 to-yellow-600 p-2">
                <div className="flex justify-center space-x-6 text-2xl">
                  <span className={isRolling ? 'animate-spin' : ''}>𓊪</span>
                  <span className={isRolling ? 'animate-bounce' : ''}>𓀭</span>
                  <span className={isRolling ? 'animate-spin' : ''}>𓊪</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-6 mb-8">
          {!isRolling ? (
            <Button
              onClick={startRolling}
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white cursor-pointer font-bold py-4 px-8 rounded-xl shadow-lg text-xl border-2 border-emerald-400 transition-all duration-300 transform hover:scale-105">
              <Play className="mr-2 h-6 w-6" />
              Start Draw
            </Button>
          ) : (
            <Button
              onClick={stopRolling}
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold cursor-pointer py-4 px-8 rounded-xl shadow-lg text-xl border-2 border-red-400 transition-all duration-300 transform hover:scale-105">
              <Square className="mr-2 h-6 w-6" />
              Stop Draw
            </Button>
          )}
        </div>

        {/* Winner Announcement */}
        {showWinner && winner && (
          <div>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black opacity-30 z-40"></div>
            {/* Centered Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="text-center">
                <Card className="inline-block bg-gradient-to-r from-yellow-400 to-amber-400 border-4 border-yellow-300 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <Trophy className="h-12 w-12 text-amber-800 animate-bounce" />
                      <div className="text-3xl animate-pulse">𓀀</div>
                      <Trophy className="h-12 w-12 text-amber-800 animate-bounce" />
                    </div>
                    <h2 className="text-4xl font-bold text-amber-900 mb-2 animate-pulse">
                      🎉 WINNER! 🎉
                    </h2>
                    <p className="text-3xl font-bold text-amber-800 bg-white/20 p-3 rounded-lg animate-bounce">
                      {winner}
                    </p>
                    <div className="mt-4 text-2xl">
                      <span className="animate-spin inline-block">𓊪</span>
                      <span className="animate-bounce inline-block mx-2">𓀭</span>
                      <span className="animate-spin inline-block">𓊪</span>
                    </div>
                    <Button
                      onClick={() => setShowWinner(false)}
                      className="mt-6 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg text-xl transition-all duration-300 transform hover:scale-105">
                      Close
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center mt-8 text-amber-200">
          <p className="text-lg">
            Click "Start Draw" to begin the lucky draw, then "Stop Draw" to select a winner!
          </p>
        </div>
      </div>
    </div>
  );
}
