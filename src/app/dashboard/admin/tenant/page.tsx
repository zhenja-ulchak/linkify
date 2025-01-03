"use client";

import EnhancedTable from "../../../../components/tenant/TableTenant";




export default function AdminTenant() {
const CrudReadonly = false
  return (<>
    <EnhancedTable CrudReadonly={CrudReadonly}  />
  </>)

}