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
import ApiService from "../../../../src/app/services/apiService";
import { useTranslations } from 'next-intl';
import { enqueueSnackbar } from "notistack";
import ConfirmDeleteModal from '@/components/modal/ConfirmDeleteModal';

type User = {
  id?: number;
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
  const Auth: any = sessionStorage.getItem('AuthToken')

  const { id } = useParams();
  const router = useRouter();
  const t = useTranslations('API');
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>("");
  const [updatedUser, setUpdatedUser] = useState<User>({

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


      const response: any = await ApiService.get(`/user/${id}`, Auth);
      if (response.status === 200) {
        enqueueSnackbar(`Details for user ID ${id} fetched successfully!`, { variant: 'success' });
        setUser([response.data]);
      }
      if (response instanceof Error) {
        const { status, variant, message } = ApiService.CheckAndShow(response, t);
        console.log(message);
        // @ts-ignore
        enqueueSnackbar(message, { variant: variant });
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

      const response: any = await ApiService.put(
        `user/${updatedUser?.id}`,
        updatedUser, Auth
      );
      if (response.status === 200) {
        enqueueSnackbar('New user created successfully!', { variant: 'success' });
        setIsEditing(false);
      }

      if (response instanceof Error) {
        const { status, variant, message } = ApiService.CheckAndShow(response, t);
        console.log(message);
        // @ts-ignore
        enqueueSnackbar(message, { variant: variant });
        setIsEditing(false)
      }
    }
  };

  const handleDelete = async () => {

    const response: any = await ApiService.delete(
      `user/${updatedUser?.id}`, Auth
    );
    if (response.status === 200) {
      enqueueSnackbar(`User ID ${id} deleted successfully!`, { variant: 'success' });
      router.push("/users");

    }
    if (response instanceof Error) {
      const { status, variant, message } = ApiService.CheckAndShow(response, t);
      console.log(message);
      // @ts-ignore
      enqueueSnackbar(message, { variant: variant });
    };
  }
  const handleGoingBack = () => {
    router.back();
  };

  const handleOpenModal = () => {

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);

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
          onClick={handleOpenModal}
          startIcon={<DeleteIcon />}
        >
          Löschen
        </Button>
      </div>
      <ConfirmDeleteModal
        open={openModal}
        title="Delete"
        handleDelete={handleDelete}
        onClose={handleCloseModal}
        description={"Are you sure you want to delete User?"}

      />
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
