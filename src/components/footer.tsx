"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Box, Container, Typography, Link, Modal, Button } from "@mui/material";


interface FooterProps {
  footerPosition?: string | number;
  footerIndex?: string | number;
  borderTop?: string | number;
}

// .env datei muss im Root verzeichnis gespeichert sein
// Die .env Variablen Müssen mit NEXT_PUBLIC anfangen
// const isDebugON = process.env.NEXT_PUBLIC_APP_DEBUG === "ON" ? true : false;
const Timeout = parseInt(process.env.NEXT_PUBLIC_APP_TIMEOUT || "300", 10);
const LogoutViewTimer = parseInt(
  process.env.NEXT_PUBLIC_APP_LOGOUT_VIEW_TIMER || "20",
  10
);

const Footer: React.FC<FooterProps> = ({
  footerPosition = "0",
  footerIndex = "9999",
  borderTop = "1px solid rgba(255, 255, 255, 1)",
}) => {
  const [counter, setCounter] = useState(Timeout); 
  const [showModal, setShowModal] = useState(false); 
  const getSharedObject = () => {
    const storedSetting = sessionStorage.getItem("setting");
    if (storedSetting) {
      try {
        return JSON.parse(storedSetting); // Парсимо JSON
      } catch (error) {
        console.error("Помилка парсингу JSON із sessionStorage:", error);
        return {}; // Повертаємо порожній об'єкт у разі помилки
      }
    }
    return {}; // Повертаємо порожній об'єкт, якщо дані відсутні
  };

  const [sharedObject, setSharedObject] = useState(getSharedObject());

  

  const resetTimer = useCallback(() => {
    setCounter(Timeout); 
    setShowModal(false); 
  }, []);

  const handleLogoutLocal = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/login";
  };

  // Effekt für den Countdown-Mechanismus
  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(timer); // Timer stoppen, wenn der Countdown abläuft
          handleLogoutLocal();
          return 0; // Countdown auf 0 setzen
        }
        if (prev <= LogoutViewTimer) setShowModal(true); // Modal anzeigen, wenn der Countdown unter `LogoutViewTimer` fällt
        return prev - 1; // Countdown um 1 Sekunde verringern
      });
    }, 1000); // Intervall: 1 Sekunde

    // Event-Listener hinzufügen, um Timer bei Mausbewegung zurückzusetzen
    window.addEventListener("mousemove", resetTimer);

    // Aufräumen: Event-Listener entfernen und Timer stoppen
    return () => {
      clearInterval(timer);
      window.removeEventListener("mousemove", resetTimer);
    };
  }, [resetTimer]);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1976d2",
        color: "#fff",
        position: "fixed",
        bottom: "0",
        minWidth: "100%",
        minHeight: "auto",
        zIndex: footerIndex,
        left: footerPosition,
        transition: "left 0.23s ease",
        borderTop: borderTop,
      }}

    >
      <Container maxWidth="lg" sx={{ margin: 0, padding: 0, width: "100vw" }}>
        {/* Social Media Links */}
       

        <Box
          width={"100vw"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant="body2" sx={{ color: "#fff", }} className="FooterLorem">
         hi - {sharedObject.name}  {sharedObject.last_name}
          </Typography>
        </Box>
      </Container>

      {/* Kann hier Im Footer Countdown Anzeigen */}
      {/* {isDebugON && (
        <Box sx={{ textAlign: "center", zIndex: 9999 }}>
          <Typography variant="body2" sx={{ color: "#fff" }}>
            Timeout: {counter} Sekunden
          </Typography>
        </Box>
      )} */}

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="textPrimary" gutterBottom>
            Inaktivität erkannt
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={2}>
            Du wirst in {counter} Sekunden ausgeloggt!
          </Typography>
          <Button variant="contained" color="primary" onClick={resetTimer}>
            Aktiv bleiben
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Footer;
