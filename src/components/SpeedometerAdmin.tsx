import React from "react";

const Speedometer = ({ value }: any) => {
  const radius = 90; // Радіус зовнішнього кола
  const circumference = 2 * Math.PI * radius; // Довжина кола
  const percentage = Math.min(value, 100) / 100; // Переконатися, що значення не більше 100%
  const angle = -90 + percentage * 180; // Розрахунок кута стрілки (-90° це "0")

  // Функція для розрахунку кольору
  const calculateColor = (percent: number) => {
    const r = Math.min(255, 510 - percent * 510); // Червоний зменшується
    const g = Math.min(255, percent * 510); // Зелений збільшується
    return `rgb(${Math.round(r)}, ${Math.round(g)}, 0)`;
  };

  return (
    <svg width="200" height="120" viewBox="0 0 200 120">
      {/* Фонова шкала */}
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke=""
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={circumference / 2} // Початок лінії на "0"
      />

      {/* Кольорова шкала */}
      {[...Array(101)].map((_, i) => {
        const percent = i / 100; // Поточний відсоток
        const rotation = -90 + percent * 180; // Кут для відсотка
        const color = calculateColor(percent);

        return (
          <line
            key={i}
            x1="100"
            y1="10"
            x2="100"
            y2="20"
            stroke={color}
            strokeWidth="3"
            transform={`rotate(${rotation} 100 100)`}
          />
        );
      })}

      {/* Стрілка */}
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="20"
        stroke="black"
        strokeWidth="3"
        transform={`rotate(${angle} 100 100)`}
      />

      {/* Центральна точка */}
      <circle cx="100" cy="100" r="5" fill="black" />

      {/* Текст */}
      <text x="100" y="115" textAnchor="middle" fontSize="16" fill="black">
        {`${Math.round(percentage * 100)}%`}
      </text>
    </svg>
  );
};

export default Speedometer;
