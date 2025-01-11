"use client";

import React, { AnyActionArg, useEffect, useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTranslations } from 'next-intl';
import apiService from "@/app/services/apiService";
import { enqueueSnackbar } from "notistack";

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
  id?: string;
}

export default function Profile() {

  const [profileData, setProfileData] = useState<FormData | null>(null)
  const [profileUser, setProfileUser] = useState<any>(null)


  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const t = useTranslations('Customer');
  const tAPI = useTranslations('API');

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

  });
  const [language, setLanguage] = useState('ua'); // Початкова мова

  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setLanguage(event.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const getToken: any = sessionStorage.getItem('AuthToken');
    const response: any = await apiService.put(
      `user/profile`,
      formData, getToken
    );

    if (response instanceof Error) {
      const { status, variant, message } = apiService.CheckAndShow(response, tAPI);
      console.log(message);
      // @ts-ignore
      enqueueSnackbar(message, { variant: variant });
    }

    if (response.status === 200) {
      enqueueSnackbar(t('profile-updated-successfully'), { variant: 'success' });


    }
  };



  useEffect(() => {
    const fetchData = async () => {

      const getToken: any = sessionStorage.getItem('AuthToken');
      const response: any = await apiService.get("user/profile", getToken)
      setProfileUser(response.data[0]?.user)
      if (response?.data && response.data.length > 0 && response.data[0]?.tanant) {
        setProfileData(response.data[0].tanant);
      } else {
        console.error("Tenant data not found in API response:", response?.data);
      }


      if (response instanceof Error) {
        const { status, variant, message } = apiService.CheckAndShow(response, tAPI);

        // @ts-ignore
        enqueueSnackbar(message, { variant: variant });
      }
      if (response.status === 200) {
        enqueueSnackbar(t('profile-data-fetched-successfully'), { variant: 'success' });

      }


    };

    fetchData();



  }, []);

  // useEffect(() => {
  //   if (profileData && profileUser) {
  //     setFormData({
  //       username: profileUser.first_name ,
  //       //@ts-ignore
  //       companyName: profileData.company_name,
  //       name: profileUser.first_name || "",
  //       firstName: profileUser.last_name || "",
  //       //@ts-ignore
  //       street: profileData.address || "",
  //       postalCode: profileData.postalCode || "",
  //       city: profileData.city || "",
  //       region: profileData.region || "",
  //       country: profileData.country || "",
  //       //@ts-ignore
  //       addressAdditional: profileData.address || "",
  //       //@ts-ignore
  //       licenseValidity: profileData.license_valid_until || "",
  //       group: profileData.group || "",
  //     });
  //   }
  // }, [profileData, profileUser]);




  console.log('Profile data updated:', profileData);
  console.log(profileUser);
  return (
    <Paper elevation={0} sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        {t("profile")}
      </Typography>

      <Grid item xs={12}>
        <Typography variant="h6">{t("change-password")}</Typography>
      </Grid>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("Old-password")}
              name="username"
              required
              value={''}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("New-password")}
              name="licenseValidity"
              value={''}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("confirmation-password")}
              name="licenseValidity"
              value={''}
              onChange={handleInputChange}
            />
          </Grid>

          <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              value={language}
              onChange={handleChange}
              label="Language"
            >
              <MenuItem value="ua">UA (Українська)</MenuItem>
              <MenuItem value="ru">RU (Русский)</MenuItem>
              <MenuItem value="en">EN (English)</MenuItem>
              <MenuItem value="es">ES (Español)</MenuItem>
            </Select>
          </FormControl>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              {t("save")}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* {errorMessage && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ marginTop: 2 }}>
          {successMessage}
        </Alert>
      )} */}
    </Paper>
  );
}
