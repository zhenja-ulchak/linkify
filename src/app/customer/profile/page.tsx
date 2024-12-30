"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Alert,
  InputAdornment,
} from "@mui/material";

interface FormData {
  username: string;
  companyName: string;
  name: string;
  firstName: string;
  street: string;
  postalCode: string;
  city: string;
  region: string;
  country: string;
  addressAdditional: string;
  licenseValidity: string;
  group: string;
  id: string;
}

export default function Profile() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    companyName: "",
    name: "",
    firstName: "",
    street: "",
    postalCode: "",
    city: "",
    region: "",
    country: "",
    addressAdditional: "",
    licenseValidity: "",
    group: "",
    id: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}user/profile`, {
          headers: { "Content-Type": "application/json" },
        });
        setFormData(response.data);
        setSuccessMessage(response.data.message);
      } catch (error: unknown) {
        setErrorMessage(error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten.");
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}user/profile`,
        formData
      );
      setSuccessMessage(response.data.message);
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten.");
    }
  };

  return (
    <Paper elevation={0} sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Profile
      </Typography>

      <Grid item xs={12}>
            <Typography variant="h6">* Benutzer:</Typography>
          </Grid>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Benutzername"
              name="username"
              required
              value={formData.username}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">+ Rechnungsadresse</Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Firmenname"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              inputProps={{ pattern: "^[A-Za-z]+$" }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Vorname"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              inputProps={{ pattern: "^[A-Za-z]+$" }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Straße und Hausnummer"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Postleitzahl"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              inputProps={{ pattern: "^[0-9]+$" }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Ort"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Region"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Land"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Adresszusatz"
              name="addressAdditional"
              value={formData.addressAdditional}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">+ Firmenname:</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Firmenname"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">- Lizenz Gültigkeit</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Lizenz Gültigkeit"
              name="licenseValidity"
              value={formData.licenseValidity}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">- Gruppe</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Gruppe"
              name="group"
              value={formData.group}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Speichern
            </Button>
          </Grid>
        </Grid>
      </form>

      {errorMessage && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ marginTop: 2 }}>
          {successMessage}
        </Alert>
      )}
    </Paper>
  );
}
