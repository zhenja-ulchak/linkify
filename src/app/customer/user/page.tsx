"use client"

import React, { useEffect, useState } from 'react';
import ApiService from "../../services/apiService";
import { useTranslations } from 'next-intl';
import { Box, Typography, List, ListItem } from '@mui/material';

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
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>
        {t("user-list")}
      </Typography>
      <List>
        {users.map(user => (
          <ListItem key={user.id}>
            {user.username}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserList;
