"use client";

import EnhancedTable from "../../../../components/tenant/TableTenant";




export default function SuperAdminTenant() {
const CrudReadonly = true
  return (<>
    <EnhancedTable CrudReadonly={CrudReadonly}  />
  </>)

}