"use client"

import React, { useEffect, useState } from 'react';
import ApiService from "../../services/apiService";
import { useTranslations } from 'next-intl';


type User = { id: number; username: string; }

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
const t = useTranslations('User-list');
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const resp = await ApiService.get<{ data: { users: User[] } }>("user");
        const users: User[] = resp.data.users;
        setUsers(users);
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      flexDirection: 'column', 
    }}>
      <h1>{t("user-list")}</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
