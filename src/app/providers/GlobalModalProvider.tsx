import React, { createContext, useContext, useState, useEffect } from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import CloseIcon from "@mui/icons-material/Close";
// Context for modal state
const GlobalModalContext = createContext({
  open: false,
  setOpen: (open: boolean) => {},
});

export const GlobalModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkCertificateExpiry = async () => {
      // Replace with your API call or logic to fetch certificate expiry date
      const certificateExpiryDate = new Date("2024-02-15"); // Example date
      const today = new Date();
      const timeDifference = certificateExpiryDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

      if (daysRemaining <= 0) {
        setOpen(true);
      }
    };

    checkCertificateExpiry();
  }, []);

  return (
    <GlobalModalContext.Provider value={{ open, setOpen }}>
      {children}
      <Modal open={open} onClose={() => setOpen(false)}>
      <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#f8f9fa",
            boxShadow: 24,
            borderRadius: "8px",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
             LINKIFY
            </Typography>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              sx={{ color: "#fff" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ padding: "24px" }}>
            <Typography variant="h6" gutterBottom>
            У вас заканчивается время сертификата


            </Typography>
            <Typography variant="body1" gutterBottom>
            Хотите ли вы продолжить время сертификата?
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpen(false)}
              sx={{ marginTop: "16px", marginRight:'20px' }}
            >
             Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => setOpen(false)}
              sx={{ marginTop: "16px" }}
            >
             Agree
            </Button>
          </Box>
        </Box>
      </Modal>
    </GlobalModalContext.Provider>
  );
};