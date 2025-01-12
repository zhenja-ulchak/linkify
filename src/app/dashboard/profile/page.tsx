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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useTranslations } from 'next-intl';
import apiService from "@/app/services/apiService";
import { enqueueSnackbar } from "notistack";
import router from "next/router";

interface FormData {
  language: string;
  oldPassword: string;
  password: string;
  confirmationPassword: string;
}

export default function Profile() {
  const [profileUser, setProfileUser] = useState<any>(null);
  
  const t = useTranslations('API');

  const [formData, setFormData] = useState<FormData>({
    language: "",
    oldPassword: "",
    password: "",
    confirmationPassword: "",
  });
  const [language, setLanguage] = useState('ua'); // Початкова мова

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      language: newValue, // Зміна мови
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const getToken: any = sessionStorage.getItem('AuthToken');
    const response: any = await apiService.put(
      `user/profile`,
      formData,
      getToken
    );
    console.log(formData);

    if (response instanceof Error) {
      const { status, variant, message } = apiService.CheckAndShow(response, t);
      //@ts-ignore
      enqueueSnackbar(message, { variant: variant });
    }

    if (response.status === 200) {
      enqueueSnackbar(t('profile-updated-successfully'), { variant: 'success' });
      router.push('/login');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const getToken: any = sessionStorage.getItem('AuthToken');
      const response: any = await apiService.get("user/profile", getToken);
      setProfileUser(response.data[0]?.user);

      if (response instanceof Error) {
        const { status, variant, message } = apiService.CheckAndShow(response, t);
        //@ts-ignore
        enqueueSnackbar(message, { variant: variant });
      }

      if (response.status === 200) {
        enqueueSnackbar(t('profile-data-fetched-successfully'), { variant: 'success' });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (profileUser) {
      setFormData((prevData) => ({
        ...prevData,
        language: profileUser.language || 'en', // Оновлення мови
      }));
    }
  }, [profileUser]);

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
              name="oldPassword"
              required
              type="password" // Тип поля для пароля
              value={formData.oldPassword}
              onChange={handleInputChange}
              error={!!formData.oldPassword && formData.oldPassword.length < 8} // Перевірка на мінімальну довжину
              helperText={formData.oldPassword && formData.oldPassword.length < 8 ? t('password-length-error') : ''} // Повідомлення про помилку
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("New-password")}
              name="password"
              required
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!formData.password && formData.password.length < 8} // Перевірка на мінімальну довжину
              helperText={formData.password && formData.password.length < 8 ? t('password-length-error') : ''} // Повідомлення про помилку
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("confirmation-password")}
              name="confirmationPassword"
              required
              type="password"
              value={formData.confirmationPassword}
              onChange={handleInputChange}
              error={formData.confirmationPassword !== formData.password} // Перевірка на збіг паролів
              helperText={formData.confirmationPassword !== formData.password ? t('password-mismatch') : ''} // Повідомлення про помилку
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>{t("Language")}</InputLabel>
              <Select
                value={formData.language}
                onChange={handleSelectChange}
                label={t("Language")}
              >
                <MenuItem value="ua">UA (Українська)</MenuItem>
                <MenuItem value="ru">RU (Русский)</MenuItem>
                <MenuItem value="en">EN (English)</MenuItem>
                <MenuItem value="es">ES (Español)</MenuItem>
                <MenuItem value="de">DE (Deutsch)</MenuItem>  {/* Виправлено з "німецька" на "Deutsch" */}
                <MenuItem value="zh-CH">ZH (中文 - Китайська)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              {t("save")}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
