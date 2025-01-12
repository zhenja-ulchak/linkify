"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Box, Typography } from "@mui/material";

const DashboardPage = () => {
  const t = useTranslations("Dashboard");

  const [positions, setPositions] = useState(
    //@ts-ignore
    Array(8).fill().map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
    }))
  );

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Обробник руху миші
  const handleMouseMove = (e: { clientX: any; clientY: any; }) => {
    setCursorPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prevPositions) =>
        prevPositions.map((pos, index) => {
          let newX = pos.x + pos.dx;
          let newY = pos.y + pos.dy;

          // Перевіряємо, щоб іконки не виходили за межі екрану
          if (newX < 0 || newX > 100) pos.dx = -pos.dx;
          if (newY < 0 || newY > 100) pos.dy = -pos.dy;

          newX = Math.min(Math.max(newX, 0), 100);
          newY = Math.min(Math.max(newY, 0), 100);

          return { ...pos, x: newX, y: newY };
        })
      );
    }, 50); // Оновлення позицій кожні 50 мс

    return () => clearInterval(interval); // Очищуємо інтервал при розмонтуванні
  }, []);

  // Обчислюємо відстань до курсора і налаштовуємо ефект віддалення
  const calculateDistanceEffect = (iconX: number, iconY: number) => {
    const distanceX = cursorPosition.x - window.innerWidth / 2;
    const distanceY = cursorPosition.y - window.innerHeight / 2;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    const maxDistance = Math.min(window.innerWidth, window.innerHeight);
    const scaleFactor = 1 + (distance / maxDistance) * 2; // Збільшуємо швидкість руху на основі відстані

    return scaleFactor;
  };
  return (


    <div id="ContainerDashboard" style={{
      textAlign: 'center', top: '-55px',
      position: 'relative'
    }}>
      {/* {t("dashboard")}   {t("welcome-message")} */}


      <Box
        sx={{
          height: '100vh',
          background: 'linear-gradient(45deg,rgba(54, 117, 218, 0.92),rgba(49, 21, 207, 0.83))',
          backgroundSize: '400% 400%',
          animation: 'gradientAnimation 5s ease infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          '@keyframes gradientAnimation': {
            '0%': {
              backgroundPosition: '0% 50%',
            },
            '50%': {
              backgroundPosition: '100% 50%',
            },
            '100%': {
              backgroundPosition: '0% 50%',
            },
          },
        }}
        onMouseMove={handleMouseMove} // Відслідковуємо рух миші
      >
        <Typography
          component="h1"
          sx={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            animation: 'textAnimation 3s ease-in-out infinite',
            '@keyframes textAnimation': {
              '0%': {
                transform: 'translateY(0)',
                opacity: 1,
              },
              '50%': {
                transform: 'translateY(-20px)',
                opacity: 0.7,
              },
              '100%': {
                transform: 'translateY(0)',
                opacity: 1,
              },
            },
          }}
        >
           {t("welcome-message")}
        </Typography>

        {/* Іконки, пов'язані з документами, листами і перепискою */}
        {[
          { icon: '✉️', label: 'Лист' },
          { icon: '📄', label: 'Документ' },
          { icon: '📋', label: 'Кліпборд' },
          { icon: '📒', label: 'Записник' },
          { icon: '🗂️', label: 'Папка' },
          { icon: '📧', label: 'Електронний лист' },
          { icon: '📝', label: 'Нотатка' },
          { icon: '📚', label: 'Книга' },
        ].map((item, index) => {
          const scaleEffect = calculateDistanceEffect(positions[index]?.x, positions[index]?.y);

          return (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                top: `${positions[index]?.y}%`,
                left: `${positions[index]?.x}%`,
                fontSize: '2rem',
                zIndex: 0,
                transform: `translate(-50%, -50%) scale(${scaleEffect})`,
                transition: 'transform 0.1s ease-out',
              }}
            >
              <span role="img" aria-label={item.label}>
                {item.icon}
              </span>
            </Box>
          );
        })}
      </Box>
    </div>
  );
};
// ----------
export default DashboardPage;
