"use client";

import TableHelperDmsConfig from "../../../../components/DmsConfig";

import { useTranslations } from 'next-intl';


export default function SuperAdminTenant() {
   const t = useTranslations('API');
  return (<>
    <TableHelperDmsConfig  title={t('einstellungen.dms-anpassen')}/>
  </>)

}