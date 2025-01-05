"use client"

import React, { useEffect, useState } from 'react';
import ApiService from "../../services/apiService";
import DocumentTable from '@/components/DocumentTable';


type User = { id: number; username: string; }

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);


  useEffect(() => {
    const getToken: any = sessionStorage.getItem('AuthToken')

    const fetchUsers = async () => {
      try {
        const resp: any = await ApiService.get("user", getToken);
        const users: any = resp.data[0];
        console.log(users);
        
        setUsers(users);
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>

      <DocumentTable></DocumentTable>

    </div>
  );
};

export default UserList;
