"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation"; // Для URL параметрів і маршрутизатора
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import ApiService from "../../../../src/app/services/apiService";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TextField, Button, IconButton, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid, SliderValueLabel } from '@mui/material';
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
    const router = useRouter();


    const id = useParams()
    console.log(id.id);
    
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string>("");
    const [modalTextColor, setModalTextColor] = useState("black");
    const [tenantDetails, setTenantDetails] = useState<TenantDetails | null>(null);
    const [addNewDetails, setAddNewDetails] = useState<any>(false);
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(tenantDetails?.type);
    const t = useTranslations('API');
    const [openModal, setOpenModal] = useState(false);
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
    const [initialTenant, setInitialTenant] = useState<any>();


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
        // if (!id) {
        //     console.error('Недійсний ID');
        //     return;
        // }
        const fetchTenantDetails = async () => {
        


            const Auth: any = sessionStorage.getItem('AuthToken');
            const response: any = await ApiService.get(`accounting-software/${id.id}`, Auth); //${id}
            console.log(id);
            
           console.log(response);
           
            
            if (response instanceof Error) {
                const { status, variant, message } = ApiService.CheckAndShow(response, t);

                if (status === 404) {
                    console.log(404);
                    
                }else{
                    console.log(message);
                    // @ts-ignore
                    enqueueSnackbar(message, { variant: variant });
                }
              
            }

            if (response.status === 200) {
                enqueueSnackbar(t('accounting-entry-updated-successfully'), { variant: 'success' });
                setTenantDetails(response.data);
            }

            if (response?.data && response.data) {
                setTenantDetails(response.data);
            } else {
                setAddNewDetails(true)
            }


        };

        fetchTenantDetails();
    }, [id]);

    // Обробка змін в полях
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setInitialTenant((prevTenant: any) => ({
            ...prevTenant,
            [name]: value,
        }))
        
        setUpdatedTenant((prevTenant) => ({
            ...prevTenant,
            [name]: value,
        }));

    };

   console.log(initialTenant);
   

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();

       
    

        const Auth: any = sessionStorage.getItem('AuthToken');
  
        
        const response: any = await ApiService.put(`accounting-software/${id.id}`, initialTenant, Auth);
        if (response instanceof Error) {
            const { status, variant, message } = ApiService.CheckAndShow(response, t);
            console.log(message);
            // @ts-ignore
            enqueueSnackbar(message, { variant: variant });
            setOpen(false);
        }

        if (response.status === 200 || response.success === true) {
            enqueueSnackbar('Accounting entry updated successfully!', { variant: 'success' });
            setOpen(false);
        }
        // @ts-ignore
        setTenantDetails(response.data[0]);
        setIsEditing(false);

    };


    const handleDelete = async () => {

        const Auth: any = sessionStorage.getItem('AuthToken');
        const response: any = await ApiService.delete(`accounting-software/${id}`, Auth);
        console.log(response);
        
        if (response.success === true) {
            enqueueSnackbar('Accounting entry deleted successfully!', { variant: 'success' });
            router.push("/dashboard/admin");
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

    const handleOpenModal = () => {

        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
     
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
                // @ts-ignore
                event_type: tenantDetails.event_type.document || "",
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
                    <h3>{t('Accounting-Software.details')}</h3>
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
                                                    <TableCell style={{ fontWeight: "bold" }}>{t('Accounting-Software.feld')}</TableCell>
                                                    <TableCell style={{ fontWeight: "bold" }}>{t('Accounting-Software.wert')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {tenantDetails && (
                                                    <>
                                                        <TableRow>
                                                            <TableCell>{t('Accounting-Software.name')}</TableCell>
                                                            <TableCell>{tenantDetails.name}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>{t('Accounting-Software.type')}</TableCell>
                                                            <TableCell>{tenantDetails.type}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>{t('Accounting-Software.url')}</TableCell>
                                                            <TableCell>{tenantDetails.url}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>{t('Accounting-Software.organization_id')}</TableCell>
                                                            <TableCell>{tenantDetails.organization_id}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>{t('Accounting-Software.event-type')}</TableCell>
                                                            <TableCell>{
                                                                  // @ts-ignore
                                                            tenantDetails.event_type.document ?? "N/A"}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>{t('Accounting-Software.description')}</TableCell>
                                                            <TableCell>{tenantDetails.description}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>{t('Accounting-Software.region')}</TableCell>
                                                            <TableCell>{tenantDetails.additional_settings?.region ?? "N/A"}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell>{t('Accounting-Software.active')}</TableCell>
                                                            <TableCell> {tenantDetails.is_active ? t('Accounting-Software.yes') : t('Accounting-Software.no')}</TableCell>
                                                        </TableRow>
                                                    </>
                                                ) }
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
                        title={t('delete')}
                        handleDelete={handleDelete}
                        onClose={handleCloseModal}
                        description={t('delete-Accounting-Software')}
                        
                    />
                    <Grid item xs={12} sx={{ textAlign: addNewDetails ? "center" : 'left' }}>
                        <Button
                            variant="outlined"
                            startIcon={<KeyboardBackspaceIcon />}
                            onClick={handleGoingBack}
                            title={t('Accounting-Software.back')}
                        >
                            {t('Accounting-Software.back')}
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
                    {t('Accounting-Software.changeaccounting')}
                    </DialogTitle>
                    <form onSubmit={handleSaveChanges}>
                        <DialogContent>
                            <Typography variant="body1" component="span" id="alert-dialog-description">
                                <Box sx={{ marginBottom: 2 , marginTop: "15px" }}>
                                    <FormControl fullWidth>
                                        <InputLabel id="dms-select-label">{t('Accounting-Software.type')}</InputLabel>
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
                                        label={t('Accounting-Software.url')}
                                        name="url"
                                        value={updatedTenant?.url || ""}
                                        onChange={handleEditChange}
                                    />
                                </Box>

                                <Box sx={{ marginBottom: 2 }}>
                                    <TextField
                                        fullWidth
                                        label={t('Accounting-Software.organization_id')}
                                        name="organization_id"
                                        value={updatedTenant?.organization_id || ""}
                                        onChange={handleEditChange}
                                    />
                                </Box>

                                <Box sx={{ marginBottom: 2 }}>
                                    <TextField
                                        fullWidth
                                        label={t('Accounting-Software.event-type')}
                                        name="event_type"
                                        value={
                                               // @ts-ignore
                                               updatedTenant?.event_type ?   updatedTenant?.event_type || '':  updatedTenant?.event_type?.document || ''}
                                        onChange={handleEditChange}
                                    />
                                </Box>

                                <Box sx={{ marginBottom: 2 }}>
                                    <TextField
                                        fullWidth
                                        label={t('Accounting-Software.description')}
                                        name="description"
                                        value={updatedTenant?.description || ""}
                                        onChange={handleEditChange}
                                    />
                                </Box>

                                <Box sx={{ marginBottom: 2 }}>
                                    <TextField
                                        fullWidth
                                        label={t('Accounting-Software.region')}
                                        name="additional_settings.region"
                                        value={updatedTenant?.additional_settings?.region || ""}
                                        onChange={handleEditChange}
                                    />
                                </Box>
                            </Typography>
                        </DialogContent>

                        <DialogActions>

                            <Button onClick={handleClose}>{t('Accounting-Software.cancel')}</Button>
                            <Button type="submit" color="primary">{t('Accounting-Software.ok')}</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </Grid>
        </div>
    );
};

export default DetailsTable;
