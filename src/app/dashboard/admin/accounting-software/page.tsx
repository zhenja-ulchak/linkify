"use client";

import TableHelperAccountingSoftwar from "../../../../components/AccountingSoftware";
import { useTranslations } from "next-intl";

export default function SuperAdminTenant() {
  const t = useTranslations("API");
  return (
    <>
      <div>
        <TableHelperAccountingSoftwar
          title={t("einstellungen.accounting-software")}
        />
      </div>
    </>
  );
}
