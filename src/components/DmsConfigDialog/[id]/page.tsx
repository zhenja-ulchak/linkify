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
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TextField, Button, IconButton } from '@mui/material';
type TenantDetails = {
    id: number;
    tenant_id: number;
    type: string;
    endpoint_url: string;
    username: string;
    api_key: string | null;
    repository: string;
    extra_settings: string;  // Передбачається, що це JSON-рядок
    created_at: string;
    updated_at: string;
};

const DetailsTableDms: React.FC = () => {
    const { id } = useParams();
    console.log(id);

    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);

    const [updatedTenant, setUpdatedTenant] = useState<TenantDetails>({
        id: 0,
        tenant_id: 0,
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

            try {
                const Auth: any = sessionStorage.getItem('AuthToken');
                const response: any = await ApiService.get(`dms-config`, Auth); //${id}
                console.log(response?.data[0][0]);
                setTenantDetails(response?.data[0][0]);
            } catch (error) {
                console.error("Fehler beim Abrufen der Daten:", error);
                setError("Fehler beim Abrufen der Daten.");
            }
        };

        fetchTenantDetails();
    }, [id]);

    // Обробка змін в полях
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (updatedTenant) {
            setUpdatedTenant({
                ...updatedTenant,
                [name]: value,
            });
        }
    };

    // Збереження змін
    // Метод для збереження змін
    const handleSaveChanges = async () => {
        const cleanedObject = removeEmptyValues(updatedTenant);  // Функція для очищення порожніх значень
        if (validateInputs(cleanedObject)) {
            try {
                const Auth: any = sessionStorage.getItem('AuthToken');
                const response: any = await ApiService.put(`dms-config/${tenantDetails?.id}`, cleanedObject, Auth);
                if (response.status === 200) {
                    console.log("Дані оновлено:", cleanedObject);
                    setIsEditing(false);
                }
            } catch (error) {
                setError("Помилка при збереженні: " + error);
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
        try {
            const Auth: any = sessionStorage.getItem('AuthToken');
            const response: any = await ApiService.delete(`dms-config/${id}`, Auth);
            if (response.status === 200) {
                console.log("Benutzer gelöscht:", updatedTenant);
                router.push("/users");
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
            <h3>Details</h3>

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
                                    <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                                    <TableCell>{tenantDetails?.id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>Tenant ID</TableCell>
                                    <TableCell>{tenantDetails?.tenant_id}</TableCell>
                                </TableRow>
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
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>Created At</TableCell>
                                    <TableCell>{tenantDetails?.created_at}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>Updated At</TableCell>
                                    <TableCell>{tenantDetails?.updated_at}</TableCell>
                                </TableRow>
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "10px" }}>
                <button
                    className="UserDetailButton"
                    title="Bearbeiten"
                    onClick={() => setIsEditing(true)}
                >
                    <EditIcon />
                </button>
                <button
                    className="UserDetailButton"
                    title="Löschen"
                    onClick={handleDelete}
                >
                    <DeleteIcon />
                </button>
            </div>

            <div id="UserDetailModalContainer">
                <button
                    className="UserDetailButton"
                    title="Zurück"
                    onClick={handleGoingBack}
                >
                    <KeyboardBackspaceIcon />
                </button>
            </div>

            {/* Якщо редагується */}
            {isEditing && (
                <div id="UserDetailModal" style={{ color: 'black' }}>
                    <div id="UserDetailModalContent" style={{ color: 'black' }}>
                        <Typography variant="h5" gutterBottom>Benutzerdaten bearbeiten</Typography>

                        {error && <div id="UserDetailModalError" style={{ color: 'red' }}>{error}</div>}

                        {/* Редагування полів */}
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

                        {/* Кнопки для збереження та скасування */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                            <IconButton
                                onClick={handleSaveChanges}
                                color="primary"
                            >
                                <AddIcon />
                            </IconButton>

                            <IconButton
                                onClick={() => setIsEditing(false)}
                                color="secondary"
                            >
                                <CancelIcon />
                            </IconButton>
                        </Box>
                    </div>
                </div>

            )}
        </div>
    );
};

export default DetailsTableDms;
