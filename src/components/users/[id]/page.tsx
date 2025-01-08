"use client"

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid, IconButton, Box } from "@mui/material";
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
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
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
  const [users, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchElements = async () => {
      if (!id) {
        setError("Keine gültige ID angegeben.");
        return;
      }


      const response: any = await ApiService.get(`/user/${id}`, Auth);
      console.log(response.data[0]);
      setUser(response.data[0][0]);
      if (response.status === 200) {
        enqueueSnackbar(`Details for user ID ${id} fetched successfully!`, { variant: 'success' });



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

  const handleOpenModalUpdate = () => {

    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);

  };

  const handleOpenModal = () => {

    setOpenModalConfirm(true);
  };

  return (
    <>

      <div id="UserDetailContainer" style={{ display: 'flex', justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>


        <Grid container spacing={2} style={{ width: '100%' }}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <h3>DMS Config Details</h3>
          </Grid>



          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="UserDetailTableHeader">Feld</TableCell>
                    <TableCell className="UserDetailTableHeader">Wert</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users && (
                    <>

                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell>{users.id}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>Vorname</TableCell>
                        <TableCell>{users.first_name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>Nachname</TableCell>
                        <TableCell>{users.last_name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>Sprache</TableCell>
                        <TableCell>{users.language}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>Benutzername</TableCell>
                        <TableCell>{users.username}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>Telefon</TableCell>
                        <TableCell>{users.contact_phone}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>E-Mail</TableCell>
                        <TableCell>{users.email}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>Rolle</TableCell>
                        <TableCell>{users.role}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>Aktiv</TableCell>
                        <TableCell>{users.is_active ? 'Ja' : 'Nein'}</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="space-evenly">
            <IconButton color="primary" onClick={handleOpenModalUpdate} title="Bearbeiten">
              <EditIcon />
            </IconButton>

            <IconButton color="error" onClick={handleOpenModal} title="Löschen">
              <DeleteIcon />
            </IconButton>
          </Grid>



          <ConfirmDeleteModal
            open={openModalConfirm}
            title="Delete"
            handleDelete={handleDelete}
            onClose={handleCloseModal}
            description={"Are you sure you want to delete DMS config?"}

          />

          <Grid item xs={12} sx={{ textAlign: 'left' }}>
            <Button
              variant="outlined"
              startIcon={<KeyboardBackspaceIcon />}
              onClick={handleGoingBack}
              title="back"
            >
              back
            </Button>
          </Grid>

        </Grid>

      </div >
      {
        isEditing && (
          <Dialog open={isEditing} onClose={() => setIsEditing(false)} fullWidth>
            <DialogTitle>Benutzerdaten bearbeiten</DialogTitle>
            <DialogContent>
              {error && <Typography color="error">{error}</Typography>}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label="Username *"
                  name="username"
                  value={updatedUser?.username}  
                  onChange={handleEditChange}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>

              {/* First Name */}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label="Vorname"
                  name="first_name"
                  value={updatedUser?.first_name}  
                  onChange={handleEditChange}
                />
              </Box>

              {/* Last Name */}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label="Nachname"
                  name="last_name"
                  value={updatedUser?.last_name} 
                  onChange={handleEditChange}
                />
              </Box>

              {/* Language */}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label="Sprache"
                  name="language"
                  value={updatedUser?.language}  
                  onChange={handleEditChange}
                />
              </Box>

              {/* Contact Phone */}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label="Kontaktnummer *"
                  name="contact_phone"
                  value={updatedUser?.contact_phone}
                  onChange={handleEditChange}
                />
              </Box>

              {/* Email */}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label="Email *"
                  name="email"
                  value={updatedUser?.email} 
                  onChange={handleEditChange}
                />
              </Box>

              {/* Role */}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label="Role"
                  name="role"
                  value={updatedUser?.role}  
                  onChange={handleEditChange}
                />
              </Box>



            </DialogContent>
            <DialogActions>

              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={() => handleSaveChanges()} autoFocus>
               Update
              </Button>
              {/* <Button onClick={handleSaveChanges} color="primary" startIcon={<AddIcon />}>
                Speichern
              </Button>
              <Button onClick={() => setIsEditing(false)} color="secondary" startIcon={<CancelIcon />}>
                Abbrechen
              </Button> */}
            </DialogActions>
          </Dialog>
        )
      }
    </>

  );
};

export default UserDetail;
