"use client";
import React from "react";
import { useTranslations } from "next-intl";

const DashboardPage = () => {
  const t = useTranslations("Dashboard");
  return (
    <div id="ContainerDashboard">
      <h1>{t("dashboard")}</h1>

      <p
        style={{
          margin: "0",
          textAlign: "center",
        }}
      >
         {t("welcome-message")}
      </p>
    </div>
  );
};
// ----------
export default DashboardPage;
