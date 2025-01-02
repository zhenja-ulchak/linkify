"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Modal,
} from "@mui/material";

type Tenant = {
  id: number;
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
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [updatedTenant, setUpdatedTenant] = useState<Tenant>({
    id: 0,
    company_name: "",
    address: "",
    invoice_address: "",
    license_valid_until: 0,
    contact_email: "",
    invoice_email: "",
    contact_phone: 0,
  });
  const [error, setError] = useState<string>("");
  const [tenants, setTenants] = useState<Tenant[]>([]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedTenant((prev) => ({ ...prev, [name]: value }));
  };

  const validateInputs = () => {
    if (
      !updatedTenant.company_name ||
      !updatedTenant.address ||
      !updatedTenant.invoice_address ||
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}tenant/${id}`);
        if (response.status === 200) {
          setTenants([response.data]);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        setError("Fehler beim Abrufen der Daten.");
      }
    };

    fetchElements();
  }, [id]);

  const handleSaveChanges = async () => {
    if (validateInputs()) {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}tenant/${updatedTenant?.id}`,
          updatedTenant
        );
        if (response.status === 200) {
          setIsEditing(false);
        }
      } catch (error) {
        setError("Fehler beim Speichern:" + error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}tenant/${updatedTenant?.id}`
      );
      if (response.status === 200) {
        router.push("/users");
      }
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    }
  };

  const handleGoingBack = () => {
    router.back();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Benutzer Details
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Feld</TableCell>
              <TableCell>Wert</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map((tenant: { id: any; company_name: any; address: any; invoice_address: any; license_valid_until: any; contact_email: any; invoice_email: any; contact_phone: any; }) => (
              <TableRow key={tenant.id}>
                <TableCell>{tenant.id}</TableCell>
                <TableCell>{tenant.company_name}</TableCell>
                <TableCell>{tenant.address}</TableCell>
                <TableCell>{tenant.invoice_address}</TableCell>
                <TableCell>{tenant.license_valid_until}</TableCell>
                <TableCell>{tenant.contact_email}</TableCell>
                <TableCell>{tenant.invoice_email}</TableCell>
                <TableCell>{tenant.contact_phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "space-evenly" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => setIsEditing(true)}
        >
          Bearbeiten
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          Löschen
        </Button>
        <Button
          variant="outlined"
          startIcon={<KeyboardBackspaceIcon />}
          onClick={handleGoingBack}
        >
          Zurück
        </Button>
      </Box>

      <Modal open={isEditing} onClose={() => setIsEditing(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Benutzerdaten bearbeiten
          </Typography>

          {error && <Typography color="error">{error}</Typography>}

          <TextField
            label="Firmenname:"
            name="company_name"
            fullWidth
            margin="normal"
            value={updatedTenant.company_name}
            onChange={handleEditChange}
          />

          
           <TextField
            label="Adresse:"
            name="address"
            fullWidth
            margin="normal"
            value={updatedTenant.address}
            onChange={handleEditChange}
          />


           <TextField
            label="Lizenz gültig bis:"
            name="license_valid_until"
            fullWidth
            margin="normal"
            value={updatedTenant.license_valid_until}
            onChange={handleEditChange}
          />


           <TextField
            label="Kontakt-Telefon:"
            name="contact_phone"
            fullWidth
            margin="normal"
            value={updatedTenant.contact_phone}
            onChange={handleEditChange}
          />


          <TextField
            label="Rechnungsadresse *"
            name="invoice_address"
            fullWidth
            margin="normal"
            value={updatedTenant.invoice_address}
            onChange={handleEditChange}
          />

          <TextField
            label="Kontakt-Email * :"
            name="contact_email"
            fullWidth
            margin="normal"
            value={updatedTenant.contact_email}
            onChange={handleEditChange}
          />

          <TextField
            label="Rechnungs-E-Mail"
            name="invoice_email"
            fullWidth
            margin="normal"
            value={updatedTenant.invoice_email}
            onChange={handleEditChange}
          />

          <Box sx={{ display: "flex", justifyContent: "space-evenly", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleSaveChanges}
            >
              Speichern
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CancelIcon />}
              onClick={() => setIsEditing(false)}
            >
              Schließen
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TenantDetails;
