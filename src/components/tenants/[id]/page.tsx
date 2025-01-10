"use client";

import ApiService from "../../../../src/app/services/apiService";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import AddIcon from "@mui/icons-material/Add";
import { useTranslations } from 'next-intl';
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
import { enqueueSnackbar } from "notistack";
import ConfirmDeleteModal from '@/components/modal/ConfirmDeleteModal';

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

  const [openModal, setOpenModal] = useState(false);
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
  const t = useTranslations('API');

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
      setError(t('Tenant.alle-felder'));
      return false;
    }
    setError("");
    return true;
  };

  useEffect(() => {
    const fetchElements = async () => {
      if (!id) {
        setError(t('Tenant.alle-felder'));
        return;
      }

      const Auth: any = sessionStorage.getItem('AuthToken')
      const response: any = await ApiService.get(`tenant/${id}`, Auth)
      if (response instanceof Error) {
        const { status, variant, message } = ApiService.CheckAndShow(response, t);

        // @ts-ignore
        enqueueSnackbar(message, { variant: variant });
      }


      if (response.status === 200) {
        enqueueSnackbar(t('tenant-details-fetched-successfully'), { variant: 'success' });

      }
      setTenants(response?.data[0]);
      console.log(response?.data[0]);


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
        setError(t('Tenant.fehler-beim:') + error)
      }

    }
  };

  const handleDelete = async () => {

    const response: any = await ApiService.delete(
      `tenant/${id}`, Auth
    );
    if (response instanceof Error) {
      const { status, variant, message } = ApiService.CheckAndShow(response, t);
      console.log(message);
      // @ts-ignore
      enqueueSnackbar(message, { variant: variant });
    }


    if (response.status === 200) {
      enqueueSnackbar(t('tenant-deleted-successfully'), { variant: 'success' });
    }

  };

  function handleGoingBack() {
    router.back();
  }


  const handleOpenModal = () => {

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);

  };

  useEffect(() => {

    if (tenants[0]) {
      setUpdatedTenant((prevTenant) => ({
        ...prevTenant,
        company_name: tenants[0].company_name || "",
        address: tenants[0].address || "",
        invoice_address: tenants[0].invoice_address || "",
        license_valid_until: tenants[0].license_valid_until || 0,
        contact_email: tenants[0].contact_email || "",
        invoice_email: tenants[0].invoice_email || "",
        contact_phone: tenants[0].contact_phone || 0,
      }));

      // Якщо необхідно, оновлюємо додаткові поля для select
      // if (tenants[0] && tenants[0].type) {
      //     setSelectedOption(tenants[0].type); // Встановлюємо значення по умолчанию
      // }
    }
  }, [tenants[0]]);




  return (
    <Box sx={{ p: 3 }} style={{ display: 'flex', justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>


      <Grid container spacing={2} style={{ width: '100%' }}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <h3>{t('Tenant.Tenant-details')}</h3>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('Tenant.feld')}</TableCell>
                  <TableCell>{t('Tenant.wert')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenants.map((tenant) => (
                  <React.Fragment key={tenant.id}>
                    <TableRow key={`${tenant.id}-id`}>
                      <TableCell style={{ fontWeight: 'bold' }}>{t('Tenant.id')}</TableCell>
                      <TableCell>{tenant.id}</TableCell>
                    </TableRow>
                    <TableRow key={`${tenant.id}-company_name`}>
                      <TableCell style={{ fontWeight: 'bold' }}>{t('Tenant.firmenname')}</TableCell>
                      <TableCell>{tenant.company_name}</TableCell>
                    </TableRow>
                    <TableRow key={`${tenant.id}-address`}>
                      <TableCell style={{ fontWeight: 'bold' }}>{t('Tenant.adresse')}</TableCell>
                      <TableCell>{tenant.address}</TableCell>
                    </TableRow>
                    <TableRow key={`${tenant.id}-invoice_address`}>
                      <TableCell style={{ fontWeight: 'bold' }}>{t('Tenant.rechnungsadresse')}</TableCell>
                      <TableCell>{tenant.invoice_address}</TableCell>
                    </TableRow>
                    <TableRow key={`${tenant.id}-license_valid_until`}>
                      <TableCell style={{ fontWeight: 'bold' }}>{t('Tenant.lizenzgultigbis')}</TableCell>
                      <TableCell>{tenant.license_valid_until}</TableCell>
                    </TableRow>
                    <TableRow key={`${tenant.id}-contact_email`}>
                      <TableCell style={{ fontWeight: 'bold' }}>{t('Tenant.kontakt-email')}</TableCell>
                      <TableCell>{tenant.contact_email}</TableCell>
                    </TableRow>
                    <TableRow key={`${tenant.id}-invoice_email`}>
                      <TableCell style={{ fontWeight: 'bold' }}>{t('Tenant.rechungs-email')}</TableCell>
                      <TableCell>{tenant.invoice_email}</TableCell>
                    </TableRow>
                    <TableRow key={`${tenant.id}-contact_phone`}>
                      <TableCell style={{ fontWeight: 'bold' }}>{t('Tenant.kontakt-telefon')}</TableCell>
                      <TableCell>{tenant.contact_phone}</TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>


        <Grid item xs={12} display="flex" justifyContent="space-evenly">
          <IconButton color="primary" onClick={() => setIsEditing(true)} title={t('Tenant.bearbeiten')}>
            <EditIcon />
          </IconButton>

          <IconButton color="error" onClick={handleOpenModal} title={t('Tenant.loschen')}>
            <DeleteIcon />
          </IconButton>
        </Grid>
        <ConfirmDeleteModal
          open={openModal}
          title={t('delete')}
          handleDelete={handleDelete}
          onClose={handleCloseModal}
          description={t('delete-Tenants')}

        />
        <Grid item xs={12}>
          <Button
            variant="outlined"
            startIcon={<KeyboardBackspaceIcon />}
            onClick={handleGoingBack}
            title={t('Tenant.back')}
          >
            {t('Tenant.back')}
          </Button>
        </Grid>

        <Modal open={isEditing} onClose={() => setIsEditing(false)} >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
            {t('Tenant.benutzerdaten')}
            </Typography>

            {error && <Typography color="error">{error}</Typography>}

            <TextField
              label={t('Tenant.firmenname')}
              name="company_name"
              fullWidth
              margin="normal"
              value={updatedTenant.company_name}
              onChange={handleEditChange}
            />

            <TextField
              label={t('Tenant.adresse')}
              name="address"
              fullWidth
              margin="normal"
              value={updatedTenant.address}
              onChange={handleEditChange}
            />

            <TextField
              label={t('Tenant.lizenzgultigbis')}
              name="license_valid_until"
              fullWidth
              margin="normal"
              value={updatedTenant.license_valid_until}
              onChange={handleEditChange}
            />

            <TextField
              label={t('Tenant.lizenzgultigbis')}
              name="contact_phone"
              fullWidth
              margin="normal"
              value={updatedTenant.contact_phone}
              onChange={handleEditChange}
            />

            <TextField
              label={t('Tenant.rechnungsadresse')}
              name="invoice_address"
              fullWidth
              margin="normal"
              value={updatedTenant.invoice_address}
              onChange={handleEditChange}
            />

            <TextField
              label={t('Tenant.kontakt-email')}
              name="contact_email"
              fullWidth
              margin="normal"
              value={updatedTenant.contact_email}
              onChange={handleEditChange}
            />

            <TextField
              label={t('Tenant.rechungs-email')}
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
                {t('Tenant.cancel')}
              </Button>
              <Button
                onClick={handleSaveChanges}
              >
                {t('Tenant.ok')}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Grid>
    </Box>

  );
};

export default TenantDetails;
