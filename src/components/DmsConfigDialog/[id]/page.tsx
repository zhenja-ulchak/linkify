"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Для URL параметрів і маршрутизатора
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import ApiService from "../../../../src/app/services/apiService";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TextField, Button, IconButton, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid } from '@mui/material';
import { enqueueSnackbar } from "notistack";
import { useTranslations } from 'next-intl';
import DMSDialog from "@/components/modal/DmsConfigDialog";
import ConfirmDeleteModal from '@/components/modal/ConfirmDeleteModal';

type TenantDetails = {
    id?: number;
    tenant_id?: number;
    type: string;
    endpoint_url: string;
    username: string;
    api_key: string | null;
    repository: string;
    extra_settings: string;  // Передбачається, що це JSON-рядок
    created_at: string;
    updated_at: string;
};

const dmsOptions = [
    "SharePoint",
    "ecodms",
    "DocuWare",
    "M-Files",
    "OpenText",
    "Alfresco",
    "Laserfiche",
];

const DetailsTableDms: React.FC = () => {
    const { id } = useParams();
    console.log(id);

    const t = useTranslations('API');

    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    // const [open, setOpen] = React.useState(false);
    const [updatedTenant, setUpdatedTenant] = useState<TenantDetails>({

        type: "",
        endpoint_url: "",
        username: "",
        api_key: null,
        repository: "",
        extra_settings: "",
        created_at: "",
        updated_at: "",
    });
    const [error, setError] = useState<string>("");
    const [modalTextColor, setModalTextColor] = useState("black");
    const [tenantDetails, setTenantDetails] = useState<TenantDetails | null>(null);
    const [addNewDetails, setAddNewDetails] = useState<any>(false);
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(tenantDetails?.type);
    console.log(tenantDetails?.type);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleChange = (event: { target: { value: string }; }) => {
        const newValue = event.target.value;
        setSelectedOption(newValue);


        setUpdatedTenant((prevTenant) => ({
            ...prevTenant,
            type: newValue,
        }));
    };

    useEffect(() => {
        const bodyBackgroundColor = window.getComputedStyle(document.body).backgroundColor;
        setModalTextColor(bodyBackgroundColor === "rgb(0, 0, 0)" ? "black" : "black");
    }, [isEditing]);

    // Для отримання даних про користувача
    useEffect(() => {
        const fetchTenantDetails = async () => {
            if (!id) {
                setError("Keine gültige ID angegeben.");
                return;
            }


            const Auth: any = sessionStorage.getItem('AuthToken');
            const response: any = await ApiService.get(`dms-config`, Auth); //${id}
            if (response instanceof Error) {
                const { status, variant, message } = ApiService.CheckAndShow(response, t);
                console.log(message);
                // @ts-ignore
                enqueueSnackbar(message, { variant: variant });
            }
            if (response.status === 200) {
                enqueueSnackbar('DMS configuration fetched successfully!', { variant: 'success' });
            }
            if (response?.data && Array.isArray(response.data) && response.data[0] && Array.isArray(response.data[0]) && response.data[0][0]) {
                setTenantDetails(response.data[0][0]);
            } else {
                setAddNewDetails(true)
            }

        };

        fetchTenantDetails();
    }, [id]);

    // Обробка змін в полях
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setUpdatedTenant({
            ...updatedTenant,
            [name]: value,
        });

    };
    console.log(updatedTenant);

    // Збереження змін
    // Метод для збереження змін
    const handleSaveChanges = async () => {
        const cleanedObject = removeEmptyValues(updatedTenant);  // Функція для очищення порожніх значень

        if (validateInputs(cleanedObject)) {

            const Auth: any = sessionStorage.getItem('AuthToken');
            const response: any = await ApiService.put(`dms-config/${tenantDetails?.id}`, cleanedObject, Auth);
            if (response instanceof Error) {
                const { status, variant, message } = ApiService.CheckAndShow(response, t);
                console.log(message);
                // @ts-ignore
                enqueueSnackbar(message, { variant: variant });
                setOpen(false);
            }
            if (response.status === 200) {
                enqueueSnackbar('DMS configuration updated successfully!', { variant: 'success' });
                setOpen(false);
            }

        }
    };

    // Валідація полів
    const validateInputs = (data: any) => {
        if (!data.endpoint_url || !data.username || !data.repository) {
            setError("Alle Felder müssen ausgefüllt werden.");
            return false;
        }
        setError("");
        return true;
    };

    // Очищення об'єкта від порожніх значень
    const removeEmptyValues = (obj: any) => {
        return Object.fromEntries(Object.entries(obj).filter(([key, value]) => value != null && value !== ""));
    };
    const handleDelete = async () => {

        const Auth: any = sessionStorage.getItem('AuthToken');
        const response: any = await ApiService.delete(`dms-config/${id}`, Auth);
        if (response instanceof Error) {
            const { status, variant, message } = ApiService.CheckAndShow(response, t);
            console.log(message);
            // @ts-ignore
            enqueueSnackbar(message, { variant: variant });
        }
        if (response.status === 200) {
            enqueueSnackbar('DMS configuration deleted successfully!', { variant: 'success' });
            router.push("/users");
        }

    };

    function handleGoingBack() {
        router.back();
    }
    useEffect(() => {
        if (tenantDetails) {
            setUpdatedTenant((prevTenant) => ({
                ...prevTenant,
                endpoint_url: tenantDetails.endpoint_url || "",
                type: tenantDetails.type || "",
                username: tenantDetails.username || "",
                repository: tenantDetails.repository || "",
                api_key: tenantDetails.api_key || "",
                extra_settings: tenantDetails.extra_settings || "",
            }));
            if (tenantDetails && tenantDetails.type) {
                setSelectedOption(tenantDetails.type); // Встановлюємо значення по умолчанию, якщо є
            } // Оновлення вибору в Select
        }
    }, [tenantDetails]);


    const handleOpenModal = () => {

        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);

    };


    return (
        <div id="UserDetailContainer" style={{ display: 'flex', justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <Grid container spacing={2} style={{ width: '100%' }}>
                <Grid item xs={12} style={{ textAlign: "center" }}>
                    <h3>DMS Config Details</h3>
                </Grid>

                {!addNewDetails ?
                    (
                        <>
                            <DMSDialog tenantDetails={tenantDetails} />
                        </>
                    ) :

                    (

                        <>
                            <Grid item xs={12}>
                                <TableContainer component={Paper} style={{ width: '100%' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Feld</TableCell>
                                                <TableCell>Wert</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {tenantDetails && (
                                                <>

                                                    <TableRow>
                                                        <TableCell style={{ fontWeight: 'bold' }}>Type</TableCell>
                                                        <TableCell>{tenantDetails?.type}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell style={{ fontWeight: 'bold' }}>Endpoint URL</TableCell>
                                                        <TableCell>{tenantDetails?.endpoint_url}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell style={{ fontWeight: 'bold' }}>Username</TableCell>
                                                        <TableCell>{tenantDetails?.username}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell style={{ fontWeight: 'bold' }}>Repository</TableCell>
                                                        <TableCell>{tenantDetails?.repository}</TableCell>
                                                    </TableRow>

                                                </>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={12} display="flex" justifyContent="space-evenly">
                                <IconButton color="primary" onClick={handleClickOpen} title="Bearbeiten">
                                    <EditIcon />
                                </IconButton>

                                <IconButton color="error" onClick={handleOpenModal} title="Löschen">
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>

                        </>
                    )

                }
                <ConfirmDeleteModal
                    open={openModal}
                    title="Delete"
                    handleDelete={handleDelete}
                    onClose={handleCloseModal}
                    description={"Are you sure you want to delete DMS config?"}

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
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <DialogTitle id="alert-dialog-title">
                    {"DMS"}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" component="span" id="alert-dialog-description">
                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label="Endpoint URL"
                                name="endpoint_url"
                                value={updatedTenant.endpoint_url}
                                onChange={handleEditChange}

                            />
                        </Box>
                        <Box sx={{ marginBottom: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel id="dms-select-label">DMS</InputLabel>
                                <Select
                                    labelId="dms-select-label"
                                    value={selectedOption || 'fgedfdhg'}
                                    onChange={handleChange}
                                    label="DMS"
                                >
                                    {dmsOptions.map((option, index) => (
                                        <MenuItem key={index} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>



                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                value={updatedTenant.username}
                                onChange={handleEditChange}

                            />
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label="Repository"
                                name="repository"
                                value={updatedTenant.repository}
                                onChange={handleEditChange}

                            />
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label="API Key"
                                name="api_key"
                                value={updatedTenant.api_key || ""}
                                onChange={handleEditChange}

                            />
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label="Extra Settings (JSON)"
                                name="extra_settings"
                                value={updatedTenant.extra_settings}
                                onChange={handleEditChange}

                                multiline
                                rows={4}
                            />
                        </Box>
                    </Typography>
                </DialogContent>
                <DialogActions>

                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => handleSaveChanges()} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default DetailsTableDms;
