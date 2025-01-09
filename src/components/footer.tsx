
"use client"
import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Modal, Button, Container } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { enqueueSnackbar } from "notistack";
import apiService from "@/app/services/apiService";

import { useRouter } from 'next/navigation';



interface FooterProps {
  footerPosition?: string | number;
  footerIndex?: string | number;
  borderTop?: string | number;
}

type UserType = {
  id: number;
  tenant_id: number;
  first_name: string;
  last_name: string;
  language: string;
  username: string;
  contact_phone: string;
  email: string;
  role: string;
  is_active: boolean;
  created_by: number | null;
  updated_by: number | null;
  created_at: string; // ISO 8601 формат для дати
  updated_at: string; // ISO 8601 формат для дати
  deleted_at: string | null; // може бути null або рядок для дати
}

// token_expires add time resresh

const Timeout = parseInt(process.env.NEXT_PUBLIC_APP_TIMEOUT || "300", 10);
const LogoutViewTimer = parseInt(process.env.NEXT_PUBLIC_APP_LOGOUT_VIEW_TIMER || "20", 10);

const Footer: React.FC = () => {
  const router = useRouter();
  const [User, setUser] = useState<UserType>();
  const [footerVisible, setFooterVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState({
    user: false,
    time: false,
    licInfo: false,
    objectPage: false,
  });
  const [arrowDirection, setArrowDirection] = useState({
    user: 'up',
    time: 'up',
    licInfo: 'up',
    objectPage: 'up',
  });

  const login_timeout = !User ? '200' : '300'
  const page_refresh_time = !User ? '300' : '300'
  const display_name = !User ? 'user' : '100'
  const id = !User ? '1' : '100'
  const [count, setCount] = useState<number>(Number(login_timeout));
  const [refresh, setRefresh] = useState<number>(Number(page_refresh_time));

  const handleTooltipToggle = (key: keyof typeof tooltipVisible) => {
    setTooltipVisible((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleArrowToggle = (key: keyof typeof arrowDirection) => {
    setArrowDirection((prevState) => ({
      ...prevState,
      [key]: prevState[key] === 'up' ? 'down' : 'up',
    }));
  };


  // const [counter, setCounter] = useState(Timeout);
  // const [showModal, setShowModal] = useState(false);
  const getSharedObject = () => {
    const storedSetting = sessionStorage.getItem("setting");
    if (storedSetting) {
      try {
        return JSON.parse(storedSetting); // Парсимо JSON
      } catch (error) {
        console.error("Помилка парсингу JSON із sessionStorage:", error);
        return {}; // Повертаємо порожній об'єкт у разі помилки
      }
    }
    return {}; // Повертаємо порожній об'єкт, якщо дані відсутні
  };

  const [sharedObject, setSharedObject] = useState(getSharedObject());



  // const resetTimer = useCallback(() => {
  //   setCounter(Timeout);
  //   setShowModal(false);
  //   setCounter(Timeout);
  //   setShowModal(false);
  // }, []);

  // const handleLogoutLocal = () => {
  //   sessionStorage.clear();
  //   localStorage.clear();
  //   window.location.href = "/login";
  // };

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCounter((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(timer);
  //         handleLogoutLocal();
  //         return 0;
  //       }
  //       if (prev <= LogoutViewTimer) setShowModal(true);
  //       return prev - 1;
  //     });
  //   }, 1000);

  //   window.addEventListener("mousemove", resetTimer);

  //   return () => {
  //     clearInterval(timer);
  //     window.removeEventListener("mousemove", resetTimer);
  //   };
  // }, [resetTimer]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount: number) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [login_timeout]);

  useEffect(() => {
    if (refresh > 0) {
      const timerRefresh = setInterval(() => {
        setRefresh(refresh - 1);
      }, 1000);
      return () => clearInterval(timerRefresh);
    }
  }, [refresh]);


  const handleLogout = async () => {
    const getToken: any = sessionStorage.getItem('AuthToken');
    if (!getToken) {
      enqueueSnackbar("Kein Token gefunden. Automatisches Weiterleiten zur Login-Seite.", {
        variant: "warning"
      });
      router.push("/login");
      sessionStorage.clear();
      return;
    }
    try {
      await apiService.get(`user/logout`, getToken);
      enqueueSnackbar("Logout erfolgreich!", {
        variant: "success"
      });

    } catch (error) {
      enqueueSnackbar("Fehler beim Logout. Bitte versuchen Sie es später erneut.", {
        variant: "error"
      });
    }

    router.push("/login");
    sessionStorage.clear()
  };


  useEffect(() => {
    if (count !== 0) {
      if (refresh <= (refresh * 90) / 100) {
        // handleLogout()

        setRefresh(Number(page_refresh_time))
      }
    }
  }, [refresh, page_refresh_time, count]);


  const handleMouseMove = useCallback(() => {
    setCount(Number(login_timeout));
  }, [login_timeout]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  



  useEffect(() => {
    const userObj: any = sessionStorage.getItem('AuthUser')
    const user: UserType = JSON.parse(userObj)

    setUser(user)

    if (count === 1) {
      router.push("/login");
      sessionStorage.clear()
    }
  }, [count])



  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1976d2",
        color: "#fff",
        position: "fixed",
        bottom: "0",
        minWidth: "100%",
        minHeight: "auto",
        // zIndex: footerIndex,
        // left: footerPosition,
        // transition: "left 0.23s ease",
        // borderTop: borderTop,
      }}

    >
      <Container maxWidth="lg" sx={{ margin: 0, padding: 0, width: "100vw" }}>
        {/* Social Media Links */}


        <Box
          width={"100vw"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant="body2" sx={{ color: "#fff", }} className="FooterLorem">
            hi - {sharedObject.name}  {sharedObject.last_name}
          </Typography>
        </Box>
      </Container>

      {/* Kann hier Im Footer Countdown Anzeigen */}
      {/* {isDebugON && (
        <Box sx={{ textAlign: "center", zIndex: 9999 }}>
          <Typography variant="body2" sx={{ color: "#fff" }}>
            Timeout: {counter} Sekunden
          </Typography>
        </Box>
      )} */}

      <>
        {/* Modal for inactivity warning */}


        {/* Fixed Footer */}
        <Button
          variant="contained"
          sx={{
            position: 'fixed',
            bottom: 68,
            right: 0,
            backgroundColor: '#007BFF',
            borderRadius: 0,
            zIndex: 9999,
            padding: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 'auto',
            minWidth: '80px',
            minHeight: '47px',
            maxWidth: '100px',
            maxHeight: '47px',
            transition: 'width 0.3s ease',
            '@media (max-width: 600px)': {
              minWidth: '60px',
              maxWidth: '80px',
              right: '-10px',
            },
            '@media (max-width: 400px)': {
              minWidth: '50px',
              maxWidth: '60px',
              right: '-20px',
            },
          }}
          onClick={() => setFooterVisible(!footerVisible)}
        >
          {footerVisible ? <ArrowForwardIcon sx={{ color: 'white', marginRight: 'auto' }} /> : <ArrowBackIcon sx={{ color: 'white', marginRight: 'auto' }} />}
        </Button>

        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#1976D2',
            color: 'white',
            padding: 2,
            transform: footerVisible ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.5s ease',
            visibility: footerVisible ? 'visible' : 'hidden',
            zIndex: 9998,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
            {/* Tooltip Buttons */}
            <Tooltip title={<div>
              <p>email: {User?.email || 'Немає email'}</p>
              <p>first_name: {User?.first_name || 'Немає імені'}</p>
              <p>role: {User?.role || 'Немає ролі'}</p>
            </div>} placement="top" open={tooltipVisible.user}>
              <Button
                variant="text"
                color="inherit"
                onClick={() => {
                  handleTooltipToggle('user');
                  handleArrowToggle('user');
                }}
                sx={{
                  textTransform: 'capitalize',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                USER
                {arrowDirection.user === 'up' ? <ArrowUpwardIcon sx={{ color: 'white', marginLeft: 1 }} /> : <ArrowDownwardIcon sx={{ color: 'white', marginLeft: 1 }} />}
              </Button>
            </Tooltip>

            <Tooltip title=
            {<div>
              <p>Logout: {count || '0'}</p>
              <p>refresh: {refresh || '0'}</p>
             
            </div>} placement="top" open={tooltipVisible.time}>
              <Button
                variant="text"
                color="inherit"
                onClick={() => {
                  handleTooltipToggle('time');
                  handleArrowToggle('time');
                }}
                sx={{
                  textTransform: 'capitalize',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                TIME
                {arrowDirection.time === 'up' ? <ArrowUpwardIcon sx={{ color: 'white', marginLeft: 1 }} /> : <ArrowDownwardIcon sx={{ color: 'white', marginLeft: 1 }} />}
              </Button>
            </Tooltip>

            {/* <Tooltip title="License Info" placement="top" open={tooltipVisible.licInfo}>
              <Button
                variant="text"
                color="inherit"
                onClick={() => {
                  handleTooltipToggle('licInfo');
                  handleArrowToggle('licInfo');
                }}
                sx={{
                  textTransform: 'capitalize',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                LIC INFO
                {arrowDirection.licInfo === 'up' ? <ArrowUpwardIcon sx={{ color: 'white', marginLeft: 1 }} /> : <ArrowDownwardIcon sx={{ color: 'white', marginLeft: 1 }} />}
              </Button>
            </Tooltip> */}

            <Tooltip title={
              <div>
                <p>email: {User?.email || 'Немає email'}</p>
                <p>first_name: {User?.first_name || 'Немає імені'}</p>
                <p>created_at: {User?.created_at || 'Немає ролі'}</p>
                <p>is_active: {User?.is_active || 'Немає ролі'}</p>
                <p>language: {User?.language || 'Немає ролі'}</p>
                <p>tenant_id: {User?.tenant_id || 'Немає ролі'}</p>
                <p>id: {User?.id || 'Немає ролі'}</p>
                <p>username: {User?.username || 'Немає ролі'}</p>

              </div>
            } placement="top" open={tooltipVisible.objectPage}>
              <Button
                variant="text"
                color="inherit"
                onClick={() => {
                  handleTooltipToggle('objectPage');
                  handleArrowToggle('objectPage');
                }}
                sx={{
                  textTransform: 'capitalize',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                OBJECT PAGE
                {arrowDirection.objectPage === 'up' ? <ArrowUpwardIcon sx={{ color: 'white', marginLeft: 1 }} /> : <ArrowDownwardIcon sx={{ color: 'white', marginLeft: 1 }} />}
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </>
    </Box>
  );
};

export default Footer;
