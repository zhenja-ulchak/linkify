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
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TextField, Button } from '@mui/material';

type TenantDetails = {
    id?: number;
    tenant_id: number;
    name: string;
    type: string;
    url: string;
    organization_id: string;
    event_type: string | null;
    description: string;
    additional_settings: {
        region: string;
    };
    is_active: number;
    created_by: string | null;
    updated_by: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

const DetailsTable: React.FC = () => {
    const { id } = useParams();
    console.log(id);

    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [updatedTenant, setUpdatedTenant] = useState<TenantDetails>({
        tenant_id: 0,
        name: "",
        type: "",
        url: "",
        organization_id: "",
        event_type: null,
        description: "",
        additional_settings: {
            region: ""
        },
        is_active: 0,
        created_by: null,
        updated_by: null,
        created_at: "",
        updated_at: "",
        deleted_at: null,
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
                const response: any = await ApiService.get(`accounting-software`, Auth); //${id}
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
                const response:any = await ApiService.put(`accounting-software/${tenantDetails?.id}`, cleanedObject, Auth);
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
        } catch (error) {
            console.error("Fehler beim Löschen:", error);
        }
    };

    function handleGoingBack() {
        router.back();
    }

    return (
        <div id="UserDetailContainer" style={{ display: 'flex', justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h3>Benutzer Details</h3>

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
                                    <TableCell>{tenantDetails.id}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>Tenant ID</TableCell>
                                    <TableCell>{tenantDetails.tenant_id}</TableCell>
                                </TableRow>
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
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>Created At</TableCell>
                                    <TableCell>{tenantDetails.created_at}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>Updated At</TableCell>
                                    <TableCell>{tenantDetails.updated_at}</TableCell>
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



                        {/* Кнопки для збереження та скасування */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                            <Button
                                onClick={handleSaveChanges}
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                            >
                                Speichern
                            </Button>

                            <Button
                                onClick={() => setIsEditing(false)}
                                variant="outlined"
                                color="secondary"
                                startIcon={<CancelIcon />}
                            >
                                Schließen
                            </Button>
                        </Box>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailsTable;
