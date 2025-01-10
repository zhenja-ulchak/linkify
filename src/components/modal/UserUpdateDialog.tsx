"use client";

import React, { useState, useEffect } from "react";
import { SelectChangeEvent } from '@mui/material';
import ApiService from "../../app/services/apiService";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TextField, Button, IconButton, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid } from '@mui/material';
import { enqueueSnackbar } from "notistack";
import { useTranslations } from 'next-intl';


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





type AccountingType = {
    tenantDetails: User | null
}

const UserUpdateDialog = ({ tenantDetails }: AccountingType) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedTenant, setUpdatedTenant] = useState<User>({
        first_name: "",
        last_name: "",
        language: "",
        username: "",
        contact_phone: 0,
        email: "",
        role: "",
        is_active: false
    });

    const [addNewDetails, setAddNewDetails] = useState<any>(false);
// @ts-ignore
    const [selectedOption, setSelectedOption] = useState<string>("");
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
        const response: any = await ApiService.post(`dms-config`, cleanedObject, Auth);
        if (response instanceof Error) {
            const { status, variant, message } = ApiService.CheckAndShow(response, t);
            console.log(message);
            // @ts-ignore
            enqueueSnackbar(message, { variant: variant });
            setOpen(false);
        }
        if (response.status === 200) {
            enqueueSnackbar(t('dms-config-details-updated-successfully'), { variant: 'success' });
            setOpen(false);
        }

    };



    // Очищення об'єкта від порожніх значень
    const removeEmptyValues = (obj: any) => {
        return Object.fromEntries(Object.entries(obj).filter(([key, value]) => value != null && value !== ""));
    };

    // useEffect(() => {
    //     if (tenantDetails) {
    //         setUpdatedTenant((prevUser) => ({
    //             ...prevUser,
    //             first_name: tenantDetails.first_name || "",
    //             last_name: tenantDetails.last_name || "",
    //             language: tenantDetails.language || "",
    //             username: tenantDetails.username || "",
    //             contact_phone: tenantDetails.contact_phone || 0,
    //             email: tenantDetails.email || "",
    //             role: tenantDetails.role || "",
    //             is_active: tenantDetails.is_active || false,
    //         }));
    //         if (tenantDetails && tenantDetails.role) {
    //             setSelectedOption(tenantDetails.role); // Set default value if role is available
    //         }
    //     }
    // }, [tenantDetails]);

    return (
        <>
            <Box sx={{ textAlign: "center", width: "100%", marginTop: '20px', marginBottom: '20px' }}>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleClickOpenUpdate}
                    title="Add new user"
                >
                    Add New User
                </Button>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle id="alert-dialog-title">
                        {"Add New User"}
                    </DialogTitle>
                    <DialogContent  sx={{ marginTop: "15px" }}>
                        <Typography variant="body1" component="span" id="alert-dialog-description">
                            {/* <Box sx={{ marginBottom: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="role-select-label">Role</InputLabel>
                                    <Select
                                        labelId="role-select-label"
                                        value={selectedOption}
                                        onChange={handleSelectChange}
                                        label="Role"
                                    >
                                        {['Admin', 'User', 'Manager'].map((role, index) => (
                                            <MenuItem key={index} value={role}>
                                                {role}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box> */}

                            <Box sx={{ marginBottom: 2, marginTop: "15px" }}>
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
                                    label="First Name"
                                    name="first_name"
                                    value={updatedTenant.first_name || ""}
                                    onChange={handleInputChange}
                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="last_name"
                                    value={updatedTenant.last_name || ""}
                                    onChange={handleInputChange}
                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Language"
                                    name="language"
                                    value={updatedTenant.language || ""}
                                    onChange={handleInputChange}
                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Contact Phone"
                                    name="contact_phone"
                                    value={updatedTenant.contact_phone || ""}
                                    onChange={handleInputChange}
                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    value={updatedTenant.email || ""}
                                    onChange={handleInputChange}
                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Is Active"
                                    name="is_active"
                                    value={updatedTenant.is_active ? 'Yes' : 'No'}
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
    );
}

export default UserUpdateDialog;