"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Для URL параметрів і маршрутизатора

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import ApiService from "../../app/services/apiService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useTranslations } from "next-intl";
import AccountingDialog from "@/components/modal/AccountingSoftwareDialog";
import { SelectChangeEvent } from "@mui/material";
import ConfirmDeleteModal from "@/components/modal/ConfirmDeleteModal";
import ButtonStatusCheck from "@/components/status/ButtonStatus";
import ReplayIcon from "@mui/icons-material/Replay";

type TenantDetails = {
  id?: number;
  tenant_id?: number;
  name: string;
  type: string;
  url: string;
  organization_id: string;
  event_type: string | null;
  description: string;
  additional_settings?: {
    region: string;
  };
  is_active: number;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type DetailsFormUpdateType = {
  tenant: any;
};

const dmsOptions = ["sevdesk-cloud", "lexoffice-cloud"];

const DetailsFormUpdate = ({ tenant }: DetailsFormUpdateType) => {
  console.log(tenant);

  const router = useRouter();
  const id = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoadPage, setIsLoadPage] = useState(false);
  const [modalTextColor, setModalTextColor] = useState("black");
  const [tenantDetails, setTenantDetails] = useState<TenantDetails | null>(
    null
  );
  const [addNewDetails, setAddNewDetails] = useState<any>(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    password: "",
    confirmationPassword: "",
  });
  const [selectedOption, setSelectedOption] = useState(tenantDetails?.type);
  const t = useTranslations("API");
  const [openModal, setOpenModal] = useState(false);
  const [updatedTenant, setUpdatedTenant] = useState<TenantDetails>({
    name: "",
    type: "",
    url: "",
    organization_id: "",
    event_type: null,
    description: "",
    is_active: 0,
    created_by: null,
    updated_by: null,
    created_at: "",
    updated_at: "",
    deleted_at: null,
  });
  const [initialTenant, setInitialTenant] = useState<any>();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    setSelectedOption(newValue);
    setUpdatedTenant((prevTenant: any) => ({
      ...prevTenant,
      type: newValue,
    }));
  };

  useEffect(() => {
    const bodyBackgroundColor = window.getComputedStyle(
      document.body
    ).backgroundColor;
    setModalTextColor(
      bodyBackgroundColor === "rgb(0, 0, 0)" ? "black" : "black"
    );
  }, [isEditing]);

  useEffect(() => {
    setTenantDetails(tenant);
  }, [tenant]);

  // Обробка змін в полях
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInitialTenant((prevTenant: any) => ({
      ...prevTenant,
      [name]: value,
    }));

    setUpdatedTenant((prevTenant) => ({
      ...prevTenant,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    const Auth: any = sessionStorage.getItem("AuthToken");

    const response: any = await ApiService.put(
      `accounting-software/${id.id}`,
      initialTenant,
      Auth
    );
    if (response instanceof Error) {
      const { status, variant, message } = ApiService.CheckAndShow(response, t);

      // @ts-ignore
      enqueueSnackbar(message, { variant: variant });
      setOpen(false);
    }

    if (response.status === 200 || response.success === true) {
      enqueueSnackbar("Accounting entry updated successfully!", {
        variant: "success",
      });
      setOpen(false);
    }
    // @ts-ignore
    setTenantDetails(response.data[0]);
    setIsEditing(false);
  };

  useEffect(() => {
    if (tenantDetails) {
      setUpdatedTenant((prevTenant) => ({
        ...prevTenant,
        name: tenantDetails.name || "",
        type: tenantDetails.type || "",
        url: tenantDetails.url || "",
        organization_id: tenantDetails.organization_id || "0",
        // @ts-ignore
        event_type: tenantDetails?.event_type?.document || "",
        description: tenantDetails.description || "",
        is_active: tenantDetails.is_active,
      }));
      setSelectedOption(tenantDetails.type || ""); // Оновлення вибору в Select
    }
  }, [tenantDetails]); // Виконується при зміні tenantDetails

  const openModalDetails = () => {
    setOpen(true);
  };

  return (
    <div
      id="UserDetailContainer"
      style={{
        display: "flex",
        justifyContent: "center",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <Button onClick={openModalDetails} size="small" color="primary">
        Edit
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {t("Accounting-Software.changeaccounting")}
        </DialogTitle>
        <form onSubmit={handleSaveChanges}>
          <DialogContent>
            <Typography
              variant="body1"
              component="span"
              id="alert-dialog-description"
            >
              {tenant &&
                Object.keys(tenant).map((key) => (
                  <Box key={key}>
                    <label htmlFor={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <TextField
                      id={key}
                      name={key}
                      value={tenant[key] || ""}
                      onChange={(e) => handleEditChange(e)} // Використовуємо handleEditChange
                      variant="outlined"
                      fullWidth
                    />
                  </Box>
                ))}
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>
              {t("Accounting-Software.cancel")}
            </Button>
            <Button type="submit" color="primary">
              {t("Accounting-Software.ok")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default DetailsFormUpdate;
