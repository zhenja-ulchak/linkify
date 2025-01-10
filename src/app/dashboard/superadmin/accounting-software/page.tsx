"use client";

import TableHelperAccountingSoftwar from "../../../../components/AccountingSoftware";
import { useTranslations } from 'next-intl';



export default function SuperAdminTenant() {
  const t = useTranslations('API');
  return (<>
   {/* <SnackbarProvider maxSnack={3}>
      <Component {...pageProps} />
    </SnackbarProvider> */}
    <TableHelperAccountingSoftwar  title={t('einstellungen.accounting-software')}/>
  </>)

}