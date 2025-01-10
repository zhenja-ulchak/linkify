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
import UserUpdateDialog from "@/components/modal/UserUpdateDialog";

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
  const [addNewDetails, setAddNewDetails] = useState<any>(false);
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
      if (response?.data && Array.isArray(response.data) && response.data[0] && Array.isArray(response.data[0]) && response.data[0][0]) {
        setUser(response.data[0][0]);
      } else {
        setAddNewDetails(true)
      }
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

      return false;
    }
    setError("");
    return true;
  };

  const handleSaveChanges = async () => {
    const cleanedObject = removeEmptyValues(updatedUser);

    const response: any = await ApiService.put(
      `user/${users?.id}`,
      cleanedObject, Auth
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

  };
  const removeEmptyValues = (obj: any) => {
    return Object.fromEntries(Object.entries(obj).filter(([key, value]) => value != null && value !== ""));
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
    setOpenModalConfirm(false);

  };

  const handleOpenModal = () => {

    setOpenModalConfirm(true);
  };

  useEffect(() => {
    if (users) {
      setUpdatedUser((prevUser) => ({
        ...prevUser,
        first_name: users.first_name || "",
        last_name: users.last_name || "",
        language: users.language || "",
        username: users.username || "",
        contact_phone: users.contact_phone || 0,
        email: users.email || "",
        role: users.role || "",
        is_active: users.is_active || false,
      }));
    }
  }, [users]);




  return (
    <>

      <div id="UserDetailContainer" style={{ display: 'flex', justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>


        <Grid container spacing={2} style={{ width: '100%' }}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <h3>User Config Details</h3>
          </Grid>

          {addNewDetails ? (
            <UserUpdateDialog tenantDetails={users} />

          ) : (
            <>

              <Grid item xs={12}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className="UserDetailTableHeader">{t('feld')}</TableCell>
                        <TableCell className="UserDetailTableHeader">{t('wert')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users && (
                       <>
                       <TableRow>
                         <TableCell style={{ fontWeight: 'bold' }}>{t('id')}</TableCell>
                         <TableCell>{users.id}</TableCell>
                       </TableRow>
                       <TableRow>
                         <TableCell style={{ fontWeight: 'bold' }}>{t('first-name')}</TableCell>
                         <TableCell>{users.first_name}</TableCell>
                       </TableRow>
                       <TableRow>
                         <TableCell style={{ fontWeight: 'bold' }}>{t('last-name')}</TableCell>
                         <TableCell>{users.last_name}</TableCell>
                       </TableRow>
                       <TableRow>
                         <TableCell style={{ fontWeight: 'bold' }}>{t('language')}</TableCell>
                         <TableCell>{users.language}</TableCell>
                       </TableRow>
                       <TableRow>
                         <TableCell style={{ fontWeight: 'bold' }}>{t('username')}</TableCell>
                         <TableCell>{users.username}</TableCell>
                       </TableRow>
                       <TableRow>
                         <TableCell style={{ fontWeight: 'bold' }}>{t('phone')}</TableCell>
                         <TableCell>{users.contact_phone}</TableCell>
                       </TableRow>
                       <TableRow>
                         <TableCell style={{ fontWeight: 'bold' }}>{t('email')}</TableCell>
                         <TableCell>{users.email}</TableCell>
                       </TableRow>
                       <TableRow>
                         <TableCell style={{ fontWeight: 'bold' }}>{t('role')}</TableCell>
                         <TableCell>{users.role}</TableCell>
                       </TableRow>
                       <TableRow>
                         <TableCell style={{ fontWeight: 'bold' }}>{t('active')}</TableCell>
                         <TableCell>{users.is_active ? t('yes') : t('no')}</TableCell>
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
            </>

          )}
        



          <ConfirmDeleteModal
            open={openModalConfirm}
            title={t('delete')}
            handleDelete={handleDelete}
            onClose={handleCloseModal}
            description={t('delete-User')}

          />

          <Grid item xs={12} sx={{ textAlign: addNewDetails ? "center" : 'left' }}>
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
            <DialogTitle>User Update</DialogTitle>
            <DialogContent>
              {error && <Typography color="error">{error}</Typography>}
              <Typography variant="body1" component="span" id="alert-dialog-description">
              <Box sx={{ marginBottom: 2, marginTop: '15px' }}>
                <TextField
                  fullWidth
                  label={t('username') + ' *'}
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
                  label={t('first-name')}
                  name="first_name"
                  value={updatedUser?.first_name}
                  onChange={handleEditChange}
                />
              </Box>

              {/* Last Name */}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label={t('last-name')}
                  name="last_name"
                  value={updatedUser?.last_name}
                  onChange={handleEditChange}
                />
              </Box>

              {/* Language */}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label={t('language')}
                  name="language"
                  value={updatedUser?.language}
                  onChange={handleEditChange}
                />
              </Box>

              {/* Contact Phone */}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label={t('contact-phone') + ' *'}
                  name="contact_phone"
                  value={updatedUser?.contact_phone}
                  onChange={handleEditChange}
                />
              </Box>

              {/* Email */}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label={t('email') + ' *'}
                  name="email"
                  value={updatedUser?.email}
                  onChange={handleEditChange}
                />
              </Box>

              {/* Role */}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label={t('role')}
                  name="role"
                  value={updatedUser?.role}
                  onChange={handleEditChange}
                />
              </Box>
            </Typography>
            </DialogContent>
            <DialogActions>

              <Button onClick={() => setIsEditing(false)}>{t('cancel')}</Button>
              <Button onClick={() => handleSaveChanges()} autoFocus>
                {t('ok')}
              </Button>

            </DialogActions>
          </Dialog>
        )
      }
    </>

  );
};

export default UserDetail;
