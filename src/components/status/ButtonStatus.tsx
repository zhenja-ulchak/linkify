"use client";
import { useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import ApiService from "../../../src/app/services/apiService";
import { useTranslations } from "next-intl";
import ReplayIcon from '@mui/icons-material/Replay';


type ButtonStatusType = {
  Url: string;
  textOnline?: string;
  textOffline?: string;
  isLoadPage: boolean;
};

const ButtonStatusCheck = ({
  Url,
  textOnline,
  textOffline,
  isLoadPage,
}: ButtonStatusType) => {
  const [isText, setIsText] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("API");



  const StatusCheck = async () => {
    setIsLoading(true); // Починаємо завантаження
    try {
      const Auth: any = sessionStorage.getItem("AuthToken");
      const response: any = await ApiService.get(Url, Auth);

      if (response instanceof Error) {
        const { status, variant, message } = ApiService.CheckAndShow(
          response,
          t
        );

        if (status === 404) {
          console.log(404);
        } else {
          // @ts-ignore
          enqueueSnackbar(message, { variant: variant });
        }
      }

      if (response.status === 200 || response.success) {
        enqueueSnackbar(t("ONLINE"), { variant: "success" });
        setIsText(response.data.message === "The service is online.");
      } else {
        setIsText(false);
      }
    } catch (error) {
      console.error("Error during status check:", error);
      enqueueSnackbar(t("OFFLINE"), { variant: "error" });
      setIsText(false);
    } finally {
      setIsLoading(false); // Завершення завантаження
    }
  };
  useEffect(() => {
    if (isLoadPage) {
      StatusCheck();
    }
  }, [isLoadPage]);

  return (
    <>
      <Button
        variant="contained"
        color={isText ? "success" : "error"}
        onClick={StatusCheck}
        disabled={isLoading} // Вимикаємо кнопку під час завантаження
        startIcon={
          isLoading ? <CircularProgress size={20} color="inherit" /> : <ReplayIcon/>
        } // Іконка лоадера замість тексту
      >
        {isLoading ? t("LOADING") : isText ? t(`${textOnline}`) : t(`${textOffline}`)}
      </Button>
    </>
  );
};

export default ButtonStatusCheck;
