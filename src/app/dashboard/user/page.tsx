"use client";

import React, { useEffect, useState } from "react";
import ApiService from "../../services/apiService";
import DocumentTable from "@/components/DocumentTable";

type User = { id: number; username: string };

const UserList = () => {
  return (
    <div>
      <DocumentTable></DocumentTable>
    </div>
  );
};

export default UserList;
