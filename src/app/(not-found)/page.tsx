import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import { JSX } from "react";

export default function MethodNotAllowed(): JSX.Element {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        bgcolor: "background.default",
        color: "text.primary",
        p: 3,
      }}
    >
      <Typography variant="h1" gutterBottom>
        405
      </Typography>
      <Typography variant="h5" gutterBottom>
        Die Methode ist nicht erlaubt.
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bitte überprüfen Sie Ihre Anfrage oder kehren Sie zurück zur Startseite.
      </Typography>
      <Link href="/" passHref>
        <Button variant="contained" color="primary">
          Zurück zur Startseite
        </Button>
      </Link>
    </Box>
  );
}
