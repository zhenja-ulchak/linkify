"use client";

import React, { useState } from "react";
import axios from "axios";
import { NextPage } from "next";
import { Button, TextField, Typography, Box, Container } from "@mui/material";
import { useRouter } from "next/navigation";

const ForgotPassword: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}user/passforgot`,
        {
          email,
        }
      );

      if (response.status === 200) {
        setSuccessMessage(
          "Eine E-Mail mit Anweisungen zum Zurücksetzen Ihres Passworts wurde gesendet."
        );
      } else if (response.status === 404) {
        setErrorMessage("Die eingegebene E-Mail-Adresse wurde nicht gefunden.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Check if response contains the expected structure
        const errorResponse = error.response?.data;
        let errorMessageString = "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.";

        // Check if the message is an object and extract the relevant information
        if (errorResponse) {
          if (typeof errorResponse.message === "object") {
            // Extract the error message from the object structure
            const guiMessage = errorResponse.message["gui-message"];
            const errorMessageContent = errorResponse.message["error-message"];
            errorMessageString = guiMessage || errorMessageContent || errorMessageString;
          } else {
            // Use the simple message if it's a string
            errorMessageString = errorResponse.message || errorMessageString;
          }
        }

        setErrorMessage(errorMessageString);
      } else if (error instanceof Error) {
        // Handle general JavaScript errors (non-Axios)
        setErrorMessage(error.message || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      } else {
        // Fallback error message if the error type is unknown
        setErrorMessage("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      }
    }
  };

  const router = useRouter();

  function handleLoginLinkClick() {
    router.push("/login");
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5", // Light background for contrast
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "white", // White background for the form
          }}
        >
          <Typography variant="h5" gutterBottom>
            Passwort vergessen
          </Typography>

          {successMessage && (
            <Box sx={{ color: "green", marginBottom: 2 }}>
              <Typography variant="body2">{successMessage}</Typography>
            </Box>
          )}

          {errorMessage && (
            <Box sx={{ color: "red", marginBottom: 2 }}>
              <Typography variant="body2">{errorMessage}</Typography>
            </Box>
          )}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-Mail-Adresse"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Geben Sie Ihre E-Mail-Adresse ein"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              E-Mail senden
            </Button>
          </form>

          <Button
            onClick={handleLoginLinkClick}
            variant="text"
            color="secondary"
            sx={{
              marginTop: 2,
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Zurück zum Login?
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
