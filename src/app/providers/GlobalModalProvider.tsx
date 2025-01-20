import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  Box,
  CardContent,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import apiService from "../services/apiService";
import { enqueueSnackbar } from "notistack";
import { useTranslations } from "next-intl";
import { UserType } from "@/type/UserType";
import { TenantType } from "@/type/TenantType";

// Context for dialog state
const GlobalDialogContext = createContext({
  open: false,
  setOpen: (open: boolean) => {},
});

export const GlobalModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState<number>();

  const t = useTranslations("API");
  const name: string | null = sessionStorage.getItem("setting");
  const nameFirstLast: { [key: string]: any } | null = name ? JSON.parse(name) : null;
  
  const tenantObj: string | null = sessionStorage.getItem("tenant");
  const tenant: TenantType | null = tenantObj ? JSON.parse(tenantObj) : null;
  
  const userObj: string | null = sessionStorage.getItem("AuthUser");
  const user: UserType = userObj ? JSON.parse(userObj) : null;
  
  const serviceRenewalGet = async () => {
     const getToken: any = sessionStorage.getItem("AuthToken");
          const response: any = await apiService.post(
            "accounting-software",
            {"username": `${user.username}`},
            getToken
          );
          if (response instanceof Error) {
            const { status, variant, message } = apiService.CheckAndShow(
              response,
              t
            );
            // @ts-ignore
            enqueueSnackbar(message, { variant: variant });
          }
          if (response.status === 200 || response.success === true) {
            enqueueSnackbar(t("accounting-data-fetched-successfully"), {
              variant: "success",
            });
          }
  };

  useEffect(() => {
    const checkCertificateExpiry = async () => {
      const certificateExpiryDate = new Date(tenant?.license_valid_until ? tenant?.license_valid_until : '');
      const today = new Date();
      const timeDifference = certificateExpiryDate.getTime() - today.getTime();
      const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      console.log(daysRemaining);
      setDay(daysRemaining);
      if (daysRemaining <= 30) {
        setOpen(true);
      }
    };

    checkCertificateExpiry();
  }, []);

  return (
    <GlobalDialogContext.Provider value={{ open, setOpen }}>
      {children}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            linkify
          </Typography>
          <IconButton
            size="small"
            onClick={() => setOpen(false)}
            sx={{ color: "#000" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: "24px" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontSize: 16 }}>
              {t("greeting")} {nameFirstLast?.last_name} {nameFirstLast?.name}
              {/* Greeting */}
            </Typography>
            <Divider />
            <Typography variant="h6" component="div" sx={{ mt: 1.5, mb: 1.5 }}>
              {t("certificate_expiration")}
            </Typography>
            <Divider />
            <Typography
              variant="subtitle1"
              sx={{ color: "text.secondary", mt: 1.5 }}
            >
              {t("active_until")} {tenant?.license_valid_until}
              {/* Active until */}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
              {t("days_left")} {day}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "text.secondary", mb: 1.5 }}
            >
              {t("tariff")} {tenant?.tariff}
            </Typography>
            <Divider />
            <Typography variant="h6" sx={{ mt: 1.5 }}>
              {t("renewal_question")}
            </Typography>
          </CardContent>
        </DialogContent>
        <DialogActions sx={{ padding: "16px" }}>
          <Button
            onClick={() => setOpen(false)}
            color="secondary"
            sx={{ marginRight: "20px" }}
          >
            {t("cancel")} {/* Cancel */}
          </Button>
          <Button onClick={serviceRenewalGet} color="primary">
            {t("continue")} {/* Continue */}
          </Button>
        </DialogActions>
      </Dialog>
    </GlobalDialogContext.Provider>
  );
};
