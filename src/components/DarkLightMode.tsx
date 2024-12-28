import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useState } from "react";

interface ChangeModeProps {
  color?: string;
}

export default function ChangeMode({ color = "#1976d2" }: ChangeModeProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;

      // Setze die globale Klasse
      const bodyClass = newMode ? "dark-mode" : "light-mode";
      document.body.className = bodyClass;

      return newMode;
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        right: 20,
        display: "flex",
        justifyContent: "flex-end",
        cursor: "pointer",
      }}
      onClick={toggleDarkMode}
    >
      {isDarkMode ? (
        <LightModeIcon
          style={{ color: "#fff", width: "30px", height: "40px" }}
        />
      ) : (
        <DarkModeIcon style={{ color: color, width: "30px", height: "40px" }} />
      )}
    </div>
  );
}
