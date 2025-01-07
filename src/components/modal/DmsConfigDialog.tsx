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
    created_by: string | null;
    updated_by: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
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


type AccountingType = {
    tenantDetails: TenantDetails | null
}

const AccountingDialog = ({ tenantDetails }: AccountingType) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedTenant, setUpdatedTenant] = useState<any>({
        type: "",
        endpoint_url: "",
        username: "",
        api_key: null,
        repository: "",
        extra_settings: "",
        created_at: "",
        updated_at: "",
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
        const response: any = await ApiService.post(`accounting-software/${tenantDetails?.tenant_id}`, cleanedObject, Auth);

        if (response.status === 200) {
            enqueueSnackbar('Data saved successfully!', { variant: 'success' });
            setOpen(false);
        }

    };



    // Очищення об'єкта від порожніх значень
    const removeEmptyValues = (obj: any) => {
        return Object.fromEntries(Object.entries(obj).filter(([key, value]) => value != null && value !== ""));
    };


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
                        {"Add New DMS config"}
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
                                    label="Username"
                                    name="username"
                                    value={updatedTenant.username || ""}
                                    onChange={handleInputChange}
                             
                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Repository"
                                    name="repository"
                                    value={updatedTenant.repository || ""}
                                    onChange={handleInputChange}
                          
                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label="API Key"
                                    name="api_key"
                                    value={updatedTenant.api_key || ""}
                                    onChange={handleInputChange}
                               
                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Extra Settings (JSON)"
                                    name="extra_settings"
                                    value={updatedTenant.extra_settings || ""}
                                    onChange={handleInputChange}
                                
                                    multiline
                                    rows={4}
                                />
                            </Box>
                        </Typography>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" autoFocus>
                            Update
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>

    )
}

export default AccountingDialog;