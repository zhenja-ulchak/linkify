"use client";

import React, { useState } from "react";
import axios from "axios";
import { NextPage } from "next";
import { Button, TextField, Typography, Box, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import apiService from "../services/apiService";
import { enqueueSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import { useThemeContext } from "../../context/ThemeContext";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/LocaleSwitcher";

const ForgotPassword: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const t = useTranslations("API");
  const router = useRouter();

  // Функція для валідації email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Обробка зміни email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError(t("invalidEmail")); // Локалізоване повідомлення про помилку
    } else {
      setEmailError("");
    }
  };

  // Обробка сабміту форми
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError(t("invalidEmail"));
      return;
    }

    const getToken: any = sessionStorage.getItem("AuthToken");
    try {
      const response: any = await apiService.put(
        "user/passforgot",
        { email },
        getToken
      );

      if (response instanceof Error) {
        const { status, variant, message } = apiService.CheckAndShow(
          response,
          t
        );
        //@ts-ignore
        enqueueSnackbar(message, { variant });
      }

      if (response.status === 200 || response.success === true) {
        enqueueSnackbar(t("passwordResetSuccess"), { variant: "success" });
      }
    } catch (error) {
      enqueueSnackbar(t("serverError"), { variant: "error" });
    }
  };

  const handleLoginLinkClick = () => {
    router.push("/login");
  };

  return (
    <>
      <div
            className="locale-switcher-container"
            style={{ position: "absolute", top: "3px", right: "66px" }}
          >
            <LocaleSwitcher />
          </div>
      <Box
        sx={{
          marginRight: "10px",
          marginTop: "10px",
          position: "absolute",
          top: "-5px",
          right: "8px",
        }}
      >
        <ThemeToggleButton />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          // backgroundColor: "#f5f5f5",
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
              // backgroundColor: "white",
            }}
          >
            <Typography variant="h5" gutterBottom>
              {t("forgot-password")}
            </Typography>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label={t("email-address")}
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleEmailChange}
                placeholder={t("enter-your-email")}
                error={!!emailError}
                helperText={emailError && t("email-error")}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                {t("send-email")}
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
              {t("back-to-login")}
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ForgotPassword;
