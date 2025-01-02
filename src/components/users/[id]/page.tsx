"use client"

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  language: string;
  username: string;
  contact_phone: number;
  email: string;
  role: string;
  is_active: boolean;
};

const UserDetail: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>("");
  const [updatedUser, setUpdatedUser] = useState<User>({
    id: 0,
    first_name: "",
    last_name: "",
    language: "",
    username: "",
    contact_phone: 0,
    email: "",
    role: "",
    is_active: false
  });
  const [users, setUser] = useState<User[]>([]);

  useEffect(() => {
    const fetchElements = async () => {
      if (!id) {
        setError("Keine gültige ID angegeben.");
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}user/${id}`);
        if (response.status === 200) {
          setUser([response.data]);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        setError("Fehler beim Abrufen der Daten.");
      }
    };

    fetchElements();
  }, [id]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUser({
      ...updatedUser,
      [name]: value,
    });
  };

  const validateInputs = () => {
    if (
      !updatedUser.first_name ||
      !updatedUser.last_name ||
      !updatedUser.language ||
      !updatedUser.username ||
      !updatedUser.contact_phone ||
      !updatedUser.email
    ) {
      setError("Alle Felder müssen ausgefüllt werden.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSaveChanges = async () => {
    if (validateInputs()) {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}user/${updatedUser?.id}`,
          updatedUser
        );
        if (response.status === 200) {
          console.log("Benutzerdaten gespeichert:", updatedUser);
          setIsEditing(false);
        }
      } catch (error) {
        setError("Fehler beim Speichern:" + error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}user/${updatedUser?.id}`
      );
      if (response.status === 200) {
        console.log("Benutzer gelöscht:", updatedUser);
        router.push("/users");
      }
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    }
  };

  const handleGoingBack = () => {
    router.back();
  };

  return (
    <div id="UserDetailContainer">
      <Typography variant="h3" gutterBottom>
        Benutzer Details
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="UserDetailTableHeader">Feld</TableCell>
              <TableCell className="UserDetailTableHeader">Wert</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.language}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.contact_phone}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.is_active ? 'Ja' : 'Nein'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "10px" }}>
        <Button
          variant="contained"
          color="primary"
          title="Bearbeiten"
          onClick={() => setIsEditing(true)}
          startIcon={<EditIcon />}
        >
          Bearbeiten
        </Button>
        <Button
          variant="contained"
          color="secondary"
          title="Löschen"
          onClick={handleDelete}
          startIcon={<DeleteIcon />}
        >
          Löschen
        </Button>
      </div>

      <div id="UserDetailModalContainer">
        <Button
          variant="outlined"
          onClick={handleGoingBack}
          startIcon={<KeyboardBackspaceIcon />}
        >
          Zurück
        </Button>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
          <DialogTitle>Benutzerdaten bearbeiten</DialogTitle>
          <DialogContent>
            {error && <Typography color="error">{error}</Typography>}

            <TextField
              label="Username *"
              name="username"
              value={updatedUser?.username}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              label="Vorname:"
              name="first_name"
              value={updatedUser?.first_name}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Nachname:"
              name="last_name"
              value={updatedUser?.last_name}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Sprache:"
              name="language"
              value={updatedUser?.language}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Kontaktnummer *"
              name="contact_phone"
              value={updatedUser?.contact_phone}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Email *"
              name="email"
              value={updatedUser?.email}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Role:"
              name="role"
              value={updatedUser?.role}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSaveChanges} color="primary" startIcon={<AddIcon />}>
              Speichern
            </Button>
            <Button onClick={() => setIsEditing(false)} color="secondary" startIcon={<CancelIcon />}>
              Abbrechen
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default UserDetail;
