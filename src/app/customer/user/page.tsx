"use client"

import React, { useEffect, useState } from 'react';
import ApiService from "../../services/apiService";



type User = { id: number; username: string; }

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);

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
    <div>
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
