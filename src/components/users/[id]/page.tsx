"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ApiService from "../../../../src/app/services/apiService";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import ConfirmDeleteModal from "@/components/modal/ConfirmDeleteModal";
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
  const Auth: any = sessionStorage.getItem("AuthToken");

  const { id } = useParams();
  const router = useRouter();
  const [initialTenant, setInitialTenant] = useState<any>();
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
    is_active: false,
  });
  const [users, setUser] = useState<User | null>(null);
  const t = useTranslations("API");

  useEffect(() => {
    const fetchElements = async () => {
      if (!id) {
        setError("Keine gültige ID angegeben.");
        return;
      }

      const response: any = await ApiService.get(`/user/${id}`, Auth);
      if (
        response?.data &&
        Array.isArray(response.data) &&
        response.data[0] &&
        Array.isArray(response.data[0]) &&
        response.data[0][0]
      ) {
        setUser(response.data[0][0]);
      } else {
        setAddNewDetails(true);
      }
      if (response.status === 200 || response.success === true) {
        enqueueSnackbar(t("user-details-fetched-successfully"), {
          variant: "success",
        });
      }
      if (response instanceof Error) {
        const { status, variant, message } = ApiService.CheckAndShow(
          response,
          t
        );

        // @ts-ignore
        enqueueSnackbar(message, { variant: variant });
      }
    };

    fetchElements();
  }, [id]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInitialTenant((prevTenant: any) => ({
      ...prevTenant,
      [name]: value,
    }));

    setUpdatedUser({
      ...updatedUser,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
    const response: any = await ApiService.put(
      `user/${users?.id}`,
      initialTenant,
      Auth
    );
    if (response.status === 200 || response.success === true) {
      enqueueSnackbar(t("new-user-created-successfully"), {
        variant: "success",
      });
      setIsEditing(false);
    }

    if (response instanceof Error) {
      const { status, variant, message } = ApiService.CheckAndShow(response, t);

      // @ts-ignore
      enqueueSnackbar(message, { variant: variant });
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    const response: any = await ApiService.delete(
      `user/${updatedUser?.id}`,
      Auth
    );
    if (response.status === 200 || response.success === true) {
      enqueueSnackbar(t("user-deleted-successfully"), { variant: "success" });
      router.push("/users");
    }
    if (response instanceof Error) {
      const { status, variant, message } = ApiService.CheckAndShow(response, t);

      // @ts-ignore
      enqueueSnackbar(message, { variant: variant });
    }
  };
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
      <div
        id="UserDetailContainer"
        style={{
          display: "flex",
          justifyContent: "center",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <Grid container spacing={2} style={{ width: "100%" }}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <h3>{t("User-deteling.User-Config-Details")}</h3>
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
                        <TableCell className="UserDetailTableHeader">
                          {t("User-deteling.feld")}
                        </TableCell>
                        <TableCell className="UserDetailTableHeader">
                          {t("User-deteling.wert")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users && (
                        <>
                          <TableRow>
                            <TableCell style={{ fontWeight: "bold" }}>
                              {"id"}
                            </TableCell>
                            <TableCell>{users.id}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: "bold" }}>
                              {t("User-deteling.first-name")}
                            </TableCell>
                            <TableCell>{users.first_name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: "bold" }}>
                              {t("User-deteling.last-name")}
                            </TableCell>
                            <TableCell>{users.last_name}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: "bold" }}>
                              {t("User-deteling.language")}
                            </TableCell>
                            <TableCell>{users.language}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: "bold" }}>
                              {t("username")}
                            </TableCell>
                            <TableCell>{users.username}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: "bold" }}>
                              {t("User-deteling.phone")}
                            </TableCell>
                            <TableCell>{users.contact_phone}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: "bold" }}>
                              {t("User-deteling.email")}
                            </TableCell>
                            <TableCell>{users.email}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: "bold" }}>
                              {t("User-deteling.role")}
                            </TableCell>
                            <TableCell>{users.role}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ fontWeight: "bold" }}>
                              {t("User-deteling.active")}
                            </TableCell>
                            <TableCell>
                              {users.is_active
                                ? t("User-deteling.yes")
                                : t("User-deteling.no")}
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="space-evenly">
                <IconButton
                  color="primary"
                  onClick={handleOpenModalUpdate}
                  title="Bearbeiten"
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  color="error"
                  onClick={handleOpenModal}
                  title="Löschen"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </>
          )}

          <ConfirmDeleteModal
            open={openModalConfirm}
            title={t("delete")}
            handleDelete={handleDelete}
            onClose={handleCloseModal}
            description={t("delete-User")}
          />

          <Grid
            item
            xs={12}
            sx={{ textAlign: addNewDetails ? "center" : "left" }}
          >
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
      </div>
      {isEditing && (
        <Dialog open={isEditing} onClose={() => setIsEditing(false)} fullWidth>
          <DialogTitle>{t("user-update")}</DialogTitle>
          <DialogContent>
            {error && <Typography color="error">{error}</Typography>}
            <Typography
              variant="body1"
              component="span"
              id="alert-dialog-description"
            >
              <Box sx={{ marginBottom: 2, marginTop: "15px" }}>
                <TextField
                  fullWidth
                  label={t("username")}
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
                  label={t("User-deteling.first-name")}
                  name="first_name"
                  value={updatedUser?.first_name}
                  onChange={handleEditChange}
                />
              </Box>

              {/* Last Name */}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label={t("User-deteling.last-name")}
                  name="last_name"
                  value={updatedUser?.last_name}
                  onChange={handleEditChange}
                />
              </Box>

              {/* Language */}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label={t("User-deteling.language")}
                  name="language"
                  value={updatedUser?.language}
                  onChange={handleEditChange}
                />
              </Box>

              {/* Contact Phone */}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label={t("User-deteling.phone") + " *"}
                  name="contact_phone"
                  value={updatedUser?.contact_phone}
                  onChange={handleEditChange}
                />
              </Box>

              {/* Email */}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label={t("User-deteling.email") + " *"}
                  name="email"
                  value={updatedUser?.email}
                  onChange={handleEditChange}
                />
              </Box>

              {/* Role */}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label={t("User-deteling.role")}
                  name="role"
                  value={updatedUser?.role}
                  onChange={handleEditChange}
                />
              </Box>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditing(false)}>{t("cancel")}</Button>
            <Button onClick={() => handleSaveChanges()} autoFocus>
              {t("User-deteling.ok")}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default UserDetail;
