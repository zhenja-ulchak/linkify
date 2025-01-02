import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Modal, Button } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; 
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; 
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 

const Timeout = parseInt(process.env.NEXT_PUBLIC_APP_TIMEOUT || "300", 10);
const LogoutViewTimer = parseInt(process.env.NEXT_PUBLIC_APP_LOGOUT_VIEW_TIMER || "20", 10);

const Footer: React.FC = () => {
  const [counter, setCounter] = useState(Timeout); 
  const [showModal, setShowModal] = useState(false); 
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

  const resetTimer = useCallback(() => {
    setCounter(Timeout); 
    setShowModal(false); 
  }, []);

  const handleLogoutLocal = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(timer); 
          handleLogoutLocal();
          return 0;
        }
        if (prev <= LogoutViewTimer) setShowModal(true);
        return prev - 1;
      });
    }, 1000);

    window.addEventListener("mousemove", resetTimer);

    return () => {
      clearInterval(timer);
      window.removeEventListener("mousemove", resetTimer);
    };
  }, [resetTimer]);

  return (
    <>
      {/* Modal for inactivity warning */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="textPrimary" gutterBottom>
            Inaktivität erkannt
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={2}>
            Du wirst in {counter} Sekunden ausgeloggt!
          </Typography>
          <Button variant="contained" color="primary" onClick={resetTimer}>
            Aktiv bleiben
          </Button>
        </Box>
      </Modal>

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
          <Tooltip title="User Info" placement="top" open={tooltipVisible.user}>
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

          <Tooltip title="Time Info" placement="top" open={tooltipVisible.time}>
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

          <Tooltip title="License Info" placement="top" open={tooltipVisible.licInfo}>
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
          </Tooltip>

          <Tooltip title="Object Page Info" placement="top" open={tooltipVisible.objectPage}>
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
  );
};

export default Footer;
