"use client";

import React, { useState, useEffect } from "react";
import { InputAdornment, SelectChangeEvent } from '@mui/material';
import ApiService from "../../app/services/apiService";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TextField, Button, IconButton, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid } from '@mui/material';
import { enqueueSnackbar } from "notistack";
import { useTranslations } from 'next-intl';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type TenantDetails = {
    id?: number;
    tenant_id?: number;
    type: string;
    endpoint_url: string;
    username: string;
    api_key: string | null;
    endpoint_port: string
    repository: string;
    extra_settings: string;  // Передбачається, що це JSON-рядок
    created_at: string;
    updated_at: string;
};


const dmsOptions = [
    "SharePoint",
    "EcoDms", ,
    "DocuWare",
    "M-Files",
    "OpenText",
    "Alfresco",
    "Laserfiche",
];



const DMSDialog = () => {
    // const [isEditing, setIsEditing] = useState(false);
    const [showPasswords, setShowPasswords] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [updatedTenant, setUpdatedTenant] = useState<any>({
        type: "",
        endpoint_url: "",
        username: "",
        api_key: null,
        repository: "",
        extra_settings: "",
        endpoint_port: "",
        created_at: "",
        updated_at: "",
    });

    // const [addNewDetails, setAddNewDetails] = useState<any>(false);
    // @ts-ignore
    const [selectedOption, setSelectedOption] = useState<string>("");
    const t = useTranslations('API');
    const [open, setOpen] = useState(false);

    const validatePassword = (password: string): boolean => {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z\d!@#$%^&*?]{8,}$/;
        return passwordRegex.test(password);
    };


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
        if (password !== confirmPassword) {
            enqueueSnackbar(t('Registrierung.passworter'), { variant: 'error' });    
        }
    
        if (!validatePassword(password)) {
            enqueueSnackbar(t('Registrierung.pass-muss'), { variant: 'error' });
        }


console.log(  {
    ...cleanedObject,
    password,
    "password_confirmation": password,
  } );


        const Auth: any = sessionStorage.getItem('AuthToken');
        console.log(cleanedObject);

        const response: any = await ApiService.post(`dms-config`, 
            
          {
            ...cleanedObject,
            password,
            "password_confirmation": password,
          }  , Auth);

        console.log(response);

       

        if (response instanceof Error) {
            const { status, variant, message } = ApiService.CheckAndShow(response, t);
            console.log(message);
            // @ts-ignore
            enqueueSnackbar(message, { variant: variant });
            setOpen(false);
        }
        if (response.status === 200) {
            enqueueSnackbar(t('messages.dataSavedSuccessfully'), { variant: 'success' });
            setOpen(false);
        }

    };



    // Очищення об'єкта від порожніх значень
    const removeEmptyValues = (obj: any) => {
        return Object.fromEntries(Object.entries(obj).filter(([key, value]) => value != null && value !== ""));
    };
    //  useEffect(() => {
    //         if (tenantDetails) {
    //             setUpdatedTenant((prevTenant: any) => ({
    //                 ...prevTenant,
    //                 endpoint_url: tenantDetails.endpoint_url || "",
    //                 type: tenantDetails.type || "",
    //                 username: tenantDetails.username || "",
    //                 repository: tenantDetails.repository || "",
    //                 api_key: tenantDetails.api_key || "",
    //                 extra_settings: tenantDetails.extra_settings || "",
    //             }));
    //             if (tenantDetails && tenantDetails.type) {
    //                 setSelectedOption(tenantDetails.type); // Встановлюємо значення по умолчанию, якщо є
    //             } // Оновлення вибору в Select
    //         }
    //     }, [tenantDetails]);

    return (
        <>
            <Box sx={{ textAlign: "center", width: "100%", marginTop: '20px', marginBottom: '20px' }}>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleClickOpenUpdate}
                    title={t('Accounting-Software.addNewAccountingSoftware')}

                >
                    {t('Accounting-Software.addnewdmsconfig')}
                </Button>
            </Box>
            <Dialog
                open={open}
                onClose={handleCloseUpdate}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle id="alert-dialog-title">
                        {t('Accounting-Software.addnewdmsconfig')}
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" component="span" id="alert-dialog-description">
                            <Box sx={{ marginBottom: 2, marginTop: "15px" }}>
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
                                    label={t('Accounting-Software.username')}
                                    name="username"
                                    value={updatedTenant.username || ""}
                                    onChange={handleInputChange}

                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label={t('Accounting-Software.endpoint_url')}
                                    name="endpoint_url"
                                    value={updatedTenant.endpoint_url || ""}
                                    onChange={handleInputChange}

                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label={t('Accounting-Software.repository')}
                                    name="repository"
                                    value={updatedTenant.repository || ""}
                                    onChange={handleInputChange}

                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label={t('Accounting-Software.endpoint_port')}
                                    name="port"
                                    value={""}
                                    onChange={handleInputChange}

                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label={t('Accounting-Software.api_key')}
                                    name="api_key"
                                    value={updatedTenant.api_key || ""}
                                    onChange={handleInputChange}

                                />
                            </Box>

                            <Grid item xs={12} sx={{ marginBottom: 2 }}>
                                <TextField
                                    label={t('Registrierung.passwort')}
                                    type={showPasswords ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    fullWidth
                                    className="ContainerVisibility"

                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPasswords(!showPasswords)}
                                                >
                                                    {showPasswords ? (
                                                        <VisibilityOffIcon className="VisibilityOFF" />
                                                    ) : (
                                                        <VisibilityIcon className="VisibilityONN" />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label={t('Registrierung.passwort-bestatigen')}
                                    type={showPasswords ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    fullWidth
                                    className="ContainerVisibility"

                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPasswords(!showPasswords)}
                                                >
                                                    {showPasswords ? (
                                                        <VisibilityOffIcon className="VisibilityOFF" />
                                                    ) : (
                                                        <VisibilityIcon className="VisibilityONN" />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>

                            {/* <Box sx={{ marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label={t('Accounting-Software.extra_settings')}
                                    name="extra_settings"
                                    value={updatedTenant.extra_settings || ""}
                                    onChange={handleInputChange}

                                    multiline
                                    rows={4}
                                />
                            </Box> */}
                        </Typography>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>{t('Accounting-Software.cancel')}</Button>
                        <Button type="submit" autoFocus>
                            {t('Accounting-Software.create')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>

    )
}

export default DMSDialog;