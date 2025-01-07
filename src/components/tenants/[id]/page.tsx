"use client";

import ApiService from "../../../../src/app/services/apiService";
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
  Grid,
  Paper,
  IconButton,
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
  console.log(id);

  const router = useRouter();


  const [isEditing, setIsEditing] = useState(false);
  const [updatedTenant, setUpdatedTenant] = useState<Tenant>({
    id: 1,
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
        console.log(response?.data[0]);



        setTenants(response?.data[0]);

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
          cleanedObject, Auth
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
    <Box sx={{ p: 3 }} style={{ display: 'flex', justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>


      <Grid container spacing={2} style={{ width: '100%' }}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <h3>Details</h3>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Feld</TableCell>
                  <TableCell>Wert</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenants.map((tenant) => (
                  <React.Fragment key={tenant.id}>
                    <TableRow key={`${tenant.id}-id`}>
                      <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell>{tenant.id}</TableCell>
                    </TableRow>
                    <TableRow key={`${tenant.id}-company_name`}>
                      <TableCell style={{ fontWeight: 'bold' }}>Firmenname</TableCell>
                      <TableCell>{tenant.company_name}</TableCell>
                    </TableRow>
                    <TableRow key={`${tenant.id}-address`}>
                      <TableCell style={{ fontWeight: 'bold' }}>Adresse</TableCell>
                      <TableCell>{tenant.address}</TableCell>
                    </TableRow>
                    <TableRow key={`${tenant.id}-invoice_address`}>
                      <TableCell style={{ fontWeight: 'bold' }}>Rechnungsadresse</TableCell>
                      <TableCell>{tenant.invoice_address}</TableCell>
                    </TableRow>
                    <TableRow key={`${tenant.id}-license_valid_until`}>
                      <TableCell style={{ fontWeight: 'bold' }}>Lizenz gültig bis</TableCell>
                      <TableCell>{tenant.license_valid_until}</TableCell>
                    </TableRow>
                    <TableRow key={`${tenant.id}-contact_email`}>
                      <TableCell style={{ fontWeight: 'bold' }}>Kontakt-Email</TableCell>
                      <TableCell>{tenant.contact_email}</TableCell>
                    </TableRow>
                    <TableRow key={`${tenant.id}-invoice_email`}>
                      <TableCell style={{ fontWeight: 'bold' }}>Rechnungs-E-Mail</TableCell>
                      <TableCell>{tenant.invoice_email}</TableCell>
                    </TableRow>
                    <TableRow key={`${tenant.id}-contact_phone`}>
                      <TableCell style={{ fontWeight: 'bold' }}>Kontakt-Telefon</TableCell>
                      <TableCell>{tenant.contact_phone}</TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        
        <Grid item xs={12} display="flex" justifyContent="space-evenly">
                    <IconButton color="primary" onClick={() => setIsEditing(true)} title="Bearbeiten">
                        <EditIcon />
                    </IconButton>

                    <IconButton color="error" onClick={handleDelete} title="Löschen">
                        <DeleteIcon />
                    </IconButton>
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        startIcon={<KeyboardBackspaceIcon />}
                        onClick={handleGoingBack}
                        title="  back"
                    >
                          back
                    </Button>
                </Grid>

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
              label="Rechnungsadresse:"
              name="invoice_address"
              fullWidth
              margin="normal"
              value={updatedTenant.invoice_address}
              onChange={handleEditChange}
            />

            <TextField
              label="Kontakt-Email:"
              name="contact_email"
              fullWidth
              margin="normal"
              value={updatedTenant.contact_email}
              onChange={handleEditChange}
            />

            <TextField
              label="Rechnungs-E-Mail:"
              name="invoice_email"
              fullWidth
              margin="normal"
              value={updatedTenant.invoice_email}
              onChange={handleEditChange}
            />

            <Box sx={{ display: "flex", justifyContent: "space-evenly", mt: 2 }}>

              
             
              <Button
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveChanges}
              >
                OK
              </Button>
            </Box>
          </Box>
        </Modal>
      </Grid>
    </Box>

  );
};

export default TenantDetails;
