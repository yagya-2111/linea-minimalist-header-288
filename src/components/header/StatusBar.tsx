import { useEffect, useState } from "react";

const StatusBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const usps = [
    "Sanjivani product catalogue preview",
    "Plant-powered daily nutrition",
    "Online ordering is not enabled yet"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % usps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [usps.length]);

  return (
    <div className="bg-status-bar text-status-bar-foreground py-2">
      <div className="container mx-auto px-4 text-center">
        <p
          key={currentIndex}
          className="animate-fade-in text-xs font-bold transition-all duration-700 ease-in-out"
        >
          {usps[currentIndex]}
        </p>
      </div>
    </div>
  );
};

export default StatusBar;