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

type TenantDetails = {
    id?: number;
    tenant_id?: number;
    name: string;
    type: string;
    url: string;
    organization_id: string;
    event_type: string | null;
    description: string;
    additional_settings?: {
        region: string;
    };
    is_active: number;
    created_by: string | null;
    updated_by: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

const dmsOptions = [
    "sevdesk-cloud",
    "lexoffice-cloud",

];

const DetailsTable: React.FC = () => {
    const { id } = useParams();
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string>("");
    const [modalTextColor, setModalTextColor] = useState("black");
    const [tenantDetails, setTenantDetails] = useState<TenantDetails | null>(null);
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const t = useTranslations('API');


    const [updatedTenant, setUpdatedTenant] = useState<TenantDetails>({

        name: "",
        type: '',
        url: "",
        organization_id: "",
        event_type: null,
        description: "",
        is_active: 0,
        created_by: null,
        updated_by: null,
        created_at: "",
        updated_at: "",
        deleted_at: null,
    });
    console.log(selectedOption);


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
                const response: any = await ApiService.get(`accounting-software`, Auth); //${id}
                if (response instanceof Error) {
                            const { status, variant, message } = ApiService.CheckAndShow(response, t);
                                    // @ts-ignore
                    enqueueSnackbar(message, { variant: variant});
                }
                setTenantDetails(response?.data[0][0]);
        };

        fetchTenantDetails();
    }, [id]);

    // Обробка змін в полях
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setUpdatedTenant((prevTenant) => ({
            ...prevTenant,
            [name]: value,
        }));

    };



    const handleSaveChanges = async () => {



        const cleanedObject = removeEmptyValues(updatedTenant);
        console.log(cleanedObject);
        if (validateInputs(cleanedObject)) {
            try {
                console.log(cleanedObject);

                const Auth: any = sessionStorage.getItem('AuthToken');
                const response: any = await ApiService.put(`accounting-software/${tenantDetails?.id}`, cleanedObject, Auth);
                if (response.status === 200) {
                    console.log("Дані оновлено:", cleanedObject);
                    setIsEditing(false);
                }
                if (response instanceof Error) {
                    const { status, variant, message } = ApiService.CheckAndShow(response, t);
                            console.log(message);
                            // @ts-ignore
                            enqueueSnackbar(message, { variant: variant });
                }
            } catch (error) {
                setError("Помилка при збереженні: " + error);
            }
        }
    };

    // Валідація полів
    const validateInputs = (data: any) => {
        if (!data.contact_email || !data.invoice_email) {
            setError("Всі поля повинні бути заповнені.");
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
        try {
            const Auth: any = sessionStorage.getItem('AuthToken');
            const response: any = await ApiService.delete(`accounting-software/${id}`, Auth);
            if (response.status === 200) {
                console.log("Benutzer gelöscht:", updatedTenant);
                router.push("/users");
            }
            if (response instanceof Error) {
                enqueueSnackbar(response.message, { variant: 'error' });
            }
        } catch (error) {
            console.error("Fehler beim Löschen:", error);
        }
    };

    function handleGoingBack() {
        router.back();
    }

    return (

        <div id="UserDetailContainer" style={{ display: 'flex', justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>

            <Grid container spacing={2} style={{ width: '100%' }}>
                <Grid item xs={12} style={{ textAlign: "center" }}>
                    <h3>Details</h3>
                </Grid>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
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
                                            <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                                            <TableCell>{tenantDetails.name}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 'bold' }}>Type</TableCell>
                                            <TableCell>{tenantDetails.type}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 'bold' }}>URL</TableCell>
                                            <TableCell>{tenantDetails.url}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 'bold' }}>Organization ID</TableCell>
                                            <TableCell>{tenantDetails.organization_id}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 'bold' }}>Event Type</TableCell>
                                            <TableCell>{tenantDetails.event_type ?? "N/A"}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
                                            <TableCell>{tenantDetails.description}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 'bold' }}>Region</TableCell>
                                            <TableCell>{tenantDetails.additional_settings?.region}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 'bold' }}>Active</TableCell>
                                            <TableCell>{tenantDetails.is_active ? "Yes" : "No"}</TableCell>
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

                    <IconButton color="error" onClick={handleDelete} title="Löschen">
                        <DeleteIcon />
                    </IconButton>
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        startIcon={<KeyboardBackspaceIcon />}
                        onClick={handleGoingBack}
                        title="  back"
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
            >
                <DialogTitle id="alert-dialog-title">
                    {"Use Google's location service?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">

                        <Box sx={{ marginBottom: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel id="dms-select-label">type</InputLabel>
                                <Select
                                    labelId="dms-select-label"
                                    value={selectedOption}
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
                                label="URL"
                                name="url"
                                value={updatedTenant.url}
                                onChange={handleEditChange}
                                placeholder={tenantDetails?.url}
                            />
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label="Organisation ID"
                                name="organization_id"
                                value={updatedTenant.organization_id}
                                onChange={handleEditChange}
                                placeholder={tenantDetails?.organization_id}
                            />
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label="Event Type"
                                name="event_type"
                                value={updatedTenant.event_type}
                                onChange={handleEditChange}
                                placeholder={tenantDetails?.event_type ?? "N/A"}
                            />
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={updatedTenant.description}
                                onChange={handleEditChange}
                                placeholder={tenantDetails?.description}
                            />
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label="Region"
                                name="additional_settings.region"
                                value={updatedTenant.additional_settings?.region}
                                onChange={handleEditChange}
                                placeholder={tenantDetails?.additional_settings?.region}
                            />
                        </Box>




                    </DialogContentText>
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

export default DetailsTable;
