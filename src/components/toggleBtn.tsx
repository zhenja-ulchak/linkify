import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import TableCell from "@mui/material/TableCell";
import * as React from "react";

interface ToggleSwitchProps {
  align: "left" | "center" | "right";
}

export default function ToggleSwitch({ align }: ToggleSwitchProps) {
  const [toggle, setToggle] = React.useState(false);

  return (
    <TableCell align={align}>
      <button
        style={{
          border: "none",
          backgroundColor: "transparent",
          cursor: "pointer",
          color: toggle ? "green" : "initial", // Setzt die Farbe auf grün, wenn toggle true ist
        }}
        onClick={() => setToggle(!toggle)}
      >
        {toggle ? (
          <ToggleOnIcon style={{ scale: "1.5" }} />
        ) : (
          <ToggleOffIcon className="toggleButton" style={{ scale: "1.5" }} />
        )}
      </button>
    </TableCell>
  );
}
