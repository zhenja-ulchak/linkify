"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ApiService from "../services/apiService";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "../../app/../components/LocaleSwitcher"; // Import LanguageSwitcher component
// @ts-expect-error
import CryptoJS from "crypto-js";
import { enqueueSnackbar } from "notistack";
import useBooleanStore from "@/store/userStore";
import RefreshSessionTimeout from "@/components/RefreshTimeout/Refresh";
import ChangeMode from "@/components/DarkLightMode";
import ThemeToggleButton from "@/components/ThemeToggleButton";

const Login: React.FC = () => {
  const router = useRouter();
  const [time, setTime] = useState<number | undefined>();
  const [username, setUsername] = useState("john.doe@example.com"); // super.admin@tenant2.com          superadmin     super-zhenja@ukr.net          alice.smith@example.com user   john.doe@example.com
  const [password, setPassword] = useState("password123");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Track login status
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // State to track the remaining time
  const t = useTranslations("API"); // Переводы для компонента логина
  const { setIsSynced }: any = useBooleanStore();
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegistrierung = () => {
    router.push("/registrierung");
  };

  const handlePasswordReset = () => {
    router.push("/password-vergessen");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const resp = await ApiService.login<any>(username, password);

      if (resp instanceof Error) {
        const { status, variant, message } = ApiService.CheckAndShow(resp, t);

        // @ts-ignore
        enqueueSnackbar(message, { variant: variant });
      } else {
        // @ts-ignore
        const booleanDebag = resp?.data[0]?.debug;
        setTime(resp?.data[0]?.token_expires);
        setIsSynced({ open: booleanDebag });

        sessionStorage.setItem(
          "timeStep",
          JSON.stringify(resp?.data[0]?.token_expires)
        );
        if (resp?.data?.length > 0 && resp.data[0]?.tanant) {
          sessionStorage.setItem(
            "tenant",
            JSON.stringify(resp.data[0]?.tanant.license_valid_until)
          );
        }

        if (resp?.data?.length > 0 && resp.data[0]?.user) {
          sessionStorage.setItem(
            "AuthUser",
            JSON.stringify(resp.data[0]?.user)
          );
          const obj: any = {
            name: resp.data[0].user.first_name || "Default Name", // Підстраховка на випадок відсутності значення
            last_name: resp.data[0].user.last_name || "Default Last Name",
          };

          sessionStorage.setItem("setting", JSON.stringify(obj));
          enqueueSnackbar(t("messages.login"), { variant: "success" });
        }

        if (resp?.data[0]?.user?.username === username) {
          const RoleALl = resp?.data[0]?.user?.role;

          if (RoleALl) {
            const ciphertext = CryptoJS.AES.encrypt(
              RoleALl,
              "secret-key"
            ).toString();
            sessionStorage.setItem("user", ciphertext);
          }

          const token = resp?.data[0]?.token;
          sessionStorage.setItem("AuthToken", `${token}`);
          setIsLoggedIn(true);
          enqueueSnackbar(t("messages.willkommen"), { variant: "info" });

          router.push("/dashboard");
        } else {
          enqueueSnackbar(t("messages.login-fehl"), { variant: "error" });
        }
      }
    } catch (error: unknown) {
      console.error("Fehler beim Login:", error);

      if (axios.isAxiosError(error)) {
        // Обробка HTTP-статусів
        if (error.response?.status === 401) {
          enqueueSnackbar(t("messages.ungult"), { variant: "warning" });
        } else if (error.response?.status === 500) {
          enqueueSnackbar(t("messages.serverfehler"), { variant: "error" });
        } else {
          enqueueSnackbar(
            error.response?.data?.message || t("messages.ein-unbekannter"),
            { variant: "error" }
          );
        }
      } else if (error instanceof Error) {
        enqueueSnackbar(error.message, { variant: "error" });
      } else {
        enqueueSnackbar(t("messages.netzwerkfehler"), { variant: "warning" });
      }
    }
  };

  return (
    <>
      <RefreshSessionTimeout time={time} />
      <ThemeToggleButton />
      <div
        className="locale-switcher-container"
        style={{ position: "absolute", top: "3px", right: "66px" }}
      >
        <LocaleSwitcher />
      </div>

      <Container maxWidth="sm" className="ContainerLogin">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Typography variant="h2" component="h2" gutterBottom>
            {t("login")}
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              label={t("username")}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label={t("password")}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              fullWidth
              margin="normal"
              variant="outlined"
              className="ContainerVisibility"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? (
                        <VisibilityOffIcon className="VisibilityOFF" />
                      ) : (
                        <VisibilityIcon className="VisibilityONN" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errorMessage && (
              <Typography
                color="error"
                variant="body2"
                style={{ marginTop: "8px" }}
              >
                {errorMessage}
              </Typography>
            )}

            <Box display="flex" justifyContent="space-between" width="100%">
              <Button
                variant="text"
                color="secondary"
                style={{
                  width: "35%",
                  marginBottom: "10px",
                  textAlign: "left",
                  fontSize: "12px",
                }}
                onClick={handlePasswordReset}
              >
                {t("passwort-vergessen")}
              </Button>

              <Button
                id="RegisterBtnOnLoginPage"
                style={{ width: "26%", fontSize: "12px", marginBottom: "10px" }}
                variant="text"
                color="secondary"
                onClick={handleRegistrierung}
              >
                {t("registrierung")}
              </Button>
            </Box>

            <Box display="flex" justifyContent="space-between" width="100%">
              <Link
                href="https://www.linkify.cloud/info"
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: "50%" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#050f32",
                  }}
                >
                  {t("return-to-the-info-page")}
                </Button>
              </Link>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ width: "50%", marginLeft: "15px" }}
              >
                {t("login")}
              </Button>
            </Box>

            <Box display="flex" justifyContent="space-between" width="100%">
              <Link
                href="https://www.linkify.cloud/fragen"
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: "100%", textAlign: "center" }}
                sx={{ marginTop: "50px" }}
              >
                <Button
                  id="RegisterBtnOnLoginPage"
                  style={{ width: "26%", fontSize: "14px", margin: "auto" }}
                  variant="text"
                  color="secondary"
                >
                  {t("question")}
                </Button>
              </Link>
            </Box>
          </form>

          {isLoggedIn && timeRemaining !== null && (
            <Typography variant="body1" style={{ marginTop: "20px" }}>
              {t("messages.verblei")} {Math.floor(timeRemaining / 1000)}{" "}
              {t("messages.sekunden")}
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Login;
