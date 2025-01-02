"use client";
import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Box,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Administrator: React.FC = () => {
  // Zustände für Eingaben
  const [smtpServer, setSmtpServer] = useState("");
  const [smtpPort, setSmtpPort] = useState("");
  const [encryption, setEncryption] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [savePassword, setSavePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [autoAuth, setAutoAuth] = useState(false);

  // Zustände für Fehlermeldungen
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Eingabe validieren
  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    if (!smtpServer) newErrors.smtpServer = "SMTP-Server darf nicht leer sein.";
    if (!smtpPort || isNaN(Number(smtpPort))) {
      newErrors.smtpPort = "SMTP-Port muss eine gültige Zahl sein.";
    }
    if (!encryption) newErrors.encryption = "Verschlüsselung ist erforderlich.";
    if (!username) newErrors.username = "Benutzername darf nicht leer sein.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    }
    if (!password) newErrors.password = "Passwort darf nicht leer sein.";
    if (!savePassword) {
      newErrors.savePassword =
        "Bitte aktivieren Sie die Option 'Passwort speichern'.";
    }
    return newErrors;
  };

  // Prüfen, ob alle Felder gültig sind
  const isFormValid = () => {
    return (
      smtpServer &&
      smtpPort &&
      !isNaN(Number(smtpPort)) &&
      encryption &&
      username &&
      email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      password &&
      savePassword
    );
  };

  const handleSave = async () => {
    const newErrors = validateInputs();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      smtpServer,
      smtpPort,
      encryption,
      username,
      email,
      password: savePassword ? password : null,
      autoAuth,
    };

    try {
      setServerError(null); // Vorherige Fehler zurücksetzen
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}email/config`, payload);
      alert("SMTP-Einstellungen erfolgreich gespeichert!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Axios-spezifischer Fehler
        setServerError(
          error.response?.data?.message || "Fehler beim Speichern der Einstellungen."
        );
      } else if (error instanceof Error) {
        // Allgemeiner JavaScript-Fehler
        setServerError(error.message);
      } else {
        // Fallback für unbekannte Fehler
        setServerError("Ein unbekannter Fehler ist aufgetreten.");
      }
    }
  };

  const handleTestEmail = async () => {
    const newErrors = validateInputs();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setServerError(null);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}email/test`,
        { email }
      );
      alert(`Test-E-Mail gesendet: ${response.data.message}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Axios-spezifischer Fehler
        setServerError(
          error.response?.data?.message || "Fehler beim Testen der E-Mail."
        );
      } else if (error instanceof Error) {
        // Allgemeiner JavaScript-Fehler
        setServerError(error.message);
      } else {
        // Fallback für unbekannte Fehler
        setServerError("Ein unbekannter Fehler ist aufgetreten.");
      }
    }
  };


  return (
    <Container
      id="AdminContainer"
      maxWidth="md"
      style={{ minHeight: "890px", position: "relative", top: "-0px", }}
    >
      <Typography
        variant="h4"
        gutterBottom
        textAlign={"center"}
        id="AdminHeader"
        fontWeight={"900"}
      >
        Admin: SMTP-E-Mail konfigurieren
      </Typography>
      {serverError && <Alert severity="error">{serverError}</Alert>}
      <Grid container spacing={3} id="AdminPageContainer">
        {/* SMTP-Server */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="SMTP-Server"
            value={smtpServer}
            onChange={(e) => setSmtpServer(e.target.value)}
            error={!!errors.smtpServer}
            helperText={errors.smtpServer}
            required
            className="input-group"
          />
        </Grid>

        {/* SMTP-Port */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="SMTP-Port"
            value={smtpPort}
            onChange={(e) => setSmtpPort(e.target.value)}
            error={!!errors.smtpPort}
            helperText={errors.smtpPort}
            required
            className="input-group"
          />
        </Grid>

        {/* Verschlüsselung */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Art der Verschlüsselung (z. B. SSL, TLS)"
            value={encryption}
            onChange={(e) => setEncryption(e.target.value)}
            error={!!errors.encryption}
            helperText={errors.encryption}
            required
            className="input-group"
          />
        </Grid>

        {/* Benutzername */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
            required
            className="input-group"
          />
        </Grid>

        {/* E-Mail-Adresse */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="E-Mail-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
            className="input-group"
          />
        </Grid>

        {/* Passwort */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Passwort"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            required
            className="input-group ContainerVisibility"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    aria-label="Passwort umschalten"
                  >
                    {showPassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Optionen */}
        <Grid item xs={12} marginLeft={"-85px"}>
          <FormControlLabel
            control={
              <Switch
                checked={savePassword}
                onChange={(e) => setSavePassword(e.target.checked)}
              />
            }
            label="Passwort speichern"
            id="PasswordSaveLabel"
          />
          {errors.savePassword && (
            <Typography color="error" variant="body2">
              {errors.savePassword}
            </Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={autoAuth}
                onChange={(e) => setAutoAuth(e.target.checked)}
              />
            }
            label="Automatische Authentifizierung"
            id="AuthentificationLabel"
          />
        </Grid>

        {/* Aktionen */}
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            flexWrap="wrap"
            id="AdminActionsContainer"
            gap={2}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={() => console.log("Abbrechen")}
            >
              Abbrechen
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleTestEmail}
            >
              Test-E-Mail senden
            </Button>
            {isFormValid() && (
              <Button variant="contained" color="success" onClick={handleSave}>
                Fertigstellen
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Administrator;
