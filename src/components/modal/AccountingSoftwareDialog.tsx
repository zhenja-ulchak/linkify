"use client";

import React, { useState, useEffect } from "react";
import { SelectChangeEvent } from '@mui/material';
import ApiService from "../../app/services/apiService";
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

};


const dmsOptions = [
    "sevdesk-cloud",
    "lexoffice-cloud",

];


type AccountingType = {
    tenantDetails: TenantDetails | null
}

const AccountingDialog = ({ tenantDetails }: AccountingType) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedTenant, setUpdatedTenant] = useState<any>({

        name: "",
        type: '',
        url: "",
        organization_id: "",
        event_type: null,
        description: "",
        is_active: 0,

    });

    const [addNewDetails, setAddNewDetails] = useState<any>(false);

    const [selectedOption, setSelectedOption] = useState<string>('');
    const t = useTranslations('API');
    const [open, setOpen] = useState(false);



    const handleClickOpenUpdate = () => {
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdatedTenant((prevTenant: any) => ({
            ...prevTenant,
            [name]: value,
        }));
    };

    const handleCloseUpdate = (event: { target: { value: string }; }) => {
        const newValue = event.target.value;
        setSelectedOption(newValue);


        setUpdatedTenant((prevTenant: any) => ({
            ...prevTenant,
            type: newValue,
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanedObject = removeEmptyValues(updatedTenant);

        const Auth: any = sessionStorage.getItem('AuthToken');
        const response: any = await ApiService.post(`accounting-software`, cleanedObject, Auth);
        if (response instanceof Error) {
            const { status, variant, message } = ApiService.CheckAndShow(response, t);
            console.log(message);
            // @ts-ignore
            enqueueSnackbar(message, { variant: variant });
            setOpen(false);
        }
        if (response.status === 200) {
            enqueueSnackbar('Accounting software details updated successfully!', { variant: 'success' });
            setOpen(false);
        }

    };



    // Очищення об'єкта від порожніх значень
    const removeEmptyValues = (obj: any) => {
        return Object.fromEntries(Object.entries(obj).filter(([key, value]) => value != null && value !== ""));
    };
    useEffect(() => {
        if (tenantDetails) {
            setUpdatedTenant((prevTenant: any) => ({
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
    }, [tenantDetails]); // Викон

    return (
        <>
            <Box sx={{ textAlign: "center", width: "100%", marginTop: '20px', marginBottom: '20px' }}>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleClickOpenUpdate}
                    title="Add new accounting-software"
                >
                    Add New Accounting Software
                </Button>
            </Box>
            <Dialog
                open={open}
                onClose={handleCloseUpdate}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle id="alert-dialog-title">
                        {"Add New Accounting Software"}
                    </DialogTitle>
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
                                    label="name"
                                    name="name"
                                    value={updatedTenant.name || ""}
                                    onChange={handleInputChange}

                                    required
                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label="URL"
                                    name="url"
                                    value={updatedTenant.url || ""}
                                    onChange={handleInputChange}

                                    required
                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Organisation ID"
                                    name="organization_id"
                                    value={updatedTenant.organization_id || ""}
                                    onChange={handleInputChange}
                                    placeholder={tenantDetails?.organization_id}

                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Event Type"
                                    name="event_type"
                                    value={updatedTenant.event_type || ""}
                                    onChange={handleInputChange}

                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    value={updatedTenant.description || ""}
                                    onChange={handleInputChange}

                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Region"
                                    name="additional_settings.region"
                                    value={updatedTenant?.additional_settings?.region}
                                    onChange={handleInputChange}

                                />
                            </Box>
                        </Typography>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" autoFocus>
                            Create
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>

    )
}

export default AccountingDialog;