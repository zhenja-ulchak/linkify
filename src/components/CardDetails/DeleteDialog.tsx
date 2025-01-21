"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Для URL параметрів і маршрутизатора

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import ApiService from "../../../src/app/services/apiService";
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

const dmsOptions = ["sevdesk-cloud", "lexoffice-cloud"];

const DetailsTable: React.FC = () => {
  const router = useRouter();

  const id = useParams();

  const [tenantDetails, setTenantDetails] = useState<TenantDetails | null>(
    null
  );

  const [selectedOption, setSelectedOption] = useState(tenantDetails?.type);
  const t = useTranslations("API");
  const [openModal, setOpenModal] = useState(false);
 
  const [initialTenant, setInitialTenant] = useState<any>();
  





  const handleDelete = async () => {
    const Auth: any = sessionStorage.getItem("AuthToken");
    const response: any = await ApiService.delete(
      `accounting-software/${id}`,
      Auth
    );

    if (response.success === true) {
      enqueueSnackbar("Accounting entry deleted successfully!", {
        variant: "success",
      });
      router.push("/dashboard/admin");
      setOpenModal(false);
    }
    if (response instanceof Error) {
      const { status, variant, message } = ApiService.CheckAndShow(response, t);

      // @ts-ignore
      enqueueSnackbar(message, { variant: variant });
      setOpenModal(false);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
      <Grid container spacing={2} style={{ width: "100%" }}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Grid container spacing={2}>
            <>
              <Grid item xs={12} display="flex" justifyContent="space-evenly">
                <IconButton
                  color="error"
                  onClick={handleOpenModal}
                  title="Löschen"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </>
          </Grid>
          <ConfirmDeleteModal
            open={openModal}
            title={t("delete")}
            handleDelete={handleDelete}
            onClose={handleCloseModal}
            description={t("delete-Accounting-Software")}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default DetailsTable;
