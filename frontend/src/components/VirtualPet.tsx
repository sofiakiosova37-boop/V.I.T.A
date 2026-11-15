import { useEffect, useState } from "react";

export function VirtualPet() {
  const [position, setPosition] = useState({
    x: 100,
    y: window.innerHeight - 70,
  });
  const [isWalking, setIsWalking] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);

  useEffect(() => {
    let petX = 100;
    let targetX = 150;
    let lastTime = Date.now();

    const moveInterval = setInterval(() => {
      targetX = Math.random() * (window.innerWidth - 100);
    }, 4000);

    const onAnimationFrame = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      const diff = targetX - petX;

      if (Math.abs(diff) > 2) {
        setIsWalking(true);
        if (diff > 0) {
          petX += 150 * delta;
          setFacingLeft(false);
        } else {
          petX -= 150 * delta;
          setFacingLeft(true);
        }
      } else {
        setIsWalking(false);
      }

      setPosition({ x: petX, y: window.innerHeight - 70 });
      requestAnimationFrame(onAnimationFrame);
    };

    const animId = requestAnimationFrame(onAnimationFrame);

    return () => {
      clearInterval(moveInterval);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 999999,
        pointerEvents: "none",
        transform: `scaleX(${facingLeft ? -1 : 1})`,
        transition: "transform 0.2s ease",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          backgroundColor: "#fcfbf7",
          borderRadius: "16px",
          border: "2px solid #86a694",
          boxShadow: "0 4px 12px rgba(63, 102, 86, 0.16)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "26px",
          animation: isWalking
            ? "walkAnim 0.3s infinite alternate"
            : "idleAnim 2s infinite ease-in-out",
        }}
      >
        🐰
      </div>

      <style>{`
        @keyframes walkAnim {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-6px) rotate(-3deg); }
        }
        @keyframes idleAnim {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}
