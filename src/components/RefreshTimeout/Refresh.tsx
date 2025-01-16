"use client";
import { enqueueSnackbar } from "notistack";
import React, { useState, useEffect, useCallback } from "react";
import apiService from "@/app/services/apiService";
import { useTranslations } from "next-intl";

type TimeType = {
  time: number | undefined;
};

const RefreshSessionTimeout = ({ time }: TimeType) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Змінна для перевірки, чи користувач увійшов в систему
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now()); // Час останньої активності
  const t = useTranslations("API");

  const loginRefresh = useCallback(async () => {
    if (isLoggedIn) {
      const getToken: any = sessionStorage.getItem("AuthToken");
      const response: any = await apiService.get(
        "user/login-refresh",
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
        enqueueSnackbar(t("change-password"), { variant: "success" });
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const targetTime: number | undefined = time; // Майбутній timestamp у секундах (наприклад, через 1 годину)

    const handleActivity = () => {
      setLastActivityTime(Date.now()); // Оновлюємо час останньої активності
    };

    // Відслідковуємо рухи миші та натискання клавіші
    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keydown", handleActivity);

    const currentTime = Math.floor(Date.now() / 1000);

    // @ts-ignore
    if (currentTime >= targetTime) {
      // loginRefresh(); // Оновлення сесії
    }

    return () => {
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("keydown", handleActivity);
    };
  }, [isLoggedIn, lastActivityTime, loginRefresh]);
  return <div></div>;
};

export default RefreshSessionTimeout;
