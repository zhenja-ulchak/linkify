"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useTranslations } from 'next-intl';
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Alert,
  Stack,
  FormControl,
  InputLabel,
} from "@mui/material";

// Interface für das Formular-Datenobjekt
interface FormData {
  company_name: string;
  address: string;
  invoice_address: string;
  license_valid_until: string;
  contact_email: string;
  invoice_email: string;
  contact_phone: number;
}

export default function AdminProfile() {
  const [formData, setFormData] = useState<FormData>({
    company_name: "",
    address: "",
    invoice_address: "",
    license_valid_until: "",
    contact_email: "",
    invoice_email: "",
    contact_phone: 0,
  });

    const t = useTranslations('Admin-profile');
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const id = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}tenant/${id}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setFormData(response.data);
        setSuccessMessage(response.data.message);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Ein unbekannter Fehler ist aufgetreten.");
        }
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}user/profile`,
        formData
      );
      setSuccessMessage(response.data.message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Ein unbekannter Fehler ist aufgetreten.");
      }
    }
  };

  console.log(formData);
  

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" align="center" gutterBottom>
        {t("profile")} 
      </Typography>

      <Typography variant="h6">{t("benutzer")} </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label={t("benutzername")}
            name="company_name"
            required
            value={formData.company_name}
            onChange={handleInputChange}
            fullWidth
          />

          <FormControl component="fieldset">
            <Typography variant="h6">{t("rechnungsadresse")} </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label={t("firmenname")}
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={t("name")}
                  name="invoice_address"
                  value={formData.invoice_address}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={t("vorname")}
                  name="license_valid_until"
                  value={formData.license_valid_until}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t("hausnummer")}
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={t("postleitzahl")}
                  name="invoice_email"
                  value={formData.invoice_email}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={t("ort")}
                  name="contact_phone"
                  type="number"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </FormControl>

          <Button variant="contained" type="submit" fullWidth>
            {t("speichern")}
          </Button>

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
        </Stack>
      </form>
    </Paper>
  );
}
