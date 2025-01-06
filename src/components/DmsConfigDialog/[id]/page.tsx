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
    "Eco-dms",
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
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
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
                setTenantDetails(response?.data[0][0]);
           
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
                }
                if (response.status === 200) {
                   
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
         
                router.push("/users");
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

                    <IconButton color="error" onClick={handleDelete} title="Löschen">
                        <DeleteIcon />
                    </IconButton>
                </Grid>

                <Grid item xs={12}>
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
            >
                <DialogTitle id="alert-dialog-title">
                    {"Use Google's location service?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label="Endpoint URL"
                                name="endpoint_url"
                                value={updatedTenant.endpoint_url}
                                onChange={handleEditChange}
                                placeholder={tenantDetails?.endpoint_url}
                            />
                        </Box>
                        <Box sx={{ marginBottom: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel id="dms-select-label">DMS</InputLabel>
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
                                label="Username"
                                name="username"
                                value={updatedTenant.username}
                                onChange={handleEditChange}
                                placeholder={tenantDetails?.username}
                            />
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label="Repository"
                                name="repository"
                                value={updatedTenant.repository}
                                onChange={handleEditChange}
                                placeholder={tenantDetails?.repository}
                            />
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label="API Key"
                                name="api_key"
                                value={updatedTenant.api_key || ""}
                                onChange={handleEditChange}
                                placeholder={tenantDetails?.api_key ?? "Optional"}
                            />
                        </Box>

                        <Box sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label="Extra Settings (JSON)"
                                name="extra_settings"
                                value={updatedTenant.extra_settings}
                                onChange={handleEditChange}
                                placeholder={tenantDetails?.extra_settings}
                                multiline
                                rows={4}
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

export default DetailsTableDms;
