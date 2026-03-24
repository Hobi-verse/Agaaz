import useIsMobile from "../hooks/useIsMobile";
import "./FireBackground.css";

function getSeededValue(seed) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

const generateFireBubbles = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    size: getSeededValue((i + 1) * 1.11) * 20 + 8,
    left: getSeededValue((i + 1) * 2.21) * 100,
    delay: getSeededValue((i + 1) * 3.31) * 5,
    duration: getSeededValue((i + 1) * 4.41) * 3 + 4,
    hue: getSeededValue((i + 1) * 5.51) * 40 + 10,
  }));

const generateEmbers = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    left: getSeededValue((i + 1) * 6.61) * 100,
    delay: getSeededValue((i + 1) * 7.71) * 8,
    duration: getSeededValue((i + 1) * 8.81) * 4 + 6,
  }));

export default function FireBackground() {
  const isMobile = useIsMobile();

  const bubbleCount = isMobile ? 8 : 25;
  const emberCount = isMobile ? 5 : 15;
  const fireBubbles = generateFireBubbles(bubbleCount);
  const embers = generateEmbers(emberCount);

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
        {embers.map((ember) => (
          <div
            key={ember.id}
            className="ember"
            style={{
              "--left": `${ember.left}%`,
              "--delay": `${ember.delay}s`,
              "--duration": `${ember.duration}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
