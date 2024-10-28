import { useState, useEffect, useRef } from 'react';
import './App.css';

const App: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(10); // 20 minutes in seconds
  const [isActive, setIsActive] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Reference to audio element

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null; // Type for the interval

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      if (interval) clearInterval(interval);
      audioRef.current?.play(); // Play sound alert
      alert('Time to relax your eyes!'); // Alert user
      setIsActive(false); // Stop timer
      setSeconds(1200); // Reset timer for another session
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleStop = () => {
    setIsActive(false);
    if (audioRef.current) {
      audioRef.current.pause(); // Pause the audio
      audioRef.current.currentTime = 0; // Reset audio playback position
    }
  };

  return (
    <div className="app">
      <h1>20-20-20 Rule Timer</h1>
      <div className="timer">{formatTime(seconds)}</div>
      <button onClick={() => setIsActive((prev) => !prev)}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={handleStop}>Stop</button> {/* Stop button */}
      {/* Reference the audio file from the public directory */}
      <audio ref={audioRef} src="/soun1.mp3" preload="auto" loop /> {/* Loop the audio */}
    </div>
  );
}

export default App;
