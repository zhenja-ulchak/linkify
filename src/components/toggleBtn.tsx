import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";  // Используем IconButton вместо button
import * as React from "react";

interface ToggleSwitchProps {
  align: "left" | "center" | "right";
}

export default function ToggleSwitch({ align }: ToggleSwitchProps) {
  const [toggle, setToggle] = React.useState(false);

  return (
    <TableCell align={align}>
      <IconButton
        style={{
          color: toggle ? "green" : "initial", // Устанавливаем цвет в зависимости от состояния toggle
        }}
        onClick={() => setToggle(!toggle)}
      >
        {toggle ? (
          <ToggleOnIcon style={{ scale: "1.5" }} />
        ) : (
          <ToggleOffIcon className="toggleButton" style={{ scale: "1.5" }} />
        )}
      </IconButton>
    </TableCell>
  );
}
