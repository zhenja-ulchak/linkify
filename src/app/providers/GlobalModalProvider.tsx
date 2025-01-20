import React, { createContext, useContext, useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Context for dialog state
const GlobalDialogContext = createContext({
  open: false,
  setOpen: (open: boolean) => {},
});

export const GlobalModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkCertificateExpiry = async () => {
      const userObj: any = sessionStorage.getItem("tenant");
      const certificateExpiryDate = new Date(userObj);
      const today = new Date();
      const timeDifference = certificateExpiryDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

      if (daysRemaining) {
        setOpen(true);
      }
    };

    checkCertificateExpiry();
  }, []);

  return (
    <GlobalDialogContext.Provider value={{ open, setOpen }}>
      {children}
      <Dialog open={true} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            LINKIFY
          </Typography>
          <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "#000" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: "24px" }}>
          <Typography variant="h6" gutterBottom>
            У вас заканчивается время сертификата
          </Typography>
          <Typography variant="body1" gutterBottom>
            Хотите ли вы продолжить время сертификата?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: "16px" }}>
          <Button onClick={() => setOpen(false)} color="secondary" sx={{ marginRight: "20px" }}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)} color="primary">
            Сontinue
          </Button>
        </DialogActions>
      </Dialog>
    </GlobalDialogContext.Provider>
  );
};
