import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import { JSX } from "react";

export default function NotFound(): JSX.Element {
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
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Die Seite, die Sie suchen, wurde nicht gefunden.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Vielleicht möchten Sie zur Startseite zurückkehren?
        </Typography>
        <Link href="/" passHref>
          <Button variant="contained" color="primary">
            Zurück zur Startseite
          </Button>
        </Link>
      </Box>
    );
  }