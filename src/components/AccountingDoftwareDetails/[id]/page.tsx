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
import AccountingDialog from "@/components/modal/AccountingSoftwareDialog";
import { SelectChangeEvent } from '@mui/material';
import ConfirmDeleteModal from '@/components/modal/ConfirmDeleteModal';




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
    const [addNewDetails, setAddNewDetails] = useState<any>(false);
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(tenantDetails?.type);
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

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {

        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
     
    };







    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value
        setSelectedOption(newValue);
        setUpdatedTenant((prevTenant: any) => ({
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
                console.log(message);
                // @ts-ignore
                enqueueSnackbar(message, { variant: variant });
            }

            if (response.status === 200) {
                enqueueSnackbar('Accounting data fetched successfully!', { variant: 'success' });
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

        setUpdatedTenant((prevTenant) => ({
            ...prevTenant,
            [name]: value,
        }));

    };



    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanedObject = removeEmptyValues(updatedTenant);
        // if (!validateInputs(cleanedObject)) {
        //     enqueueSnackbar("Please fill all required fields.", { variant: "error" });
        //     return;
        // }

        const Auth: any = sessionStorage.getItem('AuthToken');
        const response: any = await ApiService.put(`accounting-software`, cleanedObject, Auth);
        if (response instanceof Error) {
            const { status, variant, message } = ApiService.CheckAndShow(response, t);
            console.log(message);
            // @ts-ignore
            enqueueSnackbar(message, { variant: variant });
            setOpen(false);
        }

        if (response.status === 200) {
            enqueueSnackbar('Accounting entry updated successfully!', { variant: 'success' });
            setOpen(false);
        }
        // @ts-ignore
        setTenantDetails(cleanedObject);
        setIsEditing(false);

    };

    // Валідація полів
    const validateInputs = (data: any) => {
        if (!data.contact_email || !data.invoice_email) {

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
        const response: any = await ApiService.delete(`accounting-software/${id}`, Auth);
        if (response.status === 200) {
            enqueueSnackbar('Accounting entry deleted successfully!', { variant: 'success' });
            router.push("/users");
            setOpenModal(false);
        }
        if (response instanceof Error) {
            const { status, variant, message } = ApiService.CheckAndShow(response, t);
            console.log(message);
            // @ts-ignore
            enqueueSnackbar(message, { variant: variant });
            setOpenModal(false);
        }

    };



    function handleGoingBack() {
        router.back();
    }

    useEffect(() => {
        if (tenantDetails) {
            setUpdatedTenant((prevTenant) => ({
                ...prevTenant,
                name: tenantDetails.name || "",
                type: tenantDetails.type || "",
                url: tenantDetails.url || "",
                organization_id: tenantDetails.organization_id || "0",
                event_type: tenantDetails.event_type || "",
                description: tenantDetails.description || "",
                is_active: tenantDetails.is_active,

            }));
            setSelectedOption(tenantDetails.type || ''); // Оновлення вибору в Select
        }
    }, [tenantDetails]); // Виконується при зміні tenantDetails

    return (

        <div id="UserDetailContainer" style={{ display: 'flex', justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>

            <Grid container spacing={2} style={{ width: '100%' }}>
                <Grid item xs={12} style={{ textAlign: "center" }}>
                    <h3>Accounting Software Details</h3>
                    <Grid container spacing={2}>

                        {addNewDetails ? (
                            <AccountingDialog tenantDetails={tenantDetails} />
                        ) : (
                            <>
                                <Grid item xs={12}>
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell style={{ fontWeight: "bold" }}>Feld</TableCell>
                                                    <TableCell style={{ fontWeight: "bold" }}>Wert</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {tenantDetails ? (
                                                    <>
                                                        <TableRow>
                                                            <TableCell>Name</TableCell>
                                                            <TableCell>{tenantDetails.name}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Type</TableCell>
                                                            <TableCell>{tenantDetails.type}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>URL</TableCell>
                                                            <TableCell>{tenantDetails.url}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Organization ID</TableCell>
                                                            <TableCell>{tenantDetails.organization_id}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Event Type</TableCell>
                                                            <TableCell>{tenantDetails.event_type ?? "N/A"}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Description</TableCell>
                                                            <TableCell>{tenantDetails.description}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Region</TableCell>
                                                            <TableCell>{tenantDetails.additional_settings?.region ?? "N/A"}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>Active</TableCell>
                                                            <TableCell>{tenantDetails.is_active ? "Yes" : "No"}</TableCell>
                                                        </TableRow>
                                                    </>
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={2} style={{ textAlign: "center" }}>
                                                            No tenant details available.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>

                                <Grid item xs={12} display="flex" justifyContent="space-evenly">
                                    <IconButton
                                        color="primary"
                                        onClick={handleClickOpen}
                                        title="Bearbeiten"
                                    >
                                        <EditIcon />
                                    </IconButton>

                                    <IconButton color="error" onClick={handleOpenModal} title="Löschen">
                                        <DeleteIcon />
                                    </IconButton>


                                </Grid>
                            </>
                        )}
                    </Grid>
                    <ConfirmDeleteModal
                        open={openModal}
                        title="Delete Item"
                        handleDelete={handleDelete}
                        onClose={handleCloseModal}
                    />
                    <Grid item xs={12} sx={{ textAlign: addNewDetails ? "center" : 'left' }}>
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
                        {"Сhange Accounting Software"}
                    </DialogTitle>
                    <form onSubmit={handleSaveChanges}>
                        <DialogContent>
                            <Typography variant="body1" component="span" id="alert-dialog-description">
                                <Box sx={{ marginBottom: 2 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="dms-select-label">Type</InputLabel>
                                        <Select
                                            labelId="dms-select-label"
                                            value={selectedOption}
                                            onChange={handleSelectChange}
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
                                        label="Name"
                                        name="name"
                                        value={updatedTenant.name || ""}  // Заповнення значення
                                        onChange={handleEditChange}
                                    />
                                </Box>

                                <Box sx={{ marginBottom: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="URL"
                                        name="url"
                                        value={updatedTenant.url || ""}
                                        onChange={handleEditChange}
                                    />
                                </Box>

                                <Box sx={{ marginBottom: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Organization ID"
                                        name="organization_id"
                                        value={updatedTenant.organization_id || ""}
                                        onChange={handleEditChange}
                                    />
                                </Box>

                                <Box sx={{ marginBottom: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Event Type"
                                        name="event_type"
                                        value={updatedTenant.event_type || ""}
                                        onChange={handleEditChange}
                                    />
                                </Box>

                                <Box sx={{ marginBottom: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        value={updatedTenant.description || ""}
                                        onChange={handleEditChange}
                                    />
                                </Box>

                                <Box sx={{ marginBottom: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Region"
                                        name="additional_settings.region"
                                        value={updatedTenant.additional_settings?.region || ""}
                                        onChange={handleEditChange}
                                    />
                                </Box>
                            </Typography>
                        </DialogContent>

                        <DialogActions>

                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit" color="primary">Save</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Grid>
        </div>
    );
};

export default DetailsTable;
