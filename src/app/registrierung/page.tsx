"use client";
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [houseNumber, setHouseNumber] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [addressSupplement, setAddressSupplement] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [showPasswords, setShowPasswords] = useState<boolean>(false);
  const [company, setCompany] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>(""); // Fehlernachricht
  const [successMessage, setSuccessMessage] = useState<string>(""); // Erfolgsnachricht
  const router = useRouter();

  const border = {
    border: "2px solid #ccc",
    borderRadius: "5px",
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z\d!@#$%^&*?]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Fehlernachricht zurücksetzen
    setSuccessMessage(""); // Erfolgsnachricht zurücksetzen

    if (username.length < 4) {
      setErrorMessage("Benutzername muss mindestens 4 Zeichen beinhalten.");
      return;
    }

    // Erlaubt nur alphanumerische Zeichen
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
      setErrorMessage("Benutzername darf keine Sonderzeichen enthalten.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwörter stimmen nicht überein.");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage(
        "Das Passwort muss mindestens 8 Zeichen lang sein und mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen (!@#$%^&*?) enthalten."
      );
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}user/register`,
        {
          firstName,
          lastName,
          street,
          houseNumber,
          postalCode,
          city,
          region,
          country,
          addressSupplement,
          email,
          password,
          username,
          company,
        }
      );

      // Erfolgreiche Registrierung
      if (response.status === 200) {
        setSuccessMessage(
          "Erfolgreich registriert, Sie werden weitergeleitet."
        );
        setTimeout(() => {
          router.push("/customer");
        }, 3000);
      } else {
        // Fehler, wenn Status nicht 200 ist
        setErrorMessage(`Email ist bereits vergeben: ${response.data.message}`);
      }
    } catch (error: unknown) {
      console.error(
        "Serverfehler, bitte versuchen Sie es später erneut:",
        error
      );

      // Fehlerbehandlung
      if (error instanceof Error) {
        setErrorMessage(error.message); // Nur, wenn `error` vom Typ `Error` ist
      } else {
        setErrorMessage("Ein unbekannter Fehler ist aufgetreten.");
      }
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <>
      <Button
        id="LoginBtnOnRegisterPage"
        sx={{ float: "right", marginRight: "10px", marginTop: "10px" }}
        variant="outlined"
        onClick={handleLogin}
      >
        zurück zum Login
      </Button>

      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minWidth="100%"
          minHeight="100vh"
        >
          <Box
            sx={{ marginTop: "69px", marginBottom: "50px" }}
            component="form"
            onSubmit={handleRegister}
            display="flex"
            flexDirection="column"
            gap={2}
            width="100%"
          >
            <Typography
              sx={{ textAlign: "center" }}
              variant="h4"
              component="h2"
              gutterBottom
            >
              Registrierung
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Vorname"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nachname"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Adresse"
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Hausnummer"
                  type="text"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Postleitzahl"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ort"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Region"
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Land"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Adresszusatz"
                  type="text"
                  value={addressSupplement}
                  onChange={(e) => setAddressSupplement(e.target.value)}
                  fullWidth
                  style={border}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Firma"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Benutzername"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="E-Mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  style={border}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Passwort"
                  type={showPasswords ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  className="ContainerVisibility"
                  style={border}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPasswords(!showPasswords)}
                        >
                          {showPasswords ? (
                            <VisibilityOffIcon className="VisibilityOFF" />
                          ) : (
                            <VisibilityIcon className="VisibilityONN" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Passwort bestätigen"
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  fullWidth
                  className="ContainerVisibility"
                  style={border}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPasswords(!showPasswords)}
                        >
                          {showPasswords ? (
                            <VisibilityOffIcon className="VisibilityOFF" />
                          ) : (
                            <VisibilityIcon className="VisibilityONN" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                {errorMessage && (
                  <Typography color="error" variant="body2">
                    {errorMessage}
                  </Typography>
                )}
                {successMessage && (
                  <Typography color="green" variant="body2">
                    {successMessage}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained">
                  Registrierung
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Register;
