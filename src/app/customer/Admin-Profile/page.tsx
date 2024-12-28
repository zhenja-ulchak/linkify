"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

// Interface für das Formular-Datenobjekt
interface FormData {
    company_name: string;
    address: string;
    invoice_address: string;
    license_valid_until: string;
    contact_email: string;
    invoice_email: string;
    contact_phone: number;
}

export default function Adminprofile() {
    const fieldsetStyle = {
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "10px",
    };

    const legendStyle = {
        padding: "0 5px",
        fontWeight: "bold",
        color: "#000",
    };

    const [formData, setFormData] = useState<FormData>({
        company_name: "",
        address: "",
        invoice_address: "",
        license_valid_until: "",
        contact_email: "",
        invoice_email: "",
        contact_phone: 0,
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const id = useParams()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}tenant/${id}`,
                    {
                        headers: { "Content-Type": "application/json" },
                        // withCredentials: true,
                    }
                );
                setFormData(response.data);
                setSuccessMessage(response.data.message);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setErrorMessage(error.message); // Fehlernachricht des Error-Objekts
                } else {
                    setErrorMessage("Ein unbekannter Fehler ist aufgetreten."); // Fallback für unbekannte Fehler
                }
            }
        };

        fetchData();
    }, []);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BASE_URL}user/profile`,
                formData
            );
            setSuccessMessage(response.data.message);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorMessage(error.message); // Fehlernachricht aus dem Error-Objekt
            } else {
                setErrorMessage("Ein unbekannter Fehler ist aufgetreten.");
            }
        }
    }


    const handleNameInput = (e: React.FormEvent<HTMLInputElement>) => {
        if (!/^[A-Za-z]+$/.test(e.currentTarget.value)) {
            e.preventDefault();
        }
    };

    const handlePostalCodeInput = (e: React.FormEvent<HTMLInputElement>) => {
        if (!/^[0-9]+$/.test(e.currentTarget.value)) {
            e.preventDefault();
        }
    };

    return (
        <div id="ContainerProfile">
            <form onSubmit={handleSubmit} id="FormProfile">
                <h1 style={{ textAlign: "center", margin: "0", color: "#000" }}>
                    Profile
                </h1>
                {/* Benutzer Section */}
                <div>
                    <label style={{ color: "#000" }}>* Benutzer:</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Benutzername"
                        required
                        className="inputStyleProfile"
                        value={formData.company_name}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Rechnungsadresse Section */}
                <fieldset style={fieldsetStyle}>
                    <legend style={legendStyle}>+ Rechnungsadresse</legend>
                    <div
                        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
                    >
                        <input
                            type="text"
                            name="companyName"
                            placeholder="Firmenname"
                            className="inputStyleProfile"
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            className="inputStyleProfile"
                            value={formData.invoice_address}
                            onChange={handleInputChange}
                            onInput={handleNameInput}
                        />
                        <input
                            type="text"
                            name="firstName"
                            placeholder="Vorname"
                            className="inputStyleProfile"
                            value={formData.license_valid_until}
                            onChange={handleInputChange}
                            onInput={handleNameInput}
                        />
                        <input
                            type="text"
                            name="street"
                            placeholder="Straße und Hausnummer"
                            className="inputStyleProfile"
                            value={formData.contact_email}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="postalCode"
                            placeholder="Postleitzahl"
                            className="inputStyleProfile"
                            value={formData.invoice_email}
                            onChange={handleInputChange}
                            onInput={handlePostalCodeInput}
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="Ort"
                            className="inputStyleProfile"
                            value={formData.contact_phone}
                            onChange={handleInputChange}
                        />
                    </div>
                </fieldset>

                {/* Firmenname Section */}
            </form>


            {errorMessage && (

                <div><p>{errorMessage}</p></div>
            )}

            {successMessage && (
                <div><p>{successMessage}</p></div>

            )}
        </div>
    );
}
