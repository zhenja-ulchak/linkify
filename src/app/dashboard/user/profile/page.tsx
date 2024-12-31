"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

// Interface für das Formular-Datenobjekt
interface FormData {
  username: string;
  companyName: string;
  name: string;
  firstName: string;
  street: string;
  postalCode: string;
  city: string;
  region: string;
  country: string;
  addressAdditional: string;
  licenseValidity: string; // Lizenz Gültigkeit
  group: string; // Gruppe
  id: string; // ID, wird hidden
}

export default function Profile() {
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
    username: "",
    companyName: "",
    name: "",
    firstName: "",
    street: "",
    postalCode: "",
    city: "",
    region: "",
    country: "",
    addressAdditional: "",
    licenseValidity: "",
    group: "",
    id: "", // ID bleibt hidden
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}user/profile`,
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
            value={formData.username}
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
              value={formData.companyName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="inputStyleProfile"
              value={formData.name}
              onChange={handleInputChange}
              onInput={handleNameInput}
            />
            <input
              type="text"
              name="firstName"
              placeholder="Vorname"
              className="inputStyleProfile"
              value={formData.firstName}
              onChange={handleInputChange}
              onInput={handleNameInput}
            />
            <input
              type="text"
              name="street"
              placeholder="Straße und Hausnummer"
              className="inputStyleProfile"
              value={formData.street}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postleitzahl"
              className="inputStyleProfile"
              value={formData.postalCode}
              onChange={handleInputChange}
              onInput={handlePostalCodeInput}
            />
            <input
              type="text"
              name="city"
              placeholder="Ort"
              className="inputStyleProfile"
              value={formData.city}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="region"
              placeholder="Region"
              className="inputStyleProfile"
              value={formData.region}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="country"
              placeholder="Land"
              className="inputStyleProfile"
              value={formData.country}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="addressAdditional"
              placeholder="Adresszusatz"
              className="inputStyleProfile"
              value={formData.addressAdditional}
              onChange={handleInputChange}
            />
          </div>
        </fieldset>

        {/* Firmenname Section */}
        <div>
          <label style={{ color: "#000" }}>+ Firmenname:</label>
          <input
            type="text"
            name="companyName"
            placeholder="Firmenname"
            className="inputStyleProfile"
            value={formData.companyName}
            onChange={handleInputChange}
          />
        </div>

        {/* Lizenz Gültigkeit Section (optional) */}
        <div>
          <label style={{ color: "#000" }}>- Lizenz Gültigkeit</label>
          <input
            type="text"
            name="licenseValidity"
            placeholder="Lizenz Gültigkeit"
            className="inputStyleProfile"
            value={formData.licenseValidity}
            onChange={handleInputChange}
          />
        </div>

        {/* Gruppe Section */}
        <div>
          <label style={{ color: "#000" }}>- Gruppe</label>
          <input
            type="text"
            name="group"
            placeholder="Gruppe"
            className="inputStyleProfile"
            value={formData.group}
            onChange={handleInputChange}
          />
        </div>

        {/* ID (Hidden, nicht im Formular anzeigen) */}
        <input
          type="hidden"
          name="id"
          value={formData.id}
          onChange={handleInputChange}
        />

        {/* Submit Button */}
        <button type="submit" id="SubmitButtonProfile">
          Speichern
        </button>
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
