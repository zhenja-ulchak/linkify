"use client"

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Für URL-Parameter und Router
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import ApiService from "../../../../src/app/services/apiService";


type Tenant = {
    id?: number;
    company_name: string;
    address: string;
    invoice_address: string;
    license_valid_until: number;
    contact_email: string;
    invoice_email: string;
    contact_phone: number;
};

const TenantDetails: React.FC = () => {
    const { id } = useParams();
    console.log(id);

    const router = useRouter();


    const [isEditing, setIsEditing] = useState(false);
    const [updatedTenant, setUpdatedTenant] = useState<Tenant>({

        company_name: "",
        address: "",
        invoice_address: "",
        license_valid_until: 0,
        contact_email: "",
        invoice_email: "",
        contact_phone: 0,
    });
    const [error, setError] = useState<string>("");
    const [modalTextColor, setModalTextColor] = useState("black"); // Declare state outside of conditionals
    const [tenants, setTenants] = useState<Tenant[]>([]);
    console.log(tenants);


    useEffect(() => {
        const bodyBackgroundColor = window.getComputedStyle(
            document.body
        ).backgroundColor;
        if (bodyBackgroundColor === "rgb(0, 0, 0)") {
            setModalTextColor("black");
        } else {
            setModalTextColor("black");
        }
    }, [isEditing]);

    // Falls kein Benutzer gefunden wurde
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (updatedTenant) {
            setUpdatedTenant({
                ...updatedTenant,
                [name]: value,
            });
        }
    };

    // Validierung der Benutzereingaben
    const validateInputs = () => {
        if (
            // !updatedTenant.company_name ||
            // !updatedTenant.address ||
            // !updatedTenant.invoice_address ||
            !updatedTenant.contact_email ||
            !updatedTenant.invoice_email
        ) {
            setError("Alle Felder müssen ausgefüllt werden.");
            return false;
        }
        setError("");
        return true;
    };

    useEffect(() => {
        const fetchElements = async () => {
            if (!id) {
                setError("Keine gültige ID angegeben.");
                return;
            }

            try {
                // const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}tenant/${id}`);
                const Auth: any = sessionStorage.getItem('AuthToken')
                const response: any = await ApiService.get(`tenant/${id}`, Auth)
                console.log(response);



                setTenants([response.data.tenant]);

            } catch (error) {
                console.error("Fehler beim Abrufen der Daten:", error);
                setError("Fehler beim Abrufen der Daten.");
            }
        };

        fetchElements();
    }, [id]);
    const Auth: any = sessionStorage.getItem('AuthToken')


    const removeEmptyValues = (obj: { [s: string]: unknown; } | ArrayLike<unknown>) => {
        return Object.fromEntries(
          Object.entries(obj).filter(([key, value]) => value != null && value !== "")
        );
      };
      const cleanedObject = removeEmptyValues(updatedTenant);

      console.log(cleanedObject);

    const handleSaveChanges = async () => {
        if (validateInputs()) {

            try {
                const response = await ApiService.put(
                    `tenant/${id}`,
                    cleanedObject , Auth
                );
                if (!response) {
                    console.log("Benutzerdaten gespeichert:", cleanedObject);
                    setIsEditing(false);
                }
            } catch (error) {
                setError("Fehler beim Speichern:" + error)
            }
        }
    };

    const handleDelete = async () => {
        try {
            const response: any = await ApiService.delete(
                `tenant/${id}`, Auth
            );
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
        <div id="UserDetailContainer">
            <h3>Benutzer Details</h3>

            <table id="UserDetailTable">
                <thead>
                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                        <th className="UserDetailTableHeader">Feld</th>
                        <th
                            className="UserDetailTableHeader"
                        >
                            Wert
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tenants.map((tenant) => (
                        <tr key={tenant.id}>
                            <td className="UserDetailTableBody">{tenant.id}</td>
                            <td className="UserDetailTableBody">{tenant.company_name}</td>
                            <td className="UserDetailTableBody">{tenant.address}</td>
                            <td className="UserDetailTableBody">{tenant.invoice_address}</td>
                            <td className="UserDetailTableBody">{tenant.license_valid_until}</td>
                            <td className="UserDetailTableBody">{tenant.contact_email}</td>
                            <td className="UserDetailTableBody">{tenant.invoice_email}</td>
                            <td className="UserDetailTableBody">{tenant.contact_phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    marginTop: "10px",
                }}
            >
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


            {/* -------------------------------- */}
            {isEditing && (
                <div id="UserDetailModal" style={{ color: modalTextColor }}>
                    <div id="UserDetailModalContent" style={{ color: modalTextColor }}>
                        <h4>Benutzerdaten bearbeiten</h4>

                        {error && <div id="UserDetailModalError">{error}</div>}

                        {/* Firmenname, Adresse und andere Felder sind nur lesbar */}
                        <div style={{ marginBottom: "10px" }}>
                            <label className="EditPageFontColor">Firmenname:</label>
                            <input
                                type="text"
                                name="company_name"
                                value={updatedTenant.company_name}
                                onChange={handleEditChange}
                                style={{ width: "100%", padding: "8px" }}
                                placeholder={tenants[0]?.company_name}

                            />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <label className="EditPageFontColor">Adresse:</label>
                            <input
                                type="text"
                                name="address"
                                value={updatedTenant.address}
                                onChange={handleEditChange}
                                style={{ width: "100%", padding: "8px" }}
                                placeholder={tenants[0]?.address}

                            />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <label className="EditPageFontColor">Lizenz gültig bis:</label>
                            <input
                                type="text"
                                name="license_valid_until"
                                value={updatedTenant.license_valid_until}
                                onChange={handleEditChange}
                                style={{ width: "100%", padding: "8px" }}


                            />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <label className="EditPageFontColor">Kontakt-Telefon:</label>
                            <input
                                type="text"
                                name="contact_phone"
                                value={updatedTenant.contact_phone}
                                onChange={handleEditChange}
                                style={{ width: "100%", padding: "8px" }}


                            />
                        </div>

                        {/* Die änderbaren Felder */}
                        <div style={{ marginBottom: "10px" }}>
                            <label className="EditPageFontColor">Rechnungsadresse * :</label>
                            <input
                                type="text"
                                name="invoice_address"
                                value={updatedTenant.invoice_address}
                                onChange={handleEditChange}
                                style={{ width: "100%", padding: "8px" }}
                                placeholder={tenants[0]?.invoice_address}
                            />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <label className="EditPageFontColor">Kontakt-Email * :</label>
                            <input
                                type="text"
                                name="contact_email"
                                value={updatedTenant.contact_email}
                                onChange={handleEditChange}
                                style={{ width: "100%", padding: "8px" }}
                                placeholder={tenants[0]?.contact_email}
                            />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <label className="EditPageFontColor">Rechnungs-E-Mail * :</label>
                            <input
                                type="text"
                                name="invoice_email"
                                value={updatedTenant.invoice_email}
                                onChange={handleEditChange}
                                style={{ width: "100%", padding: "8px" }}
                                placeholder={tenants[0]?.invoice_email}
                            />
                        </div>

                        {/* Buttons zum Speichern und Schließen */}
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-evenly",
                            }}
                            className="CancelBtn"
                        >
                            <button
                                onClick={handleSaveChanges}
                                style={{
                                    border: "none",
                                    backgroundColor: "transparent",
                                    cursor: "pointer",
                                }}
                                title="Speichern"
                            >
                                <AddIcon style={{ transform: "scale(1.5)" }} />
                            </button>
                            <button
                                className="BtnCancel"
                                title="Schließen"
                                onClick={() => setIsEditing(false)}
                            >
                                <CancelIcon />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TenantDetails;
