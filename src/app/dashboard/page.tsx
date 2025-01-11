"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Box, Typography } from "@mui/material";

const DashboardPage = () => {
  const t = useTranslations("Dashboard");
  return (
    <div id="ContainerDashboard" style={{textAlign:'center',top: '-55px',
      position: 'relative'}}>
     
      <Box
      sx={{
        height: '100vh',
        background: 'linear-gradient(45deg,rgba(17, 85, 145, 0.86),rgba(41, 85, 207, 0.92))',
        backgroundSize: '400% 400%',
        animation: 'gradientAnimation 5s ease infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
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
    >
      <Typography
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
        <h1>{t("dashboard")}</h1>
         {t("welcome-message")}
      </Typography>
    </Box>
    </div>
  );
};
// ----------
export default DashboardPage;
