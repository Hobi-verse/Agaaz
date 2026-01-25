import { useMemo } from "react";
import useIsMobile from "../hooks/useIsMobile";
import "./FireBackground.css";

const generateFireBubbles = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 20 + 8,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 4,
    hue: Math.random() * 40 + 10,
  }));

export default function FireBackground() {
  const isMobile = useIsMobile();

  const bubbleCount = isMobile ? 8 : 25;
  const emberCount = isMobile ? 5 : 15;

  const fireBubbles = useMemo(
    () => generateFireBubbles(bubbleCount),
    [bubbleCount],
  );

  const embers = useMemo(
    () =>
      Array.from({ length: emberCount }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: Math.random() * 4 + 6,
      })),
    [emberCount],
  );

  return (
    <>
      <div className="fireBubblesContainer" aria-hidden="true">
        {fireBubbles.map((b) => (
          <div
            key={b.id}
            className="fireBubble"
            style={{
              "--size": `${b.size}px`,
              "--left": `${b.left}%`,
              "--delay": `${b.delay}s`,
              "--duration": `${b.duration}s`,
              "--hue": b.hue,
            }}
          />
        ))}
      </div>

      <div className="embersContainer" aria-hidden="true">
        {embers.map((e, i) => (
          <div
            key={i}
            className="ember"
            style={{
              "--left": `${e.left}%`,
              "--delay": `${e.delay}s`,
              "--duration": `${e.duration}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
