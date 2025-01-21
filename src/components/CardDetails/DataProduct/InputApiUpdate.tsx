"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Для URL параметрів і маршрутизатора

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import ApiService from "../../../app/services/apiService";
import {

  Typography,
  Box,
  TextField,
  Button,
 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
 
  DialogContent,
  DialogActions,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useTranslations } from "next-intl";

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

const DetailsDelete: React.FC = () => {
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

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

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
    const fetchTenantDetails = async () => {
      const Auth: any = sessionStorage.getItem("AuthToken");
      const response: any = await ApiService.get(
        `accounting-software/${id.id}`,
        Auth
      ); //${id}

      if (response instanceof Error) {
        const { status, variant, message } = ApiService.CheckAndShow(
          response,
          t
        );

        if (status === 404) {
          console.log(404);
        } else {
          // @ts-ignore
          enqueueSnackbar(message, { variant: variant });
        }
      }

      if (response.status === 200 || response.success === true) {
        enqueueSnackbar(t("accounting-entry-updated-successfully"), {
          variant: "success",
        });
        setTenantDetails(response.data);
        setIsLoadPage(true);
      }

      if (response?.data && response.data) {
        setTenantDetails(response.data);
      } else {
        setAddNewDetails(true);
      }
    };

    fetchTenantDetails();
  }, [id]);

  // Обробка змін в полях
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInitialTenant((prevTenant: any) => ({
      ...prevTenant,
      [name]: value,
    }));

    setUpdatedTenant((prevTenant: any) => ({
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

 



  return (
  <>
        <form onSubmit={handleSaveChanges}>
            <DialogContent>
              <Typography
                variant="body1"
                component="span"
                id="alert-dialog-description"
              >
                <Box sx={{ marginBottom: 2, marginTop: "15px" }}>
                  <FormControl fullWidth>
                    <InputLabel id="dms-select-label">
                      {t("Accounting-Software.type")}
                    </InputLabel>
                    <Select
                      labelId="dms-select-label"
                      value={selectedOption}
                      onChange={handleSelectChange}
                      label="DMS"
                    >
                      {/* {dmsOptions.map((option, index) => (
                        <MenuItem key={index} value={option}>
                          {option}
                        </MenuItem>
                      ))} */}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                  <TextField
                    fullWidth
                    label={t("Accounting-Software.url")}
                    name="url"
                    value={updatedTenant?.url || ""}
                    onChange={handleEditChange}
                  />
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                  <TextField
                    fullWidth
                    label={t("Accounting-Software.organization_id")}
                    name="organization_id"
                    value={updatedTenant?.organization_id || ""}
                    onChange={handleEditChange}
                  />
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                  <TextField
                    fullWidth
                    label={t("Accounting-Software.event-type")}
                    name="event_type"
                    value={
                      updatedTenant?.event_type
                        ? updatedTenant?.event_type || ""
                        : // @ts-ignore
                          updatedTenant?.event_type?.document || ""
                    }
                    onChange={handleEditChange}
                  />
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                  <TextField
                    fullWidth
                    label={t("Accounting-Software.description")}
                    name="description"
                    value={updatedTenant?.description || ""}
                    onChange={handleEditChange}
                  />
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                  <TextField
                    fullWidth
                    label={t("Accounting-Software.region")}
                    name="additional_settings.region"
                    value={updatedTenant?.additional_settings?.region || ""}
                    onChange={handleEditChange}
                  />
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                  <TextField
                    fullWidth
                    label={t("New-password")}
                    name="password"
                    required
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={!!formData.password && formData.password.length < 8} // Перевірка на мінімальну довжину
                    helperText={
                      formData.password && formData.password.length < 8
                        ? t("password-length-error")
                        : ""
                    } // Повідомлення про помилку
                  />
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                  <TextField
                    fullWidth
                    label={t("confirmation-password")}
                    name="confirmationPassword"
                    required
                    type="password"
                    value={formData.confirmationPassword}
                    onChange={handleInputChange}
                    error={formData.confirmationPassword !== formData.password} // Перевірка на збіг паролів
                    helperText={
                      formData.confirmationPassword !== formData.password
                        ? t("password-mismatch")
                        : ""
                    } // Повідомлення про помилку
                  />
                </Box>
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
  </>
  );
};

export default DetailsDelete;
