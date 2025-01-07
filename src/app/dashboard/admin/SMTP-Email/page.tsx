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
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('API');

  // Zustände für Fehlermeldungen
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Eingabe validieren
  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    if (!smtpServer) newErrors.smtpServer =  t('Smtp.smtp-server');
    if (!smtpPort || isNaN(Number(smtpPort))) {
      newErrors.smtpPort = t('Smtp.smtp-port');
    }
    if (!encryption) newErrors.encryption = t('Smtp.versch');
    if (!username) newErrors.username = t('Smtp.benutzername');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('Smtp.bitte-geben');
    }
    if (!password) newErrors.password = t('Smtp.passwort');
    if (!savePassword) {
      newErrors.savePassword =
      t('Smtp.bitte-aktiv');
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
      alert(t('Smtp.smtp-einstel'));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Axios-spezifischer Fehler
        setServerError(
          error.response?.data?.message || t('Smtp.fehler')
        );
      } else if (error instanceof Error) {
        // Allgemeiner JavaScript-Fehler
        setServerError(error.message);
      } else {
        // Fallback für unbekannte Fehler
        setServerError(t('Smtp.unbekannter'));
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
      alert(t('Smtp.test-email', { message: response.data.message }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Axios-spezifischer Fehler
        setServerError(
          error.response?.data?.message || t('Smtp.fehler-beim')
        );
      } else if (error instanceof Error) {
        // Allgemeiner JavaScript-Fehler
        setServerError(error.message);
      } else {
        // Fallback für unbekannte Fehler
        setServerError(t('Smtp.unbekannter'));
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
        {t("Smtp.smtp-email")}
      </Typography>
      {serverError && <Alert severity="error">{serverError}</Alert>}
      <Grid container spacing={3} id="AdminPageContainer">
        {/* SMTP-Server */}
        <Grid item xs={12} sm={6}>
          <TextField
            label={t("Smtp.smtp-email")}
            value={smtpServer}
            onChange={(e) => setSmtpServer(e.target.value)}
            error={!!errors.smtpServer}
            helperText={errors.smtpServer}
            required
            fullWidth
            className="input-group"
          />
        </Grid>

        {/* SMTP-Port */}
        <Grid item xs={12} sm={6}>
          <TextField
            label={t("Smtp.smtp-port2")}
            value={smtpPort}
            onChange={(e) => setSmtpPort(e.target.value)}
            error={!!errors.smtpPort}
            helperText={errors.smtpPort}
            required
            fullWidth
            className="input-group"
          />
        </Grid>

        {/* Verschlüsselung */}
        <Grid item xs={12} sm={6}>
          <TextField
            label={t("Smtp.art-der")}
            value={encryption}
            onChange={(e) => setEncryption(e.target.value)}
            error={!!errors.encryption}
            helperText={errors.encryption}
            required
            fullWidth
            className="input-group"
          />
        </Grid>

        {/* Benutzername */}
        <Grid item xs={12} sm={6}>
          <TextField
            label={t("Smtp.benutzername2")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
            required
            fullWidth
            className="input-group"
          />
        </Grid>

        {/* E-Mail-Adresse */}
        <Grid item xs={12} sm={6}>
          <TextField
            label={t("Smtp.email-adresse")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
            fullWidth
            className="input-group"
          />
        </Grid>

        {/* Passwort */}
        <Grid item xs={12} sm={6}>
          <TextField
            label={t("Smtp.passwort2")}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            required
            fullWidth
            className="input-group ContainerVisibility"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    aria-label={t("Smtp.passwort-umschalten")}
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
        <Grid item xs={12} >
          <FormControlLabel
            control={
              <Switch
                checked={savePassword}
                onChange={(e) => setSavePassword(e.target.checked)}
              />
            }
            label={t("Smtp.passwort-speichern")}
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
            label={t("Smtp.authentificationLabel")}
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
              {t("Smtp.abbrechen")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleTestEmail}
            >
              {t("Smtp.test-email-senden")}
            </Button>
            {isFormValid() && (
              <Button variant="contained" color="success" onClick={handleSave}>
                {t("Smtp.fertigstellen")}
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Administrator;
