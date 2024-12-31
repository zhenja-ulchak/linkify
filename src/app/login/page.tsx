"use client"

import { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ApiService from "../services/apiService";
// @ts-expect-error
import CryptoJS from 'crypto-js';


const Login: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState("super.admin@tenant2.com"); // super.admin@tenant2.com superadmin
  const [password, setPassword] = useState("password123");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Track login status
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // State to track the remaining time

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
      const resp = await ApiService.login<{ data: { user: {
        [x: string]: string; username: string 
} } }>(username, password);
    
      if (resp?.data?.user?.username === username) {
      
        if(resp.data.user.role){
          
          const ciphertext = CryptoJS.AES.encrypt(resp.data.user.role, 'secret-key').toString();
          sessionStorage.setItem('user', ciphertext);
        }
         // @ts-expect-error
        const token = resp.data.token
        sessionStorage.setItem('AuthToken', `${token}`)
        setIsLoggedIn(true);
       

        if ( resp.data.user.role === "admin") {
          router.push('/dashboard/admin'); // Редирект на адмін панель
        } else if (resp.data.user.role === "super_admin") {
          router.push('/dashboard/super-admin'); // Редирект на супер адмін панель
        } else if (resp.data.user.role === "user") {
          router.push('/dashboard/user'); // Редирект на панель користувача
        } else {
          router.push("/dashboard");
        }


      } else {
        setErrorMessage("Login fehlgeschlagen. Bitte überprüfen Sie Ihre Daten.");
      }
    } catch (error) {
      console.error("Fehler beim Login:", error);
      if (axios.isAxiosError(error)) 
        { if (error.response?.status === 401) 
          { setErrorMessage("Ungültige Anmeldedaten."); } 
          else if (error.response?.status === 500) 
            { setErrorMessage("Serverfehler. Bitte später erneut versuchen."); } 
          else { setErrorMessage(error.response?.data?.message || "Ein unbekannter Fehler ist aufgetreten."); } 
        } else { setErrorMessage("Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung."); }

    }
  }

  // Memoize loginRefresh function using useCallback
  const loginRefresh = useCallback(async () => {
    if (isLoggedIn) {
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}user/login-refresh`,
          { withCredentials: true }
        );
        console.log("Login Refresh erfolgreich!");
      } catch (error) {
        console.error("Fehler beim Refresh:", error);
      }
    }
  }, [isLoggedIn]);


  useEffect(() => {
    let timer: NodeJS.Timeout;
    const sessionTimeout = 3600000; // Beispiel für eine 1-Stunden-Sitzung (3600000ms)
    const refreshThreshold = sessionTimeout * 0.9; // 90% der Sitzung

    if (isLoggedIn) {
      timer = setInterval(() => {
        const currentTime = Date.now();
        const sessionRemaining = sessionTimeout - (currentTime % sessionTimeout);
        setTimeRemaining(sessionRemaining); // Update the time remaining

        if (sessionRemaining <= refreshThreshold) {
          loginRefresh(); // Login-Refresh ausführen, wenn 90% erreicht sind
        }
      }, 1000); // Alle 1 Sekunde den verbleibenden Zeitraum prüfen

      return () => clearInterval(timer);
    }

    return undefined;
  }, [isLoggedIn, loginRefresh]);

  return (
    <>
      <Button
        id="RegisterBtnOnLoginPage"
        sx={{ float: "right", marginTop: "10px", marginRight: "10px" }}
        variant="outlined"
        onClick={handleRegistrierung}
      >
        Registrierung
      </Button>

      <Container maxWidth="sm" className="ContainerLogin">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Typography variant="h2" component="h2" gutterBottom>
            Login
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Password"
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

            <Box display="flex" justifyContent="space-between" width="100%" mt={2}>
              <Button
                variant="text"
                color="secondary"
                style={{ width: "40%" }}
                onClick={handlePasswordReset}
              >
                Passwort vergessen?
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ width: "60%" }}
              >
                Login22211
              </Button>
            </Box>
          </form>

          {isLoggedIn && timeRemaining !== null && (
            <Typography variant="body1" style={{ marginTop: "20px" }}>
              Verbleibende Zeit: {Math.floor(timeRemaining / 1000)} Sekunden
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Login;
